'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-3xl font-bold">Welcome back</h1>
        <p className="mb-8 text-center text-gray-500">Log in to see more ideas</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          {error && <p className="text-sm text-pinterest">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Demo: <code className="text-xs">demo@pinverse.app</code> / <code className="text-xs">demo1234</code>
        </p>
        <p className="mt-4 text-center text-sm">
          Not on Pinverse?{' '}
          <Link href="/register" className="font-semibold text-pinterest hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
