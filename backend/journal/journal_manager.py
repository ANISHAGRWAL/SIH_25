import pandas as pd
import os
from gemini_labeler import label_entry   # ✅ import your Gemini labeler

JOURNAL_DIR = "data"
JOURNAL_FILE = os.path.join(JOURNAL_DIR, "journal_entries.csv")

# Ensure folder exists
os.makedirs(JOURNAL_DIR, exist_ok=True)


def save_journal_entry(user_id: str, date: str, entry: str):
    """
    Save a new journal entry and also auto-label it using Gemini.
    """
    if os.path.exists(JOURNAL_FILE):
        df = pd.read_csv(JOURNAL_FILE)
    else:
        df = pd.DataFrame(columns=["id", "date", "user_id", "entry"])
    
    new_id = len(df) + 1

    # Save new entry
    df = pd.concat([df, pd.DataFrame([{
        "id": new_id,
        "date": date,
        "user_id": user_id,
        "entry": entry
    }])], ignore_index=True)
    
    df.to_csv(JOURNAL_FILE, index=False)
    print(f"[DEBUG] Entry saved for user={user_id}, date={date}, file={JOURNAL_FILE}")

    # ✅ Auto-label with Gemini AI (save scores into labeled_entries.csv)
    scores = label_entry(
        entry_id=new_id,
        entry_text=entry,
        user_id=user_id,
        date=date
    )

    # Ensure no NaN floats in scores before returning (important for JSON response)
    clean_scores = {k: float(v) if pd.notna(v) else 0.0 for k, v in scores.items()}

    print(f"[DEBUG] AI scores saved for entry_id={new_id}: {clean_scores}")
    return clean_scores


def load_journal_entries(user_id: str = None):
    """
    Load all journal entries, optionally filtered by user_id.
    Returns a list of dicts (JSON-friendly).
    """
    if os.path.exists(JOURNAL_FILE):
        df = pd.read_csv(JOURNAL_FILE)
        if user_id:
            df = df[df["user_id"] == user_id]

        # ✅ Convert DataFrame to JSON-friendly format
        return df.to_dict(orient="records")

    return []
