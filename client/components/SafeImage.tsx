'use client';

import Image from 'next/image';
import { useState } from 'react';

const FALLBACK = 'https://picsum.photos/seed/fallback/400/500';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function SafeImage({
  src,
  alt,
  width = 400,
  height = 500,
  className = '',
  sizes,
  priority,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 text-sm text-gray-500 ${className}`}
        style={{ minHeight: height }}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized
      onError={() => {
        if (imgSrc !== FALLBACK) {
          setImgSrc(FALLBACK);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
