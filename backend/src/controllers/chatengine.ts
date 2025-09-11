import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  throw new Error('Missing GOOGLE_API_KEY environment variable');
}

const model = new ChatGoogleGenerativeAI({
  apiKey: GOOGLE_API_KEY,
  model: 'gemini-2.5-flash',
  temperature: 0.7,
});

// Define the prompt template properly here
const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are a friendly, supportive AI buddy 😊.
     Keep responses short, clear, and positive.
     Aim for concise answers around 5 to 15 words.
     Use motivating language and relevant emojis like 🌟💪✨.
     Avoid long or complex explanations.`,
  ],
  new MessagesPlaceholder('history'),
  ['human', '{input}'],
]);

const sessionMemoryMap: Map<string, ConversationChain> = new Map();

export async function getResponse(
  session_id: string,
  user_query: string,
): Promise<string> {
  if (!sessionMemoryMap.has(session_id)) {
    const memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'history',
    });

    const chain = new ConversationChain({
      llm: model,
      memory,
      prompt,
    });

    sessionMemoryMap.set(session_id, chain);
  }

  const chain = sessionMemoryMap.get(session_id)!;
  const result = await chain.call({ input: user_query });

  // result usually has { response } key, but can vary; debug log to check
  console.log('LLM response:', result.response ?? result.text ?? result);

  // return text response (adjust key if needed)
  return result.response ?? result.text ?? 'No response from AI.';
}
