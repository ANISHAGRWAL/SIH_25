export async function logChat(
  session_id: string,
  query: string,
  response: string,
  is_crisis: boolean,
): Promise<void> {
  // TODO: Replace this with your DB save logic
  console.log(`[DB LOG] Session: ${session_id}, Crisis: ${is_crisis}`);
  console.log(`Query: ${query}`);
  console.log(`Response: ${response}`);
}
