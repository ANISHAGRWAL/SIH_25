import express, { Response } from 'express';
import { IApiRequest } from '../types';
import { bookSession } from '../controllers/booking';
const router = express.Router();

router.post('/', (req: IApiRequest, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: { message: 'Unauthorized' } });
  }
  bookSession(req.user, req.body)
    .then((data) => {
      res.status(201).json({ success: true, data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});
export default router;
