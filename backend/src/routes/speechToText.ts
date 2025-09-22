import express, { Response } from 'express';
import { transcribeAudio } from '../controllers/speechToText';
import uploadFile from '../middleware/multer_middleware';
import { IApiRequest } from '../types';

const router = express.Router();

router.post('/', uploadFile, (req: IApiRequest, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: { message: 'Unauthorized' } });
  }
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, error: { message: 'Audio file is required' } });
  }
  transcribeAudio(req.file.path)
    .then((text) => {
      res.status(200).json({ success: true, data: { text } });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ success: false, error: { message: error.message } });
    });
});
export default router;
