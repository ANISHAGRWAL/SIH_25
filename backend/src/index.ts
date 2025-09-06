import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth';
import studentRoutes from './routes/student';
import authMiddleware from './middleware/auth_middleware';
import adminMiddleware from './middleware/admin_middleware';
const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: '*',
  // origin: [
  //   /^https?:\/\/([a-zA-Z0-9-]+\.)*mindmates\.com$/,
  //   "http://localhost:3000",
  // ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const BASE_PATH = '/api';
app.use(`${BASE_PATH}/health`, (req, res) => {
  res.status(200).send('OK2');
});

app.use(`${BASE_PATH}/auth`, authRoutes);

// student router
app.use(authMiddleware);
app.use(`${BASE_PATH}/student`, studentRoutes);

// admin router
app.use(adminMiddleware);
app.use(`${BASE_PATH}/admin`, (req, res) => {
  res.status(200).send('OK2');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
