import { db } from '../db'; // Drizzle ORM db instance
import { journalEntries } from '../db/schema/journalEntries';
import { eq, and, gte, lte } from 'drizzle-orm';
import { PARAMS } from '../utils/labelParser.js';
import { IAuthUser } from '../types';

export interface JournalData {
  date: Date | null;
  mood_disturbance: number | null;
  sleep_disruption: number | null;
  appetite_issues: number | null;
  academic_disengagement: number | null;
  social_withdrawal: number | null;
}

// Exclude 'date' so TS knows param keys refer to numeric fields only
type ParamKey = Exclude<keyof JournalData, 'date'>;

export async function generateWeeklyReport(
  authUser: IAuthUser,
  startDate?: string,
  endDate?: string,
) {
  const conditions = [eq(journalEntries.studentId, authUser.id)];

  if (startDate) {
    conditions.push(gte(journalEntries.date, new Date(startDate)));
  } else {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    conditions.push(gte(journalEntries.date, oneWeekAgo));
  }

  if (endDate) {
    conditions.push(lte(journalEntries.date, new Date(endDate)));
  } else {
    conditions.push(lte(journalEntries.date, new Date()));
  }

  const data: JournalData[] = await db
    .select({
      date: journalEntries.date,
      mood_disturbance: journalEntries.mood_disturbance,
      sleep_disruption: journalEntries.sleep_disruption,
      appetite_issues: journalEntries.appetite_issues,
      academic_disengagement: journalEntries.academic_disengagement,
      social_withdrawal: journalEntries.social_withdrawal,
    })
    .from(journalEntries)
    .where(and(...conditions))
    .orderBy(journalEntries.date);

  if (!data || data.length === 0) {
    return { error: 'No data found' };
  }

  const paramMap: Record<string, ParamKey> = {
    'Mood Disturbance': 'mood_disturbance',
    'Sleep Disruption': 'sleep_disruption',
    'Appetite Issues': 'appetite_issues',
    'Academic Disengagement': 'academic_disengagement',
    'Social Withdrawal': 'social_withdrawal',
  };

  // --- summary (keeps same numbers you logged earlier) ---
  const summary = PARAMS.map((param) => {
    const key = paramMap[param];
    const total = data.reduce((acc, d) => {
      const val = d[key];
      return acc + (typeof val === 'number' ? val : 0);
    }, 0);
    return {
      parameter: param,
      avg: +(total / data.length).toFixed(2),
    };
  });

  // --- compute min/max per parameter across the week (for normalization) ---
  const mins: Partial<Record<ParamKey, number>> = {};
  const maxs: Partial<Record<ParamKey, number>> = {};

  (Object.values(paramMap) as ParamKey[]).forEach((key) => {
    let min = Infinity;
    let max = -Infinity;
    let found = false;
    for (const r of data) {
      const v = r[key];
      if (typeof v === 'number') {
        found = true;
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    if (found) {
      mins[key] = min;
      maxs[key] = max;
    }
  });

  // normalize raw -> 0..10 (higher = better). If min===max => neutral 5.0
  function normalizeToTenSafe(raw: number | null | undefined, key: ParamKey): number | null {
    if (raw == null || typeof raw !== 'number') return null;
    const min = mins[key];
    const max = maxs[key];
    if (min === undefined || max === undefined) return null;
    if (min === max) return 5.0;
    const normalized = ((raw - min) / (max - min)) * 10;
    const clamped = Math.max(0, Math.min(10, normalized));
    return Math.round(clamped * 10) / 10;
  }

  // --- Build trend: include per-param normalized values and overall wellbeing per day ---
  const trend = data.map((row) => {
    const normalizedRow: Record<string, number | null> = {};
    for (const label of Object.keys(paramMap)) {
      const key = paramMap[label] as ParamKey;
      normalizedRow[label] = normalizeToTenSafe(row[key] as number | null | undefined, key);
    }
    const numericVals = Object.values(normalizedRow).filter((v) => typeof v === 'number') as number[];
    const dayScore =
      numericVals.length ? Math.round((numericVals.reduce((a, b) => a + b, 0) / numericVals.length) * 10) / 10 : null;

    return {
      date: row.date ? row.date.toISOString().split('T')[0] : 'Unknown',
      normalized: normalizedRow,   // per param normalized
      overall: dayScore,           // 👈 daily wellbeing explicitly here
      // raw values preserved
      mood_disturbance: row.mood_disturbance,
      sleep_disruption: row.sleep_disruption,
      appetite_issues: row.appetite_issues,
      academic_disengagement: row.academic_disengagement,
      social_withdrawal: row.social_withdrawal,
    };
  });

  // --- overall: average of daily overall scores (weekly wellbeing) ---
  const dayScores = trend.map((t) => t.overall).filter((s) => s != null) as number[];
  const overallScore =
    dayScores.length > 0 ? Math.round((dayScores.reduce((a, b) => a + b, 0) / dayScores.length) * 10) / 10 : null;

  const overall = { score: overallScore };

  // --- optional pie (relative contributions) ---
  const rawAvgs = summary.map((s) => (typeof s.avg === 'number' ? s.avg : parseFloat(String(s.avg)) || 0));
  const totalAvgs = rawAvgs.reduce((a, b) => a + b, 0) || 1;
  const pie = summary.map((s, i) => ({
    label: s.parameter,
    percent: Math.round(((rawAvgs[i] / totalAvgs) * 100) * 10) / 10,
  }));

  const result = {
    trend,
    summary,
    overall,
    pie,
  };

  console.log('Generated report (with daily overall):', result);
  return result;
}
