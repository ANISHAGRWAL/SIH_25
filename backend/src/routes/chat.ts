import express from 'express';
import { ChatRequest } from '../types';
import { SAFETY_MESSAGE, containsCrisisKeywords } from '../controllers/crisis';
import { logChat } from '../utils/chat_logger';
import { getResponse } from '../controllers/chatengine';

const router = express.Router();

router.post('/', async (req, res) => {
  const { session_id, query }: ChatRequest = req.body;

  if (!session_id || !query) {
    return res.status(400).json({ error: 'Missing session_id or query' });
  }

  if (containsCrisisKeywords(query)) {
    await logChat(session_id, query, SAFETY_MESSAGE, true);
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
