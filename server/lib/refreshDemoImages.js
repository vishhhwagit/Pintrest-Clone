import User from '../models/User.js';
import Post from '../models/Post.js';
import { seedPosts } from './seedPosts.js';

/** Fix demo data URLs and branding in existing database */
export async function refreshDemoImages() {
  const demo = await User.findOne({ username: 'demo' });
  if (!demo) return;

  await User.updateOne(
    { username: 'demo' },
    { $set: { email: 'demo@pinverse.app' } }
  );

  for (const seed of seedPosts) {
    await Post.updateMany(
      { author: demo._id, title: seed.title },
      { $set: { imageUrl: seed.imageUrl } }
    );
  }
}
