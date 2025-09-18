import express, { Request, Response } from 'express';
import {
  loginUser,
  registerUser,
  resetPassword,
  sendOtp,
  verifyOtp,
} from '../controllers/auth';
import uploadFile from '../middleware/multer_middleware';

const router = express.Router();

router.post('/register', uploadFile, (req: Request, res: Response) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, error: { message: 'ID proof is required' } });
  }
  registerUser(req.body, req.file)
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

router.post('/send-otp', (req, res) => {
  const { email } = req.body;
  sendOtp(email)
    .then((data) => {
      res.status(200).json({ success: true, data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

router.post('/verify-otp', (req, res) => {
  const { email, code } = req.body;
  verifyOtp(email, code)
    .then((data) => {
      res.status(200).json({ success: true, data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    });
});

router.post('/reset-password', (req, res) => {
  const { email, code, newPassword } = req.body;
  resetPassword(email, code, newPassword)
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
