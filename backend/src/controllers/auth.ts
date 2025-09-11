import { db } from '../db';
import { INewUser, IUser, user as userSchema } from '../db/schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary } from '../utils/cloudinary';

const generateAccessToken = (user: IUser): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error('Missing ACCESS_TOKEN_SECRET environment variable');
  }

  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: '2h',
  });
};

export const registerUser = async (
  userData: INewUser,
  file: Express.Multer.File,
): Promise<{ token: string }> => {
  try {
    console.log('Registering user:', userData);
    const existingUser = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, userData.email),
    });
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const idProofUrl = await uploadOnCloudinary(file.path);
    const user = await db
      .insert(userSchema)
      .values({
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        name: userData.name,
        contact: userData.contact,
        idProofUrl: idProofUrl,
        organizationId: userData.organizationId,
      })
      .returning();
    if (!user) {
      throw new Error('User registration failed');
    }
    return { token: generateAccessToken(user[0]) };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loginUser = async (
  credentials: any,
): Promise<{ token: string }> => {
  try {
    console.log('Logging in user:', credentials);
    const user = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, credentials.email),
    });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    return { token: generateAccessToken(user) };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
