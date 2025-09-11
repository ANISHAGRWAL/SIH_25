import { type Request, Response } from 'express';
import { IRole } from '../db/schema/user';

export interface IApiResponse {
  success: boolean;
  data?: object;
  error?: {
    message: string;
  };
}

export interface IAuthUser {
  id: string;
  email: string;
  role?: IRole;
}
export interface IApiRequest extends Request {
  user?: IAuthUser;
}

export interface ChatRequest {
  session_id: string;
  query: string;
}
