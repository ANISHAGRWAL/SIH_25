import express, { Request, Response } from 'express';
import { facialDetection } from '../controllers/student';
import { IApiRequest } from '../types';

const router = express.Router();

router.post('/facial-detection', (req: IApiRequest, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: { message: 'Unauthorized' } });
  }
  facialDetection(req.user, req.body)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

router.get('/me', (req: IApiRequest, res: Response) => {
  res.status(200).json({ success: true, data: req.user });
});

export default router;
