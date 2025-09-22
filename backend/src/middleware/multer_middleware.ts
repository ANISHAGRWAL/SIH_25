import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';

import multer, { FileFilterCallback } from 'multer';
import { TMP_ATTACHMENT_UPLOAD_DIR } from '../constants';
import path from 'path';

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'audio/mpeg', // .mp3
  'audio/wav', // .wav
  'audio/wave', // .wav
  'audio/webm', // .webm
  'audio/ogg', // .ogg
  'audio/mp4', // .m4a
  'audio/x-wav',
  'audio/x-m4a',
];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log('Rejected file type:', file.mimetype);
    cb(new Error('Only supported audio files are allowed.'));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (!existsSync(TMP_ATTACHMENT_UPLOAD_DIR)) {
      mkdirSync(TMP_ATTACHMENT_UPLOAD_DIR, { recursive: true });
    }
    callback(null, TMP_ATTACHMENT_UPLOAD_DIR);
  },
  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname) || '';
    const safeFilename = `${Date.now()}-${fileExtension}`;
    callback(null, safeFilename);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single('file');

export default upload;
