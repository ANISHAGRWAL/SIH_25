import { db } from '../db';
import { IAuthUser } from '../types';

export const getStudents = async (authUser: IAuthUser) => {
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

export const getAvgTestScores = async (authUser: IAuthUser) => {
  try {
    //get the scores of last 7 days of phq table in the organization of authUser
    return {};
  } catch (error) {
    console.log(error);
    throw error;
  }
};
