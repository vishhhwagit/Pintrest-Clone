import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const formatUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  avatarUrl: user.avatarUrl,
  bio: user.bio,
  savedPosts: user.savedPosts,
});

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new AppError('Username, email and password are required');
    }
    if (password.length < 6) throw new AppError('Password must be at least 6 characters');

    const exists = await User.findOne({ $or: [{ email }, { username: username.toLowerCase() }] });
    if (exists) throw new AppError('User already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    });

    const token = signToken(user._id);
    res.status(201).json({ token, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError('Email and password are required');

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = signToken(user._id);
    res.json({ token, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
});

router.get('/me', protect, async (req, res) => {
  res.json({ user: formatUser(req.user) });
});

export default router;
