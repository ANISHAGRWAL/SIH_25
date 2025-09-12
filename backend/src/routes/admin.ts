import express, { Response } from 'express';
import { IApiRequest, IAuthUser } from '../types';
import {
  generateAdminWeeklyReport,
  getAvgTestScores,
  getSessions,
  getStudents,
  getUserDetails,
} from '../controllers/admin';
const router = express.Router();

router.get('/students', (req: IApiRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, error: { message: 'Forbidden' } });
  }
  getStudents(req.user)
    .then((data) => {
      res.status(200).json({ success: true, data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

router.get('/test', (req: IApiRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, error: { message: 'Forbidden' } });
  }
  getAvgTestScores(req.user)
    .then((data) => {
      res.status(200).json({ success: true, data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

router.get('/journal', async (req: IApiRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, error: { message: 'Forbidden' } });
  }
  const { studentId, startDate, endDate } = req.query as {
    studentId: string;
    startDate?: string;
    endDate?: string;
  };
  const data = await generateAdminWeeklyReport(
    req.user,
    studentId,
    startDate,
    endDate,
  )
    .then((data) => {
      res.status(200).json({ success: true, data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

router.get('/sessions', (req: IApiRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, error: { message: 'Forbidden' } });
  }
  getSessions(req.user)
    .then((data) => {
      res.status(200).json({ success: true, data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

router.get('/user', (req: IApiRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, error: { message: 'Forbidden' } });
  }
  getUserDetails(req.user, req.query.userId as string)
    .then((data) => {
      res.status(200).json({ success: true, data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

export default router;
