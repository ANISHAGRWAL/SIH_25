import { db } from '../db';
import {
  INewStudentMood,
  IStudentMood,
  IUser,
  studentMoods,
} from '../db/schema';
import { IAuthUser } from '../types';

export const facialDetection = async (
  user: IAuthUser,
  facialData: INewStudentMood,
): Promise<IStudentMood> => {
  try {
    console.log('Registering user:', facialData);

    const facialMood = await db
      .insert(studentMoods)
      .values({
        studentId: user.id,
        mood: facialData.mood,
        date: new Date(),
        moodScore: facialData.moodScore,
      })
      .returning();
    if (!facialMood) {
      throw new Error('Facial data not stored');
    }
    return facialMood[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userDetails = async (authUser: IAuthUser): Promise<IUser> => {
  try {
    const userDetails = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, authUser.email),
    });
    if (!userDetails) {
      throw new Error('User not found');
    }
    return userDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
