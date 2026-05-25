'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pinterest text-sm font-bold text-white">
            Pv
          </span>
          <span className="hidden text-xl font-bold text-pinterest sm:block">Pinverse</span>
        </Link>

        <form onSubmit={handleSearch} className="mx-auto hidden max-w-xl flex-1 sm:block">
          <div className="relative">
            <input
              type="search"
              placeholder="Search for ideas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full bg-gray-100 py-3 pl-12 pr-4 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-pinterest/30"
            />
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <Link href="/create">
                <Button size="sm">Create</Button>
              </Link>
              <Link href={`/profile/${user.username}`} className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100">
                <Avatar src={user.avatarUrl} alt={user.username} size={36} />
              </Link>
              <button
                onClick={logout}
                className="hidden text-sm text-gray-500 hover:text-gray-800 sm:block"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
