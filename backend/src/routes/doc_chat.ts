import express from 'express';
import { ChatRequest } from '../types';
import { queryDocuments } from '../controllers/docengine';

const router = express.Router();

router.post('/', async (req, res) => {
  const { messages }: ChatRequest = req.body;

  if (!messages) {
    return res.status(400).json({ error: 'Missing query' });
  }

  try {
    const response = await queryDocuments(messages[0]);
    return res.json({ response });
  } catch (error) {
    console.error('Error in doc-chat route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
