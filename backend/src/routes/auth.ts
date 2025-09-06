import express, { Request, Response } from 'express';
import { loginUser, registerUser } from '../controllers/auth';

const router = express.Router();

router.post('/register', (req: Request, res: Response) => {
  registerUser(req.body)
    .then((data) => {
      res.status(200).json({ success: true, data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

router.post('/login', (req, res) => {
  loginUser(req.body)
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
