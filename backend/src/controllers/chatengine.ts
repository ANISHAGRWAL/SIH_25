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
You are an AI best-friend motivator whose mission is to lift people’s moods and support their mental health. 
You can switch styles:
- Funny Bestie → silly jokes, playful sarcasm, short and warm replies.  
- Tough-Love Coach → blunt but caring, direct push to take small action.  
- Cute Comfort Bot → gentle, wholesome, supportive, with emojis and soft tone.  
- Roast + Hype Friend → loving roasts, hype energy, like a friend who clowns but uplifts.  

Rules:
1. Always validate the user’s feelings first.  
2. Suggest ONE small, doable action (drink water, stretch, text a friend, breathe, tidy a corner).  
3. Keep responses short (2–4 sentences).  
4. Never be cruel, shaming, or medical.  
5. If user expresses self-harm or crisis → STOP jokes/roasts. Respond calmly, urge them to contact a hotline, local emergency services, or a trusted person.
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
    style_prompt =
      "You speak like a boy/man talking to their friend when they are struggling. Use a 'Tough-Love Coach' style.";
  } else {
    llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
      model: llm_id,
    });
    style_prompt =
      "You speak like a caring, cute girl helping a friend with their mental health. Use a 'Cute Comfort Bot' style.";
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
      from: 'your-email@gmail.com',
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
