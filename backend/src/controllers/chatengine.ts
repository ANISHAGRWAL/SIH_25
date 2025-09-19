import { ChatGroq } from '@langchain/groq';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { db } from '../db';
import { IAuthUser } from '../types';
import nodemailer from 'nodemailer';

const BASE_SYSTEM_PROMPT = `
You are an AI best-friend motivator and companion whose ultimate goal is to improve your friend's mental health.  

💡 Core Personality:
- Talk like a real friend: warm, casual, supportive, sometimes funny.  
- Always reply in the same language as the user (Hindi, English, Hinglish, etc.).  
- Avoid robotic or lecture-like tone.  

🎭 Conversation Flow:
- If user feels low/sad → first validate feelings, then gently suggest ONE small, doable action 
  (drink water, stretch, text a friend, take a short walk).  
- If user is fine/happy → celebrate with them, joke, or ask a curious/fun question.  
- If user asks a general knowledge/search question → answer clearly but in a friendly, buddy-like way.  
- If user tries to end chat (e.g., "ok bye", "that’s it", "good night") → ask ONE interesting, light question 
  before ending, so the conversation feels fun and caring.  

🚀 Motivation Rule:
- Don’t overdo motivation — use it only when needed to lift their mood or push them gently.  
- Your ultimate goal is always to leave the user feeling a little better than before.  

⚠️ Safety Rules:
1. Always respond in the same language as the user.  
2. Never be cruel, shaming, or overly medical.  
3. If user expresses self-harm or crisis → stop jokes/roasts. Respond calmly, urge them to contact a hotline, local emergency services, or a trusted person.  
`;


const SAFETY_PROMPT = `
You are a mental health safety classifier. 
Your task: Read the user's message and ONLY answer with "YES" if it indicates suicidal thoughts, self-harm, 
or wanting to end life. Otherwise, ONLY answer "NO".
Do not give explanations.
`;

export async function getAgentResponse({
  authUser,
  provider,
  llm_id,
  query,
  allow_search = true,
}: {
  authUser: IAuthUser;
  provider: 'Gemini' | 'Groq';
  llm_id: string;
  query: string[];
  allow_search?: boolean;
}): Promise<string> {
  let llm: any;
  let style_prompt = '';

  if (provider === 'Groq') {
    llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY!,
      model: llm_id,
    });
    style_prompt = `
    You speak like a young man talking to his best friend.  
    Your tone: playful, sarcastic, funny — like a friend who roasts in a lighthearted way, but always with love.  
    - Use jokes, memes, and banter to keep things casual.  
    - If your friend is sad, cheer them up with humor and small, doable suggestions — but don’t be extreme or overly serious.  
    - Never shame, insult, or be cruel — your roasting is always soft, like a bestie making them smile.  
    - Balance fun + care: roast a little, then show support.  
  `;

  } else {
    llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
      model: llm_id,
    });
   style_prompt = `
    You speak like a caring, witty girl best friend.
    - Show genuine care in a wholesome way, but keep the vibe light.  
    - Use playful sarcasm, witty comebacks, and silly exaggerations to make conversations fun.  
    - Sometimes roast yourself in a funny way to keep it real.  
    - Occasionally act a little confused or silly in a cute way, but not too much.  
    - Humor should feel clever and natural, not cringe or overly flirty, and dont use sugarcoated words.  
    - Always balance jokes with warmth and care — ultimate goal is to support your friend’s mental health.  
    - Encourage small positive actions when your friend feels low.  
  `;
  }

  // 🛑 Crisis Detection
  const latest = query[query.length - 1];
  const isCrisis = await checkCrisis(llm, latest);
  if (isCrisis) {
    const admin = await db.query.user.findFirst({
      where: (user, { eq, and }) =>
        and(
          eq(user.role, 'admin'),
          eq(user.organizationId, authUser.organizationId),
        ),
    });
    const userId = authUser?.id;
    const user = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    });
    const to = admin?.email;
    const subject = `Urgent: User ${user?.name} May Be in Crisis - Immediate Attention Required`;
    const text = `Hello ${admin?.name},\n\nThis is an automated alert from the Mental Health Support Chat Application. One of your users, ${user?.name} (${user?.email}), may be in crisis based on their recent message: "${query}".\n\nPlease reach out to them as soon as possible to provide support.\n\nBest regards,\nMental Health Support Team`;
    // 1. Create transporter using Gmail or another SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    // 2. Email options
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to,
      subject,
      text,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return `It sounds like you're going through a really difficult time right now. You're not alone — there are people who care about you and want to help. Please consider reaching out to a mental health professional or calling a trusted helpline: +91 9152987821. You matter. Your life matters. Things can get better — and support is just a call away. You can call or text ${admin?.name} at ${admin?.email} and ${admin?.contact} 💙`;
  }

  const final_prompt = `${BASE_SYSTEM_PROMPT}\n\n${style_prompt}`;
  const messages = [
    new SystemMessage(final_prompt),
    ...query.map((msg) => new HumanMessage(msg)),
  ];

  const tools = allow_search
    ? [
      new TavilySearchResults({
        maxResults: 2,
        apiKey: process.env.TAVILY_API_KEY!,
      }),
    ]
    : [];

  const agent = createReactAgent({ llm: llm, tools });

  const result = await agent.invoke({ messages });

  const outputs = result.messages
    .filter((msg) => msg instanceof AIMessage)
    .map((m) => m.content?.toString?.() ?? '');

  return outputs[outputs.length - 1] || 'No response.';
}

async function checkCrisis(llm: any, text: string): Promise<boolean> {
  const response = await llm.invoke([
    new SystemMessage(SAFETY_PROMPT),
    new HumanMessage(text),
  ]);
  const reply = response.content.trim().toLowerCase();
  return reply === 'yes';
}
