import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Post from './models/Post.js';
import { connectDB, disconnectDB } from './lib/db.js';
import { seedPosts as posts } from './lib/seedPosts.js';

dotenv.config();

const DEMO_PASSWORD = 'demo1234';

const seed = async () => {
  await connectDB();

  await Post.deleteMany({});
  await User.deleteMany({ username: 'demo' });

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = await User.create({
    username: 'demo',
    email: 'demo@pinverse.app',
    passwordHash,
    bio: 'Demo account — explore pins and save your favorites!',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  });

  await Post.insertMany(
    posts.map((p) => ({ ...p, author: user._id, likes: [] }))
  );

  console.log('Seed complete!');
  console.log('Login: demo@pinverse.app / demo1234');
  await disconnectDB();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
