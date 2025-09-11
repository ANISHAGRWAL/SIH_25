import { eq } from 'drizzle-orm';
import { db } from '../db';
import {
  INewStudentMood,
  IStudentMood,
  IUser,
  studentMoods,
  user as userSchema,
} from '../db/schema';
import { IAuthUser } from '../types';

export const facialDetection = async (
  user: IAuthUser,
  facialData: INewStudentMood,
): Promise<IStudentMood> => {
  try {
    console.log('Storing FacialData:', facialData);

    const facialMood = await db
      .insert(studentMoods)
      .values({
        studentId: user.id,
        mood: facialData.mood,
        date: new Date(),
        moodScore: facialData.moodScore,
        organizationId: user.organizationId,
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

export const getMe = async (user: IAuthUser): Promise<Partial<IUser>> => {
  try {
    const userDetails = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.email, user.email),
    });
    if (!userDetails) {
      throw new Error('User not found');
    }
    const returnData = {
      id: userDetails.id,
      email: userDetails.email,
      role: userDetails.role,
      name: userDetails.name,
    };
    return returnData;
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

export const updateUserDetails = async (
  authUser: IAuthUser,
  updateData: Partial<IUser>,
): Promise<IUser> => {
  try {
    delete updateData.email;
    delete updateData.role;
    delete updateData.organizationId;
    delete updateData.contact;
    delete updateData.idProofUrl;
    delete updateData.name;
    delete updateData.password;

    const userDetails = await db
      .update(userSchema)
      .set(updateData)
      .where(eq(userSchema.email, authUser.email))
      .returning();
    if (!userDetails) {
      throw new Error('User not found or not updated');
    }
    return userDetails[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
