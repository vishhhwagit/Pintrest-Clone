export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
  savedPosts?: string[];
}

export interface PostAuthor {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  author: PostAuthor;
  likeCount: number;
  isLiked: boolean;
  isSaved: boolean;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: PostAuthor;
}

export const CATEGORIES = [
  'all',
  'art',
  'design',
  'food',
  'fashion',
  'travel',
  'home',
  'nature',
] as const;
