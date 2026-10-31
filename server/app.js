import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Resolve the project-root .env explicitly because `npm --prefix server` starts
// this process with server/ as its working directory. Vercel variables already
// present in process.env are preserved by dotenv's default override:false.
const serverDirectory = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(serverDirectory, '../.env') });

const app = express();
// Vercel runs behind a trusted proxy. This also lets rate limits use the
// visitor's forwarded client IP instead of one shared function IP.
if (process.env.VERCEL) app.set('trust proxy', 1);
app.use(helmet());

const allowedOrigins = new Set([
  'http://localhost:5173',
  ...(process.env.ALLOWED_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean),
]);
app.use((req, res, next) => {
  const origin = req.get('Origin');
  const sameOrigin = origin && origin === `${req.protocol}://${req.get('host')}`;
  if (!origin || sameOrigin || allowedOrigins.has(origin)) return next();
  return res.status(403).json({ error: 'This website is not allowed to use the chat API.' });
});
app.use(cors({
  origin(origin, callback) {
    // The request origin is checked by the middleware above, which also knows
    // the current request host and can safely allow same-origin production use.
    return callback(null, Boolean(origin));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '48kb', strict: true }));
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many chat requests. Please wait a few minutes and try again.' },
});
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use('/api/chat', chatLimiter);
app.use('/api', chatRoutes);
app.use(notFound);
app.use(errorHandler);

// Vercel imports this app as a serverless handler. Locally, start a normal server.
if (process.env.NODE_ENV !== 'production' || process.env.RUN_LOCAL_SERVER === 'true') {
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => console.log(`Chat API listening at http://localhost:${port}`));
}

export default app;
