import { NextFunction, Response } from 'express';
import { db } from '../db';
import { IApiRequest } from '../types';
import jwt from 'jsonwebtoken';

const verifyToken = async (token: string) => {
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    );
    const user = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, (decodedToken as any).email),
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const authMiddleware = (
  req: IApiRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: { message: 'No token provided' } });
  }
  verifyToken(token)
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ success: false, error: { message: 'Invalid token' } });
      }
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      };
      next();
    })
    .catch((error) => {
      res
        .status(401)
        .json({ success: false, error: { message: 'Invalid token' } });
    });
};

export default authMiddleware;
