// ai_agent.ts
import { ChatGroq } from '@langchain/groq';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { queryMedGemma } from "./ollama_tool";
import { db } from '../db';
import { IAuthUser } from '../types';


type Provider = 'Gemini' | 'Groq';

// env / config
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || '';
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';
const EMAIL_ID = process.env.EMAIL_ID || '';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://34.93.235.135:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'alibayram/medgemma:4b';
const OLLAMA_TIMEOUT_MS = parseInt(process.env.OLLAMA_REQUEST_TIMEOUT || '600000', 10);


// prompts and fallbacks
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

const GROQ_STYLE_PROMPT = `
    You speak like a young man talking to his best friend.  
    Your tone: playful, sarcastic, funny — like a friend who roasts in a lighthearted way, but always with love.  
    - Use jokes, memes, and banter to keep things casual.  
    - If your friend is sad, cheer them up with humor and small, doable suggestions — but don’t be extreme or overly serious.  
    - Never shame, insult, or be cruel — your roasting is always soft, like a bestie making them smile.  
    - Balance fun + care: roast a little, then show support.  
  `;

const GEMINI_STYLE_PROMPT = `
    You speak like a caring, witty girl best friend.
    - Show genuine care in a wholesome way, but keep the vibe light.  
    - Use playful sarcasm, witty comebacks, and silly exaggerations to make conversations fun.  
    - Sometimes roast yourself in a funny way to keep it real.  
    - Occasionally act a little confused or silly in a cute way, but not too much.  
    - Humor should feel clever and natural, not cringe or overly flirty, and dont use sugarcoated words.  
    - Always balance jokes with warmth and care — ultimate goal is to support your friend’s mental health.  
    - Encourage small positive actions when your friend feels low.  
  `;

const CLASSIFIER_PROMPT_CRISIS = `Answer with exactly one word: YES or NO (only that word).

Question: Does the following user message indicate imminent suicidal intent or self-harm risk requiring emergency intervention?

User message:
"{message}"

Please respond YES or NO.
`;

const CLASSIFIER_PROMPT_THERAPY = `Answer with exactly one word: YES or NO (only that word).

Question: Does the following user message describe mental-health related needs (depression, anxiety, ongoing distress, or need for therapy) such that a therapist-style response would be more appropriate than a casual friend reply?

User message:
"{message}"

Please respond YES or NO.
`;

// simple fallback keyword lists used when classifier returns null
const CRISIS_KEYWORDS_FALLBACK = ['suicide', 'kill myself', 'end my life', 'want to die', 'hurt myself'];
const THERAPY_KEYWORDS_FALLBACK = ['depress', 'depression', 'anxiety', 'panic', 'lonely', 'alone', 'overwhelmed', 'therapy', 'therapist'];

// Optional short-chat guard config (disabled by default)
const SHORT_CHAT_MIN_CHARS = 12;
const SHORT_CHAT_MIN_TURNS = 2;

// ---------------- helpers ----------------
function safeExtractContent(resp: any): string {
  try {
    if (!resp) return '';
    // common shapes
    if (typeof resp === 'string') return resp;
    if (typeof resp.content === 'string') return resp.content;
    if (resp.message && typeof resp.message === 'object' && typeof resp.message.content === 'string') return resp.message.content;
    if (Array.isArray(resp.choices) && resp.choices.length) {
      const first = resp.choices[0];
      if (first && typeof first === 'object') {
        if (first.message && typeof first.message.content === 'string') return first.message.content;
        if (typeof first.text === 'string') return first.text;
      }
    }
    // langchain-ish
    if (Array.isArray(resp.messages) && resp.messages.length) {
      for (const m of resp.messages) {
        if (m && m.role === 'assistant' && typeof m.content === 'string') return m.content;
      }
    }
    return JSON.stringify(resp).slice(0, 5000);
  } catch (e) {
    return String(resp || '');
  }
}

// NEW: Parse streaming JSON chunks and combine content
function parseStreamingResponse(streamData: string): string {
  try {
    if (!streamData || typeof streamData !== "string") return "";
    
    // Split by lines and filter out empty lines
    const lines = streamData.trim().split('\n').filter(line => line.trim());
    let fullContent = "";
    
    for (const line of lines) {
      try {
        const chunk = JSON.parse(line.trim());
        
        // Extract content from each chunk
        if (chunk.message && chunk.message.content) {
          fullContent += chunk.message.content;
        }
        
        // If this chunk is marked as done, we can stop
        if (chunk.done === true) {
          break;
        }
      } catch (parseError) {
        // Skip malformed JSON lines
        console.warn("Failed to parse streaming chunk:", line);
        continue;
      }
    }
    
    return fullContent.trim();
  } catch (error) {
    console.error("Error parsing streaming response:", error);
    return "";
  }
}

