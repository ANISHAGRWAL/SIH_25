const BASE_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` || "http://localhost:5000/api";

export async function chat(
  token: string,
  provider: "Gemini" | "Groq",
  messages: { role: "user" | "bot"; text: string }[]
) {
  try {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        model_name:
          provider === "Gemini" ? "gemini-2.5-flash" : "llama3-70b-8192",
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
