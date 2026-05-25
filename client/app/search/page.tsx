'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Feed } from '@/components/Feed';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">
        {q ? `Results for "${q}"` : 'Search'}
      </h1>
      <Feed initialQuery={q} initialCategory={category} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-gray-400">Loading...</p>}>
      <SearchContent />
    </Suspense>
  );
}
