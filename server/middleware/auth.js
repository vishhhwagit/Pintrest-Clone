import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import User from '../models/User.js';

export const protect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppError('Not authorized', 401);
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) throw new AppError('User not found', 401);
    req.user = user;
    next();
  } catch (err) {
    next(err.statusCode ? err : new AppError('Not authorized', 401));
  }
};

export const optionalAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-passwordHash');
    }
    next();
  } catch {
    next();
  }
};