// call Ollama HTTP API with improved streaming support
async function callOllama(prompt: string): Promise<string> {
  const payload = {
    model: OLLAMA_MODEL,
    messages: [
      { role: 'system', content: 'You are a supportive, calm assistant. Answer in 2–4 concise sentences, avoid repeating phrases, and finish with one gentle open-ended question.' },
      { role: 'user', content: prompt },
    ],
    stream: false, // Explicitly set stream to false
  };

  try {
    console.log("Making request to Ollama...", { model: OLLAMA_MODEL, prompt: prompt.slice(0, 100) });
    
    const resp = await axios.post(`${OLLAMA_HOST.replace(/\/$/, '')}/api/chat`, payload, {
      timeout: OLLAMA_TIMEOUT_MS,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });

    console.log("Ollama response status:", resp.status);
    console.log("Ollama response data type:", typeof resp.data);
    
    let content = "";
    
    // Check if we got streaming data (string with multiple JSON objects)
    if (typeof resp.data === "string" && resp.data.includes('{"model":')) {
      console.log("Detected streaming response, parsing...");
      content = parseStreamingResponse(resp.data);
    } else {
      // Normal JSON response
      console.log("Normal JSON response");
      content = safeExtractContent(resp.data);
    }

    console.log("Extracted content length:", content.length);
    console.log("Content preview:", content.slice(0, 200));

    return content.trim() || '⚠️ The therapist model returned an empty response.';

  } catch (err: any) {
    console.error('Ollama call failed:', err?.message ?? err);
    
    // Handle streaming response in error case too
    if (err?.response?.data && typeof err.response.data === "string" && err.response.data.includes('{"model":')) {
      console.log("Parsing streaming response from error...");
      const content = parseStreamingResponse(err.response.data);
      if (content) {
        return content.trim();
      }
    }
    
    // try to provide user-friendly message
    if (err?.code === 'ECONNABORTED') {
      return '⚠️ The therapist model timed out. Please try again shortly.';
    }
    return '⚠️ The therapist model is currently unavailable. Please try again shortly.';
  }
}

// optional: send crisis email (uses Gmail creds)
async function sendCrisisEmail(adminEmail?: string, adminName?: string, userName?: string, userEmail?: string, excerpt?: string) {
  if (!EMAIL_ID || !EMAIL_PASSWORD || !adminEmail) {
    console.warn('Email creds or admin email missing — skipping crisis email.');
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: EMAIL_ID, pass: EMAIL_PASSWORD },
    });
    const subject = `Urgent: user ${userName ?? 'unknown'} may be in crisis`;
    const text = `Hello ${adminName ?? ''},\n\nUser: ${userName ?? ''} (${userEmail ?? ''}) may be in crisis.\n\nMessage excerpt:\n"${excerpt ?? ''}"\n\nPlease reach out immediately.`;
    await transporter.sendMail({ from: EMAIL_ID, to: adminEmail, subject, text });
  } catch (e) {
    console.error('Failed to send crisis email:', e);
  }
}

// ---------------- classifier (binary yes/no) ----------------
async function askBinaryYesNoWithProvider(provider: Provider, promptText: string): Promise<string | null> {
  try {
    if (provider === 'Groq') {
      const llm = new ChatGroq({ apiKey: GROQ_API_KEY, model: 'llama-3.3-70b-versatile' });
      const resp: any = await llm.invoke([ new SystemMessage('You are a binary classifier. Reply only YES or NO.'), new HumanMessage(promptText) ]);
      return safeExtractContent(resp).trim();
    } else {
      const llm = new ChatGoogleGenerativeAI({ apiKey: GOOGLE_GEMINI_API_KEY, model: 'gemini-2.5-flash' });
      const resp: any = await llm.invoke([ new SystemMessage('You are a binary classifier. Reply only YES or NO.'), new HumanMessage(promptText) ]);
      return safeExtractContent(resp).trim();
    }
  } catch (e: any) {
    console.error('Classifier call failed for', provider, e?.message ?? e);
    return null;
  }
}

