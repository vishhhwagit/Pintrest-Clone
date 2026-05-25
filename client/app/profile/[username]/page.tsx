'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { MasonryGrid } from '@/components/MasonryGrid';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Post } from '@/lib/types';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<{
    username: string;
    avatarUrl: string;
    bio: string;
    postCount: number;
    savedCount: number;
  } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    Promise.all([api.getUser(username), api.getUserPosts(username)])
      .then(([userRes, postsRes]) => {
        setProfile(userRes.user);
        setPosts(postsRes.posts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full max-w-md" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return <p className="py-20 text-center text-gray-500">User not found</p>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <Avatar src={profile.avatarUrl} alt={profile.username} size={96} />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold">{profile.username}</h1>
          {profile.bio && <p className="mt-2 max-w-md text-gray-600">{profile.bio}</p>}
          <p className="mt-2 text-sm text-gray-500">
            {profile.postCount} pins · {profile.savedCount} saved
          </p>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold">Created pins</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No pins yet.</p>
      ) : (
        <MasonryGrid posts={posts} />
      )}
    </div>
  );
}
