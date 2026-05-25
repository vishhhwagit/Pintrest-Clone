'use client';

import Masonry from 'react-masonry-css';
import { PinCard } from './PinCard';
import type { Post } from '@/lib/types';

interface MasonryGridProps {
  posts: Post[];
}

const breakpointColumns = {
  default: 4,
  1280: 4,
  1024: 3,
  768: 2,
  640: 1,
};

export function MasonryGrid({ posts }: MasonryGridProps) {
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {posts.map((post) => (
        <PinCard key={post.id} post={post} />
      ))}
    </Masonry>
  );
}
