const BASE_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` || "http://localhost:5000/api";

type ChatResponse = {
  response: string;
};

export async function chat(
  token: string,
  sessionId: string,
  query: string
): Promise<ChatResponse> {
  try {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        session_id: sessionId,
        query,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: ChatResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Chat API error:", error);
    throw error;
  }
}
