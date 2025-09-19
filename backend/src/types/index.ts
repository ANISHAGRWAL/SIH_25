import { type Request, Response } from 'express';
import { IRole } from '../db/schema/user';
import { IPhq } from '../db/schema/phq'; // Make sure to import these types
import { IGad } from '../db/schema/gad';
import { IPss } from '../db/schema/pss';
import { Socket } from 'socket.io';

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
  organizationId: string;
  role?: IRole;
  volunteer?: boolean;
}
export interface IApiRequest extends Request {
  user?: IAuthUser;
}

export interface IApiSocket extends Socket {
  user?: IAuthUser;
}

export interface ChatRequest {
  model_provider: 'Gemini' | 'Groq';
  messages: string[];
  allow_search: boolean;
  crisis_detection: boolean;
}

export interface ITestResult {
  lastTest: IPhq | IGad | IPss | undefined;
  eligible: boolean;
}

export interface ITestHistory {
  phq: ITestResult;
  gad: ITestResult;
  pss: ITestResult;
}

export interface JournalEntry {
  entryId: number;
  userId: string;
  date: string;
  entry: string;
}

export interface Scores {
  [key: string]: number;
}
