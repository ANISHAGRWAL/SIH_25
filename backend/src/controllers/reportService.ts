import { db } from '../db'; // Drizzle ORM db instance
import { journalEntries } from '../db/schema/journalEntries';
import { eq, and, gte, lte } from 'drizzle-orm';
import { PARAMS } from '../utils/labelParser.js';
import { IAuthUser } from '../types';

interface JournalData {
  date: Date | null;
  mood_disturbance: number | null;
  sleep_disruption: number | null;
  appetite_issues: number | null;
  academic_disengagement: number | null;
  social_withdrawal: number | null;
}

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

  if (data.length === 0) {
    return { error: 'No data found' };
  }

  const paramMap: Record<string, keyof JournalData> = {
    'Mood Disturbance': 'mood_disturbance',
    'Sleep Disruption': 'sleep_disruption',
    'Appetite Issues': 'appetite_issues',
    'Academic Disengagement': 'academic_disengagement',
    'Social Withdrawal': 'social_withdrawal',
  };

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

  return {
    trend: data.map((d) => ({
      ...d,
      date: d.date ? d.date.toISOString().split('T')[0] : 'Unknown',
    })),
    summary,
  };
}
