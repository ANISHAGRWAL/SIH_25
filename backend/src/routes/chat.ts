import express, { Response } from 'express';
import { ChatRequest, IApiRequest } from '../types';
import { getAgentResponse } from '../controllers/chatengine';

const router = express.Router();

router.post('/', async (req: IApiRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const {
    model_provider,
    messages,
    allow_search = true,
  } = req.body as ChatRequest;

  const DEFAULT_MODELS = {
    Gemini: 'gemini-2.5-flash',
    Groq: 'llama-3.3-70b-versatile',
  };

  type ModelProvider = keyof typeof DEFAULT_MODELS; // 'Gemini' | 'Groq'

  if (!DEFAULT_MODELS.hasOwnProperty(model_provider)) {
    return res.status(400).json({ error: 'Invalid provider.' });
  }

  try {
    const llm_id =
      DEFAULT_MODELS[model_provider as keyof typeof DEFAULT_MODELS];
    const authUser = req.user;

    const response = await getAgentResponse({
      authUser,
      provider: model_provider,
      llm_id,
      query: messages,
      allow_search,
    });

    return res.json({ response });
  } catch (err) {
    console.error('❌ Agent Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