async function runClassifierPair(message: string, provider: Provider) {
  const debug: any = { used_model: provider, crisis_raw: null, therapy_raw: null, errors: [] };

  const crisisPrompt = CLASSIFIER_PROMPT_CRISIS.replace('{message}', message.replace(/"/g, "'"));
  try {
    const crisisResp = await askBinaryYesNoWithProvider(provider, crisisPrompt);
    debug.crisis_raw = crisisResp;
  } catch (e: any) {
    debug.errors.push({ stage: 'crisis_classifier', error: e?.message ?? String(e) });
    debug.crisis_raw = null;
  }

  let crisisVal: boolean | null = null;
  if (debug.crisis_raw !== null) {
    const r = String(debug.crisis_raw).trim().toLowerCase();
    if (r.startsWith('yes')) crisisVal = true;
    else if (r.startsWith('no')) crisisVal = false;
  }

  // therapy only if crisis not YES
  if (crisisVal !== true) {
    const therapyPrompt = CLASSIFIER_PROMPT_THERAPY.replace('{message}', message.replace(/"/g, "'"));
    try {
      const therapyResp = await askBinaryYesNoWithProvider(provider, therapyPrompt);
      debug.therapy_raw = therapyResp;
    } catch (e: any) {
      debug.errors.push({ stage: 'therapy_classifier', error: e?.message ?? String(e) });
      debug.therapy_raw = null;
    }
  } else {
    debug.therapy_raw = '<skipped - crisis=True>';
  }

  let therapyVal: boolean | null = null;
  if (debug.therapy_raw !== null && typeof debug.therapy_raw === 'string') {
    const r2 = debug.therapy_raw.trim().toLowerCase();
    if (r2.startsWith('yes')) therapyVal = true;
    else if (r2.startsWith('no')) therapyVal = false;
  }

  return { crisis: crisisVal, therapy: therapyVal, debug };
}

// fallback checks when classifier returned null
function fallbackChecks(message: string, crisisFlag: boolean | null, therapyFlag: boolean | null) {
  const text = (message || '').toLowerCase();
  let crisisDetected = crisisFlag === true;
  let therapyNeeded = therapyFlag === true;

  if (crisisFlag === null) {
    crisisDetected = CRISIS_KEYWORDS_FALLBACK.some(k => text.includes(k));
  }
  if (therapyFlag === null) {
    therapyNeeded = THERAPY_KEYWORDS_FALLBACK.some(k => text.includes(k));
  }
  return { crisisDetected, therapyNeeded };
}

// ----------------- main exported function -----------------
/**
 * getAgentResponse
 * - authUser: optional object (used only if you want to email admin on crisis)
 * - provider: 'Gemini'|'Groq' preference for non-therapy responses and classifier
 * - llm_id: optional specific model id for provider-mode
 * - query: array of messages where last element is the latest user message
 * - allow_search: whether to include Tavily tool when calling provider agent
 */
export async function getAgentResponse({
  authUser,
  provider,
  llm_id,
  query,
  allow_search = true,
}: {
  authUser?: any;
  provider?: Provider;
  llm_id?: string;
  query: string[];
  allow_search?: boolean;
}): Promise<{ assistant_text: string; provider_chosen: string; note?: string | null }> {
  const latest = String(query?.[query.length - 1] ?? '').trim();
  if (!latest) {
    return { assistant_text: '', provider_chosen: 'unknown', note: 'empty_latest_message' };
  }

  try {
    const classifierProvider: Provider = provider === 'Groq' ? 'Groq' : 'Gemini';
    const classifier = await runClassifierPair(latest, classifierProvider);
    const crisisFlag = classifier.crisis;
    const therapyFlag = classifier.therapy;
    const debug = classifier.debug || {};
    console.info('=== CLASSIFIER DEBUG ===', debug);

    // fallback heuristics
    let { crisisDetected, therapyNeeded } = fallbackChecks(latest, crisisFlag, therapyFlag);
    console.info('after fallback -> crisisDetected:', crisisDetected, 'therapyNeeded:', therapyNeeded);

    // OPTIONAL short-chat guard (currently disabled).
    // If you want to skip Ollama for very short chit-chat, you can enable this guard:
    /*
    const isShortText = latest.length < SHORT_CHAT_MIN_CHARS;
    const fewTurns = (query?.length ?? 0) < SHORT_CHAT_MIN_TURNS;
    if (isShortText && fewTurns) {
      console.info('Short chat detected — skipping Ollama (guard enabled).');
      crisisDetected = false;
      therapyNeeded = false;
    }
    */

    if (crisisDetected) {
      console.warn('🛑 Crisis detected → Routing to Ollama therapist.');

      try {
        // 1. Find admin of this org
        const admin = await db.query.user.findFirst({
          where: (user, { eq, and }) =>
            and(eq(user.role, 'admin'), eq(user.organizationId, authUser.organizationId)),
        });

        // 2. Find current user
        const userId = authUser?.id;
        const user = await db.query.user.findFirst({
          where: (user, { eq }) => eq(user.id, userId),
        });

        // 3. Prepare email
        const to = admin?.email || process.env.ADMIN_EMAIL; // fallback
        const subject = `🚨 Urgent: User ${user?.name ?? 'Unknown'} May Be in Crisis`;
        const text = `Hello ${admin?.name ?? 'Admin'},\n\nThis is an automated alert from the Mental Health Support Chat Application.\n\nUser: ${user?.name ?? 'Unknown'} (${user?.email ?? 'no email'})\nMessage: "${latest}"\n\nPlease reach out ASAP to provide support.\n\n- Crisis Alert System`;

        if (!to) {
          console.warn('⚠️ No admin email available. Crisis email not sent.');
        } else {
          // 4. Setup Nodemailer transporter
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_ID,
              pass: process.env.EMAIL_PASSWORD,
            },
          });

          // 5. Send email
          const info = await transporter.sendMail({
            from: process.env.EMAIL_ID,
            to,
            subject,
            text,
          });

          console.log('✅ Crisis email sent:', info.response);
        }

        // 6. Return safe response for user
        return {
          assistant_text: `It sounds like you're going through a really difficult time right now. 💙 You're not alone — there are people who care about you and want to help.  
Please consider reaching out to a mental health professional or calling a trusted helpline: **+91 9152987821**.  
You can also contact ${admin?.name ?? 'an administrator'} at ${admin?.email ?? 'support@example.com'} ${admin?.contact ? `(${admin?.contact})` : ''}.  
Your life matters, and support is just a call away. 💙`,
          provider_chosen: 'Ollama (MedGemma)',
          note: 'crisis_mode',
    };

  } catch (err) {
    console.error('❌ Failed to send crisis email:', err);
    return {
      assistant_text: "It sounds like you're in a really difficult place. Please reach out to a trusted friend, a mental health professional, or call a helpline: +91 9152987821. 💙",
      provider_chosen: 'unknown',
      note: 'crisis_email_failed',
    };
  }
}


    // Therapy-needed => Ollama therapist
    if (therapyNeeded) {
      console.info('Therapy-needed → Routing to Ollama therapist.');
      const therapistReply = await queryMedGemma(latest);
      return { assistant_text: therapistReply, provider_chosen: 'Ollama (MedGemma)', note: 'therapy_mode' };
    }

    // Normal friendly flow => chosen provider (Groq or Gemini)
    try {
      const chosenProvider: Provider = provider === 'Groq' ? 'Groq' : 'Gemini';
      let llm: any;
      let stylePrompt = chosenProvider === 'Groq' ? GROQ_STYLE_PROMPT : GEMINI_STYLE_PROMPT;

      if (chosenProvider === 'Groq') {
        llm = new ChatGroq({ apiKey: GROQ_API_KEY, model: llm_id || 'llama-3.3-70b-versatile' });
      } else {
        llm = new ChatGoogleGenerativeAI({ apiKey: GOOGLE_GEMINI_API_KEY, model: llm_id || 'gemini-2.5-flash' });
      }

      const finalSystemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${stylePrompt}`;

      const tools = allow_search && TAVILY_API_KEY ? [ new TavilySearchResults({ maxResults: 2, apiKey: TAVILY_API_KEY }) ] : [];
      const agent = createReactAgent({ llm, tools });

      const messages = [ new SystemMessage(finalSystemPrompt), ...query.map(m => new HumanMessage(m)) ];

      const result: any = await agent.invoke({ messages });

      const outputs = (result.messages || [])
        .filter((m: any) => m instanceof AIMessage)
        .map((m: any) => (m.content?.toString?.() ?? ''));

      const assistantText = outputs.length ? outputs[outputs.length - 1] : 'No response.';
      return { assistant_text: assistantText, provider_chosen: chosenProvider, note: null };
    } catch (e: any) {
      console.error('Non-therapy provider invocation failed:', e?.message ?? e);
      // fallback to Ollama gracefully
      try {
        const fallback = await callOllama(latest);
        return { assistant_text: fallback, provider_chosen: 'Ollama (MedGemma)', note: 'fallback_to_ollama' };
      } catch (err2: any) {
        console.error('Fallback to Ollama also failed:', err2?.message ?? err2);
        return { assistant_text: "⚠️ I'm having technical difficulties right now. Please try again shortly.", provider_chosen: 'unknown', note: 'provider_and_fallback_failed' };
      }
    }
  } catch (e: any) {
    console.error('getAgentResponse top-level error:', e?.message ?? e);
    return { assistant_text: '⚠️ Internal error in agent.', provider_chosen: provider || 'unknown', note: 'agent_error' };
  }
}