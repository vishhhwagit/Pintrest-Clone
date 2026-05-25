import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { seedPosts as posts } from './seedPosts.js';

export async function autoSeedIfEmpty() {
  const count = await User.countDocuments();
  if (count > 0) return;

  console.log('Empty database — seeding demo data...');
  const passwordHash = await bcrypt.hash('demo1234', 10);
  const user = await User.create({
    username: 'demo',
    email: 'demo@pinverse.app',
    passwordHash,
    bio: 'Demo account — explore pins and save your favorites!',
    avatarUrl: 'https://picsum.photos/seed/demo-avatar/100/100',
  });

  await Post.insertMany(posts.map((p) => ({ ...p, author: user._id, likes: [] })));
  console.log('Demo ready: demo@pinverse.app / demo1234');
}
