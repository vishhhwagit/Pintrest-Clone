'use client';

import Link from 'next/link';
import { SafeImage } from '@/components/SafeImage';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Post, Comment } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api
      .getPost(id)
      .then((data) => {
        setPost(data.post);
        setComments(data.comments);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSave = async () => {
    if (!user || !post) return;
    try {
      if (post.isSaved) {
        await api.unsavePost(post.id);
        setPost({ ...post, isSaved: false });
      } else {
        await api.savePost(post.id);
        setPost({ ...post, isSaved: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async () => {
    if (!user || !post) return;
    try {
      const res = await api.likePost(post.id);
      setPost({ ...post, isLiked: res.isLiked, likeCount: res.likeCount });
    } catch (err) {
      console.error(err);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !post || !commentText.trim()) return;
    try {
      const { comment } = await api.addComment(post.id, commentText);
      setComments([comment, ...comments]);
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-[3/4] w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !post) {
    return <p className="py-20 text-center text-pinterest">{error || 'Post not found'}</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl bg-gray-100">
        <SafeImage
          src={post.imageUrl}
          alt={post.title}
          width={800}
          height={1000}
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      <div>
        <div className="mb-4 flex items-center gap-3">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar src={post.author.avatarUrl} alt={post.author.username} />
          </Link>
          <Link
            href={`/profile/${post.author.username}`}
            className="font-semibold hover:underline"
          >
            {post.author.username}
          </Link>
        </div>

        <h1 className="text-2xl font-bold">{post.title}</h1>
        {post.description && <p className="mt-2 text-gray-600">{post.description}</p>}
        <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm capitalize text-gray-600">
          {post.category}
        </span>

        <div className="mt-6 flex flex-wrap gap-3">
          {user ? (
            <>
              <Button onClick={toggleSave} variant={post.isSaved ? 'primary' : 'secondary'}>
                {post.isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button onClick={toggleLike} variant={post.isLiked ? 'primary' : 'secondary'}>
                {post.isLiked ? 'Liked' : 'Like'} ({post.likeCount})
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button>Log in to save</Button>
            </Link>
          )}
        </div>

        <div className="mt-10">
          <h2 className="mb-4 font-semibold">Comments ({comments.length})</h2>
          {user && (
            <form onSubmit={submitComment} className="mb-6 flex gap-2">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1"
              />
              <Button type="submit" size="sm">
                Post
              </Button>
            </form>
          )}
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="flex gap-3">
                <Avatar src={c.author.avatarUrl} alt={c.author.username} size={32} />
                <div>
                  <p className="text-sm font-semibold">{c.author.username}</p>
                  <p className="text-gray-700">{c.text}</p>
                </div>
              </li>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-gray-400">No comments yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
