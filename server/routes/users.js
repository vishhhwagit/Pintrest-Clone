import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select(
      '-passwordHash'
    );
    if (!user) throw new AppError('User not found', 404);

    const postCount = await Post.countDocuments({ author: user._id });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        postCount,
        savedCount: user.savedPosts.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:username/posts', optionalAuth, async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) throw new AppError('User not found', 404);

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ author: user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'username avatarUrl'),
      Post.countDocuments({ author: user._id }),
    ]);

    const userId = req.user?._id?.toString();
    const formatted = posts.map((p) => ({
      id: p._id,
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl,
      category: p.category,
      createdAt: p.createdAt,
      author: {
        id: p.author._id,
        username: p.author.username,
        avatarUrl: p.author.avatarUrl,
      },
      likeCount: p.likes?.length || 0,
      isLiked: userId ? p.likes?.some((id) => id.toString() === userId) : false,
      isSaved: false,
    }));

    res.json({ posts: formatted, page, hasMore: skip + posts.length < total });
  } catch (err) {
    next(err);
  }
});

router.get('/:username/saved', optionalAuth, async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).populate(
      'savedPosts'
    );
    if (!user) throw new AppError('User not found', 404);

    const posts = await Post.find({ _id: { $in: user.savedPosts } })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatarUrl');

    res.json({
      posts: posts.map((p) => ({
        id: p._id,
        title: p.title,
        imageUrl: p.imageUrl,
        category: p.category,
        author: {
          username: p.author.username,
          avatarUrl: p.author.avatarUrl,
        },
      })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
