import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';

import multer, { FileFilterCallback } from 'multer';
import { TMP_ATTACHMENT_UPLOAD_DIR } from '../constants';
import path from 'path';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image or PDF files are allowed for ID card uploads.'));
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
