import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

const formatPost = (post, currentUserId) => {
  const author = post.author;
  const likes = post.likes || [];
  return {
    id: post._id,
    title: post.title,
    description: post.description,
    imageUrl: post.imageUrl,
    category: post.category,
    createdAt: post.createdAt,
    author: {
      id: author._id,
      username: author.username,
      avatarUrl: author.avatarUrl,
    },
    likeCount: likes.length,
    isLiked: currentUserId ? likes.some((id) => id.toString() === currentUserId) : false,
    isSaved: currentUserId
      ? false
      : false,
  };
};

const enrichSaved = async (posts, userId) => {
  if (!userId) return posts.map((p) => ({ ...p, isSaved: false }));
  const user = await User.findById(userId).select('savedPosts');
  const savedSet = new Set(user?.savedPosts?.map((id) => id.toString()) || []);
  return posts.map((p) => ({ ...p, isSaved: savedSet.has(p.id) }));
};

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const { category, q } = req.query;

    const filter = {};
    if (category) filter.category = category.toLowerCase();
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'username avatarUrl'),
      Post.countDocuments(filter),
    ]);

    const userId = req.user?._id?.toString();
    let formatted = posts.map((p) => formatPost(p, userId));
    formatted = await enrichSaved(formatted, userId);

    res.json({
      posts: formatted,
      page,
      hasMore: skip + posts.length < total,
      total,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username avatarUrl bio');
    if (!post) throw new AppError('Post not found', 404);

    const userId = req.user?._id?.toString();
    let formatted = formatPost(post, userId);
    const [enriched] = await enrichSaved([formatted], userId);
    formatted = enriched;

    const comments = await Comment.find({ post: post._id })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatarUrl')
      .limit(50);

    res.json({
      post: formatted,
      comments: comments.map((c) => ({
        id: c._id,
        text: c.text,
        createdAt: c.createdAt,
        author: {
          id: c.author._id,
          username: c.author.username,
          avatarUrl: c.author.avatarUrl,
        },
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const { title, description, imageUrl, category } = req.body;
    if (!title || !imageUrl || !category) {
      throw new AppError('Title, imageUrl and category are required');
    }

    const post = await Post.create({
      title,
      description: description || '',
      imageUrl,
      category: category.toLowerCase(),
      author: req.user._id,
    });

    await post.populate('author', 'username avatarUrl');
    res.status(201).json({ post: formatPost(post, req.user._id.toString()) });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/save', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new AppError('Post not found', 404);

    const user = await User.findById(req.user._id);
    const postId = post._id.toString();
    const index = user.savedPosts.findIndex((id) => id.toString() === postId);
    if (index === -1) user.savedPosts.push(post._id);
    await user.save();

    res.json({ saved: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/save', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedPosts = user.savedPosts.filter((id) => id.toString() !== req.params.id);
    await user.save();
    res.json({ saved: false });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/like', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new AppError('Post not found', 404);

    const userId = req.user._id;
    const index = post.likes.findIndex((id) => id.equals(userId));
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();

    res.json({ likeCount: post.likes.length, isLiked: index === -1 });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/comments', protect, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) throw new AppError('Comment text is required');

    const post = await Post.findById(req.params.id);
    if (!post) throw new AppError('Post not found', 404);

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      text: text.trim(),
    });
    await comment.populate('author', 'username avatarUrl');

    res.status(201).json({
      comment: {
        id: comment._id,
        text: comment.text,
        createdAt: comment.createdAt,
        author: {
          id: comment.author._id,
          username: comment.author.username,
          avatarUrl: comment.author.avatarUrl,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
