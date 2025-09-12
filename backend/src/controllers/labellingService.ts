import { normalizeScores, PARAMS } from '../utils/labelParser.js';
import { heuristicLabel } from '../utils/heuristic.js';
import { Scores } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!); // Make sure the key is in your .env

export async function labelEntry(
  entryId: string,
  entryText: string,
  userId?: string,
  date?: Date,
): Promise<Scores> {
  let responseText = '';

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Analyze this student journal entry and provide numeric scores (0–10) for:

${PARAMS.join(', ')}

Rules:
- 0 = no issues; 10 = severe issues.
- Output ONLY a valid JSON object with keys exactly: ${JSON.stringify(PARAMS)}.

Example:
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
  } catch (err) {
    console.error('Gemini API error:', err);
  }

  let parsed: Scores;

  try {
    const raw = JSON.parse(responseText);
    parsed = normalizeScores(raw) as Scores;
  } catch {
    console.warn(
      '[DEBUG] Failed to parse Gemini response, falling back to heuristic',
    );
    parsed = heuristicLabel(entryText);
  }

  // Ensure all parameters are filled (default to 5.0)
  PARAMS.forEach((p) => {
    if (parsed[p] == null) parsed[p] = 5.0;
  });

  return parsed;
}
