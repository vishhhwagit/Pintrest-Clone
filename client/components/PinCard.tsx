'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Post } from '@/lib/types';
import { SafeImage } from './SafeImage';

interface PinCardProps {
  post: Post;
}

export function PinCard({ post }: PinCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-shadow hover:shadow-lg"
    >
      <Link href={`/post/${post.id}`}>
        <div className="relative w-full">
          <SafeImage
            src={post.imageUrl}
            alt={post.title}
            width={400}
            height={500}
            className="h-auto w-full object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
          <div className="absolute bottom-0 left-0 right-0 translate-y-full p-3 transition group-hover:translate-y-0">
            <p className="truncate text-sm font-semibold text-white drop-shadow">{post.title}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
