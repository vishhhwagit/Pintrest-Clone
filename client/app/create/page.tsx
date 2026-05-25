'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CATEGORIES } from '@/lib/types';

export default function CreatePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('art');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { post } = await api.createPost({ title, description, imageUrl, category });
      router.push(`/post/${post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pin');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return <p className="py-20 text-center text-gray-500">Loading...</p>;
  }

  const cats = CATEGORIES.filter((c) => c !== 'all');

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">Create a Pin</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pinterest focus:ring-2 focus:ring-pinterest/20"
          />
        </div>
        <Input
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          placeholder="https://picsum.photos/seed/my-pin/500/600"
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm capitalize outline-none focus:border-pinterest"
          >
            {cats.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-pinterest">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Publishing...' : 'Publish Pin'}
        </Button>
      </form>
    </div>
  );
}
