import { and, eq, gte, lte } from 'drizzle-orm';
import { db } from '../db';
import { IUser, journalEntries } from '../db/schema';
import { IAuthUser } from '../types';
import { JournalData } from './reportService';
import { PARAMS } from '../utils/labelParser';

export const getStudents = async (authUser: IAuthUser): Promise<IUser[]> => {
  try {
    const students = await db.query.user.findMany({
      where: (user, { eq, and }) =>
        and(
          eq(user.role, 'student'),
          eq(user.organizationId, authUser.organizationId),
        ),
    });
    if (!students || students.length === 0) {
      throw new Error('No students found');
    }
    return students;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAvgTestScores = async (
  authUser: IAuthUser,
): Promise<object> => {
  try {
    const result = {
      avgPhqScore: 0,
      avgGadScore: 0,
      avgPssScore: 0,
    };
    const counts = {
      phqCount: 0,
      gadCount: 0,
      pssCount: 0,
    };
    const phqAvg = await db.query.phq.findMany({
      where: (phq, { eq, and, gte }) =>
        and(
          eq(phq.organizationId, authUser.organizationId),
          gte(phq.takenOn, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        ),
      columns: {
        score: true,
      },
    });
    if (phqAvg.length > 0) {
      const totalScore = phqAvg.reduce((acc, cur) => acc + cur.score, 0);
      const avgScore = totalScore / phqAvg.length;
      result.avgPhqScore = avgScore;
      counts.phqCount = phqAvg.length;
    }
    const gadAvg = await db.query.gad.findMany({
      where: (gad, { eq, and, gte }) =>
        and(
          eq(gad.organizationId, authUser.organizationId),
          gte(gad.takenOn, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        ),
      columns: {
        score: true,
      },
    });
    if (gadAvg.length > 0) {
      const totalScore = gadAvg.reduce((acc, cur) => acc + cur.score, 0);
      const avgScore = totalScore / gadAvg.length;
      result.avgGadScore = avgScore;
      counts.gadCount = gadAvg.length;
    }
    const pssAvg = await db.query.pss.findMany({
      where: (pss, { eq, and, gte }) =>
        and(
          eq(pss.organizationId, authUser.organizationId),
          gte(pss.takenOn, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        ),
      columns: {
        score: true,
      },
    });
    if (pssAvg.length > 0) {
      const totalScore = pssAvg.reduce((acc, cur) => acc + cur.score, 0);
      const avgScore = totalScore / pssAvg.length;
      result.avgPssScore = avgScore;
      counts.pssCount = pssAvg.length;
    }
    return { result, counts };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function generateAdminWeeklyReport(
  authUser: IAuthUser,
  studentId: string,
  startDate?: string,
  endDate?: string,
) {
  const conditions = [
    and(
      eq(journalEntries.studentId, authUser.id),
      eq(journalEntries.studentId, studentId),
    ),
    eq(journalEntries.organizationId, authUser.organizationId),
  ];

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

export const getSessions = async (authUser: IAuthUser) => {
  try {
    const sessions = await db.query.sessionBooking.findMany({
      where: (session, { eq, and, gte }) =>
        and(
          eq(session.organizationId, authUser.organizationId),
          gte(
            session.createdAt,
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          ),
        ),
      with: {
        user: {
          columns: {
            name: true,
          },
        },
      },
    });
    if (!sessions || sessions.length === 0) {
      throw new Error('No sessions found');
    }
    return sessions;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
