// src/routes/chat.ts
import express, { Request, Response } from "express";
import { getAgentResponse } from "../controllers/chatengine";

type ChatRequestBody = {
  model_provider?: "Gemini" | "Groq";
  messages: string[];
  allow_search?: boolean;
};

type ChatResponseBody = {
  ok: boolean;
  provider_chosen: string;
  assistant_text: string;
  note?: string | null;
};

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body as ChatRequestBody | undefined;
    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return res.status(400).json({ ok: false, provider_chosen: "unknown", assistant_text: "", note: "messages array must not be empty" } as ChatResponseBody);
    }

    const latest = String(body.messages[body.messages.length - 1] ?? "").trim();
    if (!latest) {
      return res.status(400).json({ ok: false, provider_chosen: "unknown", assistant_text: "", note: "latest message is empty" } as ChatResponseBody);
    }

    const providerPref = body.model_provider === "Groq" ? "Groq" : "Gemini";

    // call agent
    const result = await getAgentResponse({
      authUser: (req as any).user,
      provider: providerPref,
      llm_id: providerPref === "Groq" ? "llama-3.3-70b-versatile" : "gemini-2.5-flash",
      query: body.messages,
      allow_search: body.allow_search ?? true,
    });

    // Normalize result: agent returns { assistant_text, provider_chosen, note? }
    let assistant_text = String((result as any)?.assistant_text ?? result ?? "");
    let provider_chosen = String((result as any)?.provider_chosen ?? providerPref);
    const note = (result as any)?.note ?? null;

    return res.json({ ok: true, provider_chosen, assistant_text, note } as ChatResponseBody);
  } catch (err: any) {
    console.error("❌ /chat handler error:", err?.message ?? err);
    return res.status(500).json({ ok: false, provider_chosen: "unknown", assistant_text: "⚠️ Internal server error.", note: String(err?.message || err) } as ChatResponseBody);
  }
});

export default router;
