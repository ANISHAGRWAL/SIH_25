import { db } from '../db';
import { IUser } from '../db/schema';
import { IAuthUser } from '../types';

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
    }
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
