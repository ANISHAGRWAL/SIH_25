import express from 'express';
import { ChatRequest, IApiRequest } from '../types';
import { SAFETY_MESSAGE, containsCrisisKeywords } from '../controllers/crisis';
import { logChat } from '../utils/chat_logger';
import { getResponse } from '../controllers/chatengine';
import nodemailer from 'nodemailer';
import { db } from '../db';
const router = express.Router();

router.post('/', async (req: IApiRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { session_id, query }: ChatRequest = req.body;

  if (!session_id || !query) {
    return res.status(400).json({ error: 'Missing session_id or query' });
  }

  const organizationId = req.user.organizationId;
  if (containsCrisisKeywords(query)) {
    await logChat(session_id, query, SAFETY_MESSAGE, true);
    // send to mail to admin or counselor here

    const admin = await db.query.user.findFirst({
      where: (user, { eq, and }) =>
        and(eq(user.role, 'admin'), eq(user.organizationId, organizationId)),
    });
    const userId = req.user?.id;
    const user = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    });
    const to = admin?.email;
    const subject = `Urgent: User ${user?.name} May Be in Crisis - Immediate Attention Required`;
    const text = `Hello ${admin?.name},\n\nThis is an automated alert from the Mental Health Support Chat Application. One of your users, ${user?.name} (${user?.email}), may be in crisis based on their recent message: "${query}".\n\nPlease reach out to them as soon as possible to provide support.\n\nBest regards,\nMental Health Support Team`;
    // 1. Create transporter using Gmail or another SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    // 2. Email options
    const mailOptions = {
      from: 'your-email@gmail.com',
      to,
      subject,
      text,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return res.json({ response: SAFETY_MESSAGE });
  }

  try {
    const response = await getResponse(session_id, query);
    await logChat(session_id, query, response, false);
    return res.json({ response });
  } catch (error) {
    console.error('Error in chat route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
