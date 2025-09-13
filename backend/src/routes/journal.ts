import express, { Request, Response } from 'express';
import { getEntryByDate, saveJournalEntry } from '../controllers/journal';
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
  const { entryText, date } = req.body;
  if (!entryText || !date) {
    return res
      .status(400)
      .json({ success: false, error: { message: 'Missing required fields' } });
  }
  try {
    const data = await saveJournalEntry(req.user, entryText, date);
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

//get the report for a given date
router.get('/entry/:date', async (req: IApiRequest, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: { message: 'Unauthorized' } });
  }
  const { date } = req.params;
  getEntryByDate(req.user, date)
    .then((data) => {
      res.status(200).json({ success: true, data });
    })
    .catch((error: any) => {
      res
        .status(500)
        .json({ success: false, error: { message: error.message } });
    });
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
