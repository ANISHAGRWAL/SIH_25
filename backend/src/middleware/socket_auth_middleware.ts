import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { verifyToken } from './auth_middleware';
import { IApiSocket } from '../types';

export const socketAuthMiddleware = (
  socket: IApiSocket,
  next: (err?: ExtendedError) => void,
) => {
  console.log('Authenticating socket connection...');
  const token =
    socket.handshake.auth?.token || socket.handshake.headers.authorization;
  if (!token) {
    return next(new Error('No token provided'));
  }
  verifyToken(token)
    .then((user) => {
      if (!user || user.role !== 'student') {
        return next(new Error('Invalid token'));
      }
      socket.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        volunteer: user.volunteer,
      };
      next();
    })
    .catch((error) => {
      next(new Error(error.message || 'Authentication error'));
    });
};
