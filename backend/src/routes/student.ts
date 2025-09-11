import express, { Request, Response } from 'express';
import {
  facialDetection,
  getMe,
  updateUserDetails,
  userDetails,
} from '../controllers/student';
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
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: { message: 'Unauthorized' } });
  }
  getMe(req.user)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

router.get('/details', (req: IApiRequest, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: { message: 'Unauthorized' } });
  }
  userDetails(req.user)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

router.post('/details', (req: IApiRequest, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: { message: 'Unauthorized' } });
  }
  updateUserDetails(req.user, req.body)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

export default router;
