// actions/chat.ts

export async function chat(
  provider: "Gemini" | "Groq",
  messages: { role: "user" | "bot"; text: string }[]
) {
  try {
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model_name: provider === "Gemini" ? "gemini-2.5-flash" : "llama3-70b-8192",
        model_provider: provider,
        system_prompt:
          "friendly ai chat motivator who helps his/her friend in enhancing their mental health",
        messages: messages.map((m) => m.text),

        allow_search: true,
        crisis_detection: true,
      }),
    });

    if (!res.ok) throw new Error("Server error");
    return await res.json();
  } catch (error) {
    console.error("Chat API Error:", error);
    return { response: null, error: "⚠️ Could not connect to backend" };
  }
}
