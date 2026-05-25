'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import type { Post } from '@/lib/types';
import { MasonryGrid } from './MasonryGrid';
import { CategoryChips } from './CategoryChips';
import { Skeleton } from './ui/Skeleton';

interface FeedProps {
  initialCategory?: string;
  initialQuery?: string;
}

export function Feed({ initialCategory = 'all', initialQuery = '' }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadPosts = useCallback(
    async (pageNum: number, reset: boolean) => {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      try {
        const data = await api.getPosts({
          page: pageNum,
          limit: 20,
          category: category === 'all' ? undefined : category,
          q: initialQuery || undefined,
        });

        setPosts((prev) => (reset ? data.posts : [...prev, ...data.posts]));
        setHasMore(data.hasMore);
        setPage(pageNum);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category, initialQuery]
  );

  useEffect(() => {
    loadPosts(1, true);
  }, [loadPosts]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el || !hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadPosts(page + 1, false);
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, loadPosts]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(1);
    setPosts([]);
    setHasMore(true);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {!initialQuery && <CategoryChips active={category} onChange={handleCategoryChange} />}

      {posts.length === 0 ? (
        <p className="py-20 text-center text-gray-500">No pins found. Try another category or search.</p>
      ) : (
        <div className="mt-4">
          <MasonryGrid posts={posts} />
        </div>
      )}

      <div ref={observerRef} className="h-10" />
      {loadingMore && (
        <p className="py-4 text-center text-sm text-gray-400">Loading more...</p>
      )}
    </div>
  );
}
