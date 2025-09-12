import google.generativeai as genai
import pandas as pd
import os
import json
import re
import ast
from config import GEMINI_API_KEY

LABEL_FILE = "data/labeled_entries.csv"
os.makedirs("data", exist_ok=True)

genai.configure(api_key=GEMINI_API_KEY)

# Canonical parameter names (order matters)
PARAMS = [
    "Mood Disturbance",
    "Sleep Disruption",
    "Appetite Issues",
    "Academic Disengagement",
    "Social Withdrawal",
]


# -------------------- UTILS -------------------- #
def safe_extract_text(resp):
    """
    Try many common shapes to extract text from the response object.
    Return a string (may be empty).
    """
    if resp is None:
        return ""

    # 1) check candidates properly
    try:
        if hasattr(resp, "candidates") and resp.candidates:
            cand = resp.candidates[0]
            if cand.content and cand.content.parts:
                return "".join(p.text for p in cand.content.parts if hasattr(p, "text"))
    except Exception as e:
        print("[DEBUG] Failed to extract from candidates:", e)

    # 2) fallback to `text` accessor if it exists
    try:
        if hasattr(resp, "text") and isinstance(resp.text, str):
            return resp.text
    except Exception:
        pass

    # 3) final fallback: convert to str
    return str(resp)



def maybe_scale(v):
    """Ensure float within 0–10 scale."""
    try:
        fv = float(v)
    except Exception:
        return None

    if 0 <= fv <= 1:
        return round(fv * 10, 1)
    if fv > 10:
        return 10.0
    if fv < 0:
        return 0.0
    return round(fv, 1)


def normalize_scores_dict(d):
    """Normalize any dict into PARAMS with floats 0–10."""
    out = {}
    lower_map = {p.lower(): p for p in PARAMS}

    for k, v in d.items():
        if not isinstance(k, str):
            continue
        key_low = k.strip().lower()

        # Direct match
        if key_low in lower_map:
            out[lower_map[key_low]] = maybe_scale(v)
            continue

        # Fuzzy match
        for param in PARAMS:
            if param.lower() in key_low or key_low in param.lower():
                out[param] = maybe_scale(v)
                break

    # Ensure all keys exist
    for p in PARAMS:
        out.setdefault(p, None)

    return out


def parse_scores_from_text(text):
    """Parse JSON or numeric scores from Gemini output text."""
    if not text:
        return None

    # 1) Try strict JSON
    try:
        return normalize_scores_dict(json.loads(text))
    except Exception:
        pass

    # 2) Try Python dict-like
    try:
        data = ast.literal_eval(text)
        if isinstance(data, dict):
            return normalize_scores_dict(data)
    except Exception:
        pass

    # 3) Try extracting {...} JSON fragment
    m = re.search(r"(\{.*\})", text, re.S)
    if m:
        fragment = m.group(1)
        try:
            return normalize_scores_dict(json.loads(fragment))
        except Exception:
            try:
                return normalize_scores_dict(ast.literal_eval(fragment))
            except Exception:
                pass

    # 4) Key-based numeric parsing
    parsed = {}
    for param in PARAMS:
        pat = re.compile(re.escape(param) + r"\s*[:\-]\s*([0-9]+(?:\.[0-9]+)?)", re.I)
        m = pat.search(text)
        if m:
            parsed[param] = maybe_scale(m.group(1))

    if len(parsed) == len(PARAMS):
        return normalize_scores_dict(parsed)

    # 5) Grab first 5 numbers → map in order
    nums = re.findall(r"([0-9]+(?:\.[0-9]+)?)", text)
    if len(nums) >= len(PARAMS):
        vals = [maybe_scale(x) for x in nums[: len(PARAMS)]]
        return {p: v for p, v in zip(PARAMS, vals)}

    return None


def heuristic_label(text):
    """Fallback heuristic labeling (simple keyword search)."""
    t = text.lower()
    s = {
        "Mood Disturbance": 8.0 if any(x in t for x in ["stressed", "anxious", "depressed", "sad", "overwhelmed"])
                           else 2.5 if any(x in t for x in ["happy", "relaxed", "good", "great", "energized"])
                           else 5.0,
        "Sleep Disruption": 8.0 if any(x in t for x in ["late", "insomnia", "tired", "sleeping poorly", "couldn't sleep"])
                           else 4.0,
        "Appetite Issues": 7.5 if any(x in t for x in ["skipped", "no appetite", "hungry", "didn't eat"])
                          else 4.0,
        "Academic Disengagement": 7.0 if any(x in t for x in ["assignment", "classes", "lecture", "studying", "exam"])
                                     and any(x in t for x in ["couldn't", "didn't", "struggled", "confused", "failed", "behind"])
                                  else 5.0 if any(x in t for x in ["assignment", "classes", "lecture", "studying", "exam"])
                                  else 3.0,
        "Social Withdrawal": 2.5 if any(x in t for x in ["friends", "movie", "party", "meeting"])
                           else 6.0,
    }
    return s


def save_label(entry_id, scores, user_id=None, date=None):
    """Save labeled scores into CSV."""
    if os.path.exists(LABEL_FILE):
        df = pd.read_csv(LABEL_FILE)
    else:
        df = pd.DataFrame(columns=["entry_id", "user_id", "date"] + PARAMS)

    row = {"entry_id": entry_id, "user_id": user_id, "date": date}
    for p in PARAMS:
        row[p] = scores.get(p, "")

    df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    df.to_csv(LABEL_FILE, index=False)


# -------------------- MAIN -------------------- #
def label_entry(entry_id, entry_text, user_id=None, date=None):
    """Label a journal entry using Gemini or fallback heuristics."""
    model = genai.GenerativeModel("gemini-2.5-flash")
    prompt = f"""
    Analyze this student journal entry and provide numeric scores (0–10) for:

    {PARAMS}

    Rules:
    - 0 = no issues; 10 = severe issues.
    - Output ONLY a valid JSON object with keys exactly: {PARAMS}.
    Example:
    {{
      "Mood Disturbance": 4.5,
      "Sleep Disruption": 7.2,
      "Appetite Issues": 3.0,
      "Academic Disengagement": 6.1,
      "Social Withdrawal": 5.8
    }}

    Journal entry:
    \"\"\"{entry_text}\"\"\"
    """

    try:
       resp = model.generate_content(prompt)  # no temperature arg
    except Exception as e:
        print("Gemini call error:", e)
        resp = None

    resp_text = safe_extract_text(resp) if resp is not None else ""
    if not resp_text.strip():
        print("[DEBUG] Empty Gemini response, using heuristic fallback")
        parsed = heuristic_label(entry_text)
    else:
        parsed = parse_scores_from_text(resp_text) or heuristic_label(entry_text)

# ✅ Ensure all keys are present
    for p in PARAMS:
       if parsed.get(p) is None:
         parsed[p] = 5.0

    save_label(entry_id, parsed, user_id, date)
    return parsed
