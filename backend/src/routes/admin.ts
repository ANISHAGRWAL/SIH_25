import express, { Response } from 'express';
import { IApiRequest, IAuthUser } from '../types';
import { getAvgTestScores, getStudents } from '../controllers/admin';
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

export default router;
