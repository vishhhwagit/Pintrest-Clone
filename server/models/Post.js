import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true, trim: true, lowercase: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

postSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Post', postSchema);
