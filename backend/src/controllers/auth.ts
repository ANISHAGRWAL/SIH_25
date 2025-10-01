// auth.ts
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
import { eq } from 'drizzle-orm';
import sgMail from '@sendgrid/mail';

// --- SendGrid Configuration ---
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}
// ------------------------------

const generateAccessToken = (user: IUser): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error('Missing ACCESS_TOKEN_SECRET environment variable');
  }

  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: '2h',
  });
};

/**
 * Sends a one-time password (OTP) via SendGrid email.
 * @param email The recipient's email address.
 */
export const sendOtp = async (email: string) => {
  try {
    if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
      throw new Error('Missing SendGrid API Key or From Email environment variables');
    }

    const existingOtp = await db.query.otp.findFirst({
      where: (otp, { eq }) => eq(otp.email, email),
    });

    // Check if a non-expired OTP already exists
    if (existingOtp) {
      const now = new Date();
      if (existingOtp.expiresAt > now) {
        throw new Error('OTP already sent. Please check your email.');
      } else {
        // Delete expired OTP
        await db.delete(otpSchema).where(eq(otpSchema.email, email));
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const to = email;
    const subject = 'Your OTP Code for Completing Registration at Campus Care';
    const text = `Your OTP code is ${otp.toString()}. It is valid for 5 minutes.`; // Note: Updated validity message

    // SendGrid Logic
    const msg = {
      to,
      from: SENDGRID_FROM_EMAIL, // Must be a verified sender
      subject,
      text,
      html: `<strong>Your OTP code is ${otp.toString()}. It is valid for 5 minutes.</strong>`,
    };

    const [info] = await sgMail.send(msg);

    if (info.statusCode !== 202) {
        console.error('SendGrid response:', info);
        throw new Error('Failed to send OTP email via SendGrid. Please try again.');
    }

    // Insert new OTP record (valid for 5 minutes)
    await db.insert(otpSchema).values({
      email,
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes validity
    });

    console.log('✅ OTP Email sent successfully via SendGrid.');
  } catch (error) {
    console.error('Error in sendOtp:', error);
    throw error;
  }
};

/**
 * Verifies the provided OTP code against the record in the database.
 * @param email The user's email.
 * @param code The OTP code entered by the user.
 */
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

    // Mark OTP as verified
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

/**
 * Resets a user's password after OTP verification.
 * @param email The user's email.
 * @param code The verified OTP code.
 * @param newPassword The new password.
 */
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

    // Reuse the verification logic
    await verifyOtp(email, code);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
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

/**
 * Registers a new user, verifying OTP and uploading ID proof.
 * @param userData New user data.
 * @param file The ID proof file object from Express-Multer.
 * @returns An object containing the JWT access token.
 */
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

    // Check for verified OTP
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

    if (!user || user.length === 0) {
      throw new Error('User registration failed');
    }

    // Token generation upon successful registration
    return { token: generateAccessToken(user[0]) };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Logs in a user by verifying credentials.
 * @param credentials User email and password.
 * @returns An object containing the JWT access token.
 */
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

    // Token generation upon successful login
    return { token: generateAccessToken(user) };
  } catch (error) {
    console.log(error);
    throw error;
  }
};