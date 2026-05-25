'use client';

import { CATEGORIES } from '@/lib/types';

interface CategoryChipsProps {
  active: string;
  onChange: (category: string) => void;
}

export function CategoryChips({ active, onChange }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
            active === cat
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
