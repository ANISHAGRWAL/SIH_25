import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth';
import studentRoutes from './routes/student';
import testRoutes from './routes/test';
import organizationRoutes from './routes/organization';
import authMiddleware from './middleware/auth_middleware';
import adminMiddleware from './middleware/admin_middleware';
import chatRouter from './routes/chat';
import adminRoutes from './routes/admin';
import docChatRouter from './routes/doc_chat';
import journalRoutes from './routes/journal';
import bookingRoutes from './routes/booking';
import speechToTextRoutes from './routes/speechToText';
import { initializeSocketIo } from './socket';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: (origin, callback) => {
      if (
        !origin ||
        origin === 'http://localhost:3000' ||
        /^https?:\/\/([a-zA-Z0-9-]+\.)*campuscare\.live$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
});

const port = process.env.PORT || 3000;

const corsOptions = {
  origin: '*',
  // origin: [
  //   /^https?:\/\/([a-zA-Z0-9-]+\.)*Campus Care\.com$/,
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
  res.status(200).send('OK');
});

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/organizations`, organizationRoutes);

app.use('/api/doc-chat', docChatRouter);

// student router
app.use(authMiddleware);
app.use('/api/chat', chatRouter);
app.use(`${BASE_PATH}/student`, studentRoutes);
app.use(`${BASE_PATH}/test`, testRoutes);
app.use(`${BASE_PATH}/journal`, journalRoutes);
app.use(`${BASE_PATH}/booking`, bookingRoutes);
app.use(`${BASE_PATH}/speech-to-text`, speechToTextRoutes);

// admin router
app.use(adminMiddleware);
app.use(`${BASE_PATH}/admin`, adminRoutes);

initializeSocketIo(io);

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `❌ Port ${port} is already in use. Please stop the process using that port or set a different PORT in your .env file.`,
    );
    process.exit(1);
  } else if (error.code === 'EACCES') {
    console.error(
      `❌ Port ${port} requires elevated privileges. Use a port number above 1024 or run with appropriate permissions.`,
    );
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    throw error;
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
