import { ChatGroq } from '@langchain/groq';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

export const SAFETY_MESSAGE = `I hear you. You’re not alone. 💙 Please reach out to someone you trust or call a helpline.`;

// Simple keyword fallback (optional)
export function containsCrisisKeywords(input: string): boolean {
  const crisisWords = ['suicide', 'kill myself', 'end it all', 'self-harm'];
  return crisisWords.some((word) => input.toLowerCase().includes(word));
}

export async function checkCrisisWithLLM(
  provider: string,
  userText: string,
): Promise<boolean> {
  let llm;
  if (provider === 'Groq') {
    llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY!,
      model: 'llama3-70b-8192',
    });
  } else {
    llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: 'gemini-2.5-flash',
    });
  }

  const messages = [
    new SystemMessage(
      `You are a mental health safety classifier. ONLY respond "YES" if this shows suicidal/self-harm intent. Otherwise respond "NO".`,
    ),
    new HumanMessage(userText),
  ];

  const res = await llm.invoke(messages);
  return res.content.toString().toLowerCase().includes('yes');
}
