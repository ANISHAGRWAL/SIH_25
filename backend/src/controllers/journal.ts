import { db } from '../db';
import { labelEntry } from './labellingService';
import { getEmbedding } from '../utils/embeddings';
import { journalEntries } from '../db/schema/journalEntries';
import { eq } from 'drizzle-orm';
import { IAuthUser, Scores } from '../types';

export async function saveJournalEntry(
  authUser: IAuthUser,
  entryText: string,
  date: string,
): Promise<{ entryId: string; scores: Scores }> {
  try {
    // first find if journal exist for that day for that user
    const existingEntry = await getEntryByDate(authUser, date);
    if (existingEntry) {
      //update the entry
      const result = await db
        .update(journalEntries)
        .set({
          content: entryText,
          date: new Date(date),
        })
        .where(eq(journalEntries.id, existingEntry.id))
        .returning();
      if (result.length === 0) {
        throw new Error('Failed to update journal entry');
      }
      const entryId = existingEntry.id;
      const scores = await labelEntry(
        entryId,
        entryText,
        authUser.id,
        new Date(date),
      );
      const embedding = await getEmbedding(entryText);
      console.log('Journal entry updated:', result[0]);
      const resultScores = await db
        .update(journalEntries)
        .set({
          mood_disturbance: scores['Mood Disturbance'],
          sleep_disruption: scores['Sleep Disruption'],
          appetite_issues: scores['Appetite Issues'],
          academic_disengagement: scores['Academic Disengagement'],
          social_withdrawal: scores['Social Withdrawal'],
        })
        .where(eq(journalEntries.id, entryId))
        .returning();
      if (resultScores.length === 0) {
        throw new Error('Failed to update journal entry with scores');
      }
      console.log('Journal entry updated with scores:', resultScores[0]);
      return { entryId, scores };
    }
    // 1. Insert journal entry without labels first
    const [insertedEntry] = await db
      .insert(journalEntries)
      .values({
        studentId: authUser.id,
        content: entryText,
        organizationId: authUser.organizationId,
        date: new Date(date),
      })
      .returning();

    const entryId = insertedEntry.id;

    // 2. Generate AI labels
    const scores = await labelEntry(
      entryId,
      entryText,
      authUser.id,
      insertedEntry.date,
    );

    // 3. Get embedding (optional, depends on your app needs)
    const embedding = await getEmbedding(entryText);
    // TODO: Store embedding if needed

    // 4. Update journal entry with AI-generated labels
    console.log(`Updating entry ${entryId} with scores:`, scores);
    const result = await db
      .update(journalEntries)
      .set({
        mood_disturbance: scores['Mood Disturbance'],
        sleep_disruption: scores['Sleep Disruption'],
        appetite_issues: scores['Appetite Issues'],
        academic_disengagement: scores['Academic Disengagement'],
        social_withdrawal: scores['Social Withdrawal'],
      })
      .where(eq(journalEntries.id, entryId))
      .returning();

    if (result.length === 0) {
      throw new Error('Failed to update journal entry with scores');
    }
    console.log('Journal entry updated with scores:', result[0]);
    return { entryId, scores };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function getUtcRangeForLocalDate(dateStr: string, offsetMinutes: number) {
  // `dateStr` is in format 'YYYY-MM-DD', e.g., '2025-09-13'

  // Create local midnight (00:00) and end-of-day (23:59:59.999)
  const localStart = new Date(`${dateStr}T00:00:00`);
  const localEnd = new Date(`${dateStr}T23:59:59.999`);

  // Convert to UTC by subtracting the timezone offset
  const utcStart = new Date(localStart.getTime() - offsetMinutes * 60 * 1000);
  const utcEnd = new Date(localEnd.getTime() - offsetMinutes * 60 * 1000);

  return { utcStart, utcEnd };
}

export const getEntryByDate = async (authUser: IAuthUser, date: string) => {
  try {
    console.log(
      `Fetching journal entry for user ${authUser.id} on date ${date}`,
    );
    const { utcStart, utcEnd } = getUtcRangeForLocalDate(date, 330); // 330 = +5:30 IST

    const entry = await db.query.journalEntries.findFirst({
      where: (journalEntries, { eq, and, gte, lte }) =>
        and(
          eq(journalEntries.studentId, authUser.id),
          gte(journalEntries.date, utcStart),
          lte(journalEntries.date, utcEnd),
        ),
    });
    if (!entry) {
      return null;
    }
    return entry;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
