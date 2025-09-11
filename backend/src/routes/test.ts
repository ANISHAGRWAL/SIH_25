import express, { Response } from 'express';
import { IApiRequest } from '../types';
import { gadTest, getTests, phqTest, pssTest } from '../controllers/test';

const router = express.Router();

router.post('/phq', (req: IApiRequest, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: { message: 'Unauthorized' } });
  }
  const { score } = req.body;
  phqTest(req.user, score)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

router.post('/gad', (req: IApiRequest, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: { message: 'Unauthorized' } });
  }
  const { score } = req.body;
  gadTest(req.user, score)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

router.post('/pss', (req: IApiRequest, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: { message: 'Unauthorized' } });
  }
  const { score } = req.body;
  pssTest(req.user, score)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

router.get('/history', (req: IApiRequest, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: { message: 'Unauthorized' } });
  }
  getTests(req.user)
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
