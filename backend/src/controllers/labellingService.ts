import { normalizeScores, PARAMS } from '../utils/labelParser.js';
import { heuristicLabel } from '../utils/heuristic.js';
import { Scores } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function safeNumber(v: any, fallback = 5.0): number {
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? Math.max(0, Math.min(10, Math.round(n * 10) / 10)) : fallback;
}

function extractJson(text: string): string | null {
  // try to find the last {...} block — models often add commentary before/after JSON.
  const match = text.match(/\{[\s\S]*\}$/m) || text.match(/\{[\s\S]*?\}/m);
  return match ? match[0] : null;
}

export async function labelEntry(
  entryId: string,
  entryText: string,
  userId?: string,
  date?: Date,
): Promise<Scores> {
  let responseText = '';

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an assistant that outputs ONLY a JSON object with these exact keys: ${JSON.stringify(
      PARAMS,
    )}.
Give numeric scores 0-10 where 0 = no issue, 10 = severe issue.
Be strict: if the text says "slept 2 hours", Sleep Disruption => 8-10. 
If the text says "slept 8 hours and felt good", Sleep Disruption => 0-2.
Output just the JSON and nothing else. Example:
{
  "Mood Disturbance": 4.5,
  "Sleep Disruption": 7.2,
  "Appetite Issues": 3.0,
  "Academic Disengagement": 6.1,
  "Social Withdrawal": 5.8
}

Journal entry:
"""${entryText}"""
`.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    responseText = response.text();
    console.log('[labelEntry] raw model response:', responseText);
  } catch (err) {
    console.error('[labelEntry] Gemini API error:', err);
  }

  let parsed: any = null;

  // 1) Try direct parse
  try {
    parsed = JSON.parse(responseText);
    console.log('[labelEntry] parsed JSON (direct):', parsed);
  } catch (err) {
    // 2) Try to extract JSON substring and parse
    const candidate = extractJson(responseText || '');
    if (candidate) {
      try {
        parsed = JSON.parse(candidate);
        console.log('[labelEntry] parsed JSON (extracted):', parsed);
      } catch (err2) {
        console.warn('[labelEntry] could not parse extracted JSON:', candidate, err2);
      }
    } else {
      console.warn('[labelEntry] no JSON found in responseText');
    }
  }

  // fallback to heuristic if parsing failed
  if (!parsed) {
    console.warn('[labelEntry] Falling back to heuristicLabel()');
    const heur = heuristicLabel(entryText);
    console.log('[labelEntry] heuristic result:', heur);
    parsed = heur;
  }

  // Ensure all params exist and are numeric 0..10
  const final: Scores = {} as Scores;
  PARAMS.forEach((p) => {
    if (parsed && Object.prototype.hasOwnProperty.call(parsed, p)) {
      final[p] = safeNumber(parsed[p], 5.0);
    } else {
      final[p] = 5.0;
    }
  });

  // Log normalize step if you have normalizeScores
  try {
    const normalized = normalizeScores(final);
    console.log('[labelEntry] before normalize:', final, 'after normalize:', normalized);
    // normalizeScores may transform values; decide whether to use it or not:
    // if you want to store normalized values, use `finalNormalized = normalized;`
    // For safety we will use normalizeScores result if it returns an object with same keys
    let ok = true;
    PARAMS.forEach((p) => {
      if (typeof (normalized as any)[p] !== 'number') ok = false;
    });
    if (ok) {
      // cast and ensure numeric-clamping
      PARAMS.forEach((p) => {
        final[p] = safeNumber((normalized as any)[p], final[p]);
      });
    } else {
      console.warn('[labelEntry] normalizeScores did not return valid numbers; skipping replace');
    }
  } catch (err) {
    console.warn('[labelEntry] normalizeScores threw:', err);
  }

  console.log('[labelEntry] final scores to return/save:', final);

  // ensure type and return
  return final;
}
