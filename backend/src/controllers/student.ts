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
import { uploadOnCloudinary } from '../utils/cloudinary';
import { volunteerRequests as volunteerRequestsSchema } from '../db/schema/volunteerRequests';

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
      avatarUrl: userDetails.avatarUrl,
      volunteer: userDetails.volunteer,
      organizationId: userDetails.organizationId,
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
  file: Express.Multer.File | undefined,
): Promise<IUser> => {
  try {
    delete updateData.email;
    delete updateData.role;
    delete updateData.organizationId;
    delete updateData.contact;
    delete updateData.idProofUrl;
    delete updateData.name;
    delete updateData.password;

    if (file && file.path) {
      const avatar_url = await uploadOnCloudinary(file.path);
      updateData.avatarUrl = avatar_url;
    }

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

export const becomeVolunteer = async (authUser: IAuthUser) => {
  try {
    if (authUser.role !== 'student') {
      throw new Error('Only students can become volunteers');
    }
    const volunteer = await db
      .insert(volunteerRequestsSchema)
      .values({
        studentId: authUser.id,
        organizationId: authUser.organizationId,
      })
      .returning();
    if (!volunteer || volunteer.length === 0) {
      throw new Error('Volunteer request not created');
    }
    return volunteer[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const appliedForVolunteer = async (authUser: IAuthUser) => {
  try {
    if (authUser.role !== 'student') {
      throw new Error('Only students can apply for volunteer');
    }
    const volunteerRequest = await db.query.volunteerRequests.findFirst({
      where: (vr, { eq }) => eq(vr.studentId, authUser.id),
    });
    return { applied: !!volunteerRequest };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
