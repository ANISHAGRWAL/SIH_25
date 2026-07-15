// src/controllers/ollamaTool.ts
import axios from "axios";
import axiosRetry from "axios-retry";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434"; // now pointing to local Ollama
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "alibayram/medgemma:4b";

// timeouts: increase while testing. Reduce once you're on GPU or model warmed.
const REQUEST_TIMEOUT = parseInt(process.env.OLLAMA_REQUEST_TIMEOUT || "600000", 10); // 10 minutes for testing
const MAX_RETRIES = parseInt(process.env.OLLAMA_MAX_RETRIES || "2", 10);

const client = axios.create({
  baseURL: OLLAMA_HOST,
  timeout: REQUEST_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

// retries for transient network/server errors
axiosRetry(client, {
  retries: MAX_RETRIES,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (err: any) => {
    const isNetworkErr = axiosRetry.isNetworkOrIdempotentRequestError(err);
    const status5xx = (err?.response?.status ?? 0) >= 500;
    return isNetworkErr || status5xx;
  },
});

function _parsePotentialStreamedResponse(raw: any): string {
  try {
    if (!raw) return "";

    if (typeof raw === "object") {
      if (raw.message && typeof raw.message === "object" && typeof raw.message.content === "string") {
        return raw.message.content;
      }
      if (typeof raw.content === "string") return raw.content;
      if (Array.isArray(raw.messages)) {
        const parts = raw.messages
          .filter((m: any) => m?.role === "assistant" && (m.content || m.message?.content))
          .map((m: any) => (m.content ?? m.message?.content ?? "").toString());
        return parts.join(" ").trim();
      }
      return JSON.stringify(raw).slice(0, 5000);
    }

    if (typeof raw === "string") {
      const trimmed = raw.trim();
      try {
        const parsed = JSON.parse(trimmed);
        return _parsePotentialStreamedResponse(parsed);
      } catch (e) {
        const lines = trimmed.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
        let lastAssistantParts: string[] = [];
        for (const l of lines) {
          try {
            const o = JSON.parse(l);
            if (o) {
              if (o.message && typeof o.message === "object" && typeof o.message.content === "string") {
                lastAssistantParts.push(o.message.content);
              } else if (o.choices && Array.isArray(o.choices)) {
                const c0 = o.choices[0];
                if (c0?.message?.content) lastAssistantParts.push(c0.message.content);
              } else if (o.content && typeof o.content === "string") {
                lastAssistantParts.push(o.content);
              }
            }
          } catch (err) {
            // ignore unparseable chunk
          }
        }
        if (lastAssistantParts.length) {
          return lastAssistantParts.join("").replace(/\s+/g, " ").trim();
        }
        return trimmed.slice(0, 10000);
      }
    }
    return String(raw).slice(0, 5000);
  } catch (e) {
    console.error("parsePotentialStreamedResponse failed:", e);
    return String(raw || "");
  }
}

function _cleanRepetitionsAndTruncate(text: string, maxSentences = 6, maxChars = 1200): string {
  if (!text) return text;
  const normalized = text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  const parts = normalized.split(". ").map((p) => p.trim()).filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    const key = p.toLowerCase().replace(/\.$/, "");
    if (seen.has(key)) continue;
    out.push(p);
    seen.add(key);
    if (out.length >= maxSentences) break;
  }
  let result = out.join(". ");
  if (normalized.endsWith(".")) result = result.replace(/\s*$/, "") + ".";
  if (result.length > maxChars) {
    const truncated = result.slice(0, maxChars);
    result = truncated.slice(0, truncated.lastIndexOf(" ")) + "...";
  }
  return result;
}

export async function queryMedGemma(prompt: string): Promise<string> {
  const systemPrompt = `You are a supportive, calm assistant. Answer in 2–4 concise sentences, avoid repeating phrases, and finish with one gentle open-ended question.`;
  prompt = String(prompt || "");

  const payload = {
    model: OLLAMA_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    // decoding options matching the Python version, to reduce repetition/rambling
    options: {
      num_predict: 150,
      temperature: 0.6,
      top_p: 0.9,
      repeat_penalty: 1.4,
      presence_penalty: 0.8,
      frequency_penalty: 0.7,
    },
  };

  try {
    const url = `/api/chat?stream=false`;
    const res = await client.post(url, payload, {
      timeout: REQUEST_TIMEOUT,
      headers: { "Content-Type": "application/json" },
      transformResponse: (data) => data,
    });

    const raw = res.data;
    const parsed = _parsePotentialStreamedResponse(raw);
    const cleaned = _cleanRepetitionsAndTruncate((parsed || "").trim(), 6, 1000);
    return cleaned || (parsed || "").trim() || "⚠️ The therapist model returned an empty response.";
  } catch (err: any) {
    console.error("Ollama request failed:", err?.message ?? err);
    if (err?.code === "ECONNABORTED") {
      return "⚠️ The therapist model timed out. Please try again shortly.";
    }
    if (err?.response) {
      console.error("Ollama response error:", err.response.status, err.response.data?.toString?.()?.slice?.(0,1000) ?? err.response.data);
      return "⚠️ The therapist model returned an error. Please try again shortly.";
    }
    return "⚠️ I'm having technical difficulties contacting the therapist model right now. Please try again shortly.";
  }
}