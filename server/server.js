import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import { errorHandler } from './middleware/errorHandler.js';
import { checkDeadlines } from './utils/deadlineReminder.js';

const app = express();

connectDB().then(() => {
  checkDeadlines();
  setInterval(checkDeadlines, 24 * 60 * 60 * 1000);
});

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:5174').split(',');
app.use(cors({ origin: (origin, cb) => cb(null, allowedOrigins.includes(origin) || !origin), credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// In production, serve the built React app and let client-side routing handle
// any non-API path (SPA fallback). Single-origin = no CORS / third-party cookies.
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
