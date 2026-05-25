import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { connectDB } from './lib/db.js';
import { autoSeedIfEmpty } from './lib/autoSeed.js';
import { refreshDemoImages } from './lib/refreshDemoImages.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    await autoSeedIfEmpty();
    await refreshDemoImages();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
