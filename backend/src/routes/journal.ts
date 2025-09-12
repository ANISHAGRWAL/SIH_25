import express, { Request, Response } from 'express';
import { saveJournalEntry } from '../controllers/journal';
import { generateWeeklyReport } from '../controllers/reportService';
import { IApiRequest } from '../types';

const router = express.Router();

// Create new journal entry
router.post('/add_entry', async (req: IApiRequest, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: { message: 'Unauthorized' } });
  }
  const { entryText } = req.body;
  if (!entryText) {
    return res
      .status(400)
      .json({ success: false, error: { message: 'Missing required fields' } });
  }
  try {
    const data = await saveJournalEntry(req.user, entryText);
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Generate report (weekly/monthly) for user
router.get('/report', async (req: IApiRequest, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, error: { message: 'Unauthorized' } });
    }
    const { startDate, endDate } = req.query as {
      startDate?: string;
      endDate?: string;
    };

    const data = await generateWeeklyReport(req.user, startDate, endDate);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

export default router;
