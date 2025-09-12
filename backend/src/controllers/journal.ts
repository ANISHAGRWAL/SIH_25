import { db } from '../db';
import { labelEntry } from './labellingService';
import { getEmbedding } from '../utils/embeddings';
import { journalEntries } from '../db/schema/journalEntries';
import { eq } from 'drizzle-orm';
import { IAuthUser, Scores } from '../types';

export async function saveJournalEntry(
  authUser: IAuthUser,
  entryText: string,
): Promise<{ entryId: string; scores: Scores }> {
  try {
    // 1. Insert journal entry without labels first
    const [insertedEntry] = await db
      .insert(journalEntries)
      .values({
        studentId: authUser.id,
        content: entryText,
        organizationId: authUser.organizationId,
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
