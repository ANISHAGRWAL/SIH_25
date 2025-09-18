import { db } from '../db';
import {
  INewUser,
  IUser,
  user as userSchema,
  otp as otpSchema,
} from '../db/schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary } from '../utils/cloudinary';
import nodemailer from 'nodemailer';
import { eq } from 'drizzle-orm';

const generateAccessToken = (user: IUser): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error('Missing ACCESS_TOKEN_SECRET environment variable');
  }

  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: '2h',
  });
};

export const sendOtp = async (email: string) => {
  try {
    if (!process.env.EMAIL_ID || !process.env.EMAIL_PASSWORD) {
      throw new Error('Missing email credentials in environment variables');
    }

    const existingOtp = await db.query.otp.findFirst({
      where: (otp, { eq }) => eq(otp.email, email),
    });
    // check expired or not
    if (existingOtp) {
      const now = new Date();
      if (existingOtp.expiresAt > now) {
        throw new Error('OTP already sent. Please check your email.');
      } else {
        await db.delete(otpSchema).where(eq(otpSchema.email, email));
      }
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const to = email;
    const subject = 'Your OTP Code for Completing Registration at Campus Care';
    const text = `Your OTP code is ${otp.toString()}. It is valid for 10 minutes.`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to,
      subject,
      text,
    };
    const info = await transporter.sendMail(mailOptions);
    if (!info.accepted || info.accepted.length === 0) {
      throw new Error('Failed to send OTP email. Please try again.');
    }
    await db.insert(otpSchema).values({
      email,
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    console.log('Email sent for registration: ', info.response);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const verifyOtp = async (email: string, code: string) => {
  try {
    const otpRecord = await db.query.otp.findFirst({
      where: (otp, { eq }) => eq(otp.email, email),
    });
    if (!otpRecord) {
      throw new Error('OTP not found. Please request a new one.');
    }
    if (otpRecord.code !== parseInt(code)) {
      throw new Error('Invalid OTP. Please try again.');
    }
    const now = new Date();
    if (otpRecord.expiresAt < now) {
      throw new Error('OTP has expired. Please request a new one.');
    }
    await db
      .update(otpSchema)
      .set({ isVerified: true })
      .where(eq(otpSchema.email, email));
    return { message: 'OTP verified successfully' };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string,
) => {
  try {
    const user = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });
    if (!user) {
      throw new Error('User with this email does not exist');
    }
    await verifyOtp(email, code);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(userSchema)
      .set({ password: hashedPassword })
      .where(eq(userSchema.email, email));
    return { message: 'Password reset successfully' };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const registerUser = async (
  userData: INewUser,
  file: Express.Multer.File,
): Promise<{ token: string }> => {
  try {
    if (!file || !file.path) {
      throw new Error('ID proof file is required');
    }
    const existingUser = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, userData.email),
    });
    if (existingUser) {
      throw new Error('User already exists');
    }
    const otpRecord = await db.query.otp.findFirst({
      where: (otp, { eq }) => eq(otp.email, userData.email),
    });
    if (!otpRecord || !otpRecord.isVerified) {
      throw new Error('Email not verified. Please verify your email first.');
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

export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<{ token: string }> => {
  try {
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
