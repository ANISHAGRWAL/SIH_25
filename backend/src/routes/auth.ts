import express, { Request, Response } from 'express';
import { loginUser, registerUser } from '../controllers/auth';
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

export default router;
