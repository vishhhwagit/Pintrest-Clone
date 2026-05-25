const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data as T;
}

export const api = {
  register: (body: { username: string; email: string; password: string }) =>
    request<{ token: string; user: import('./types').User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: import('./types').User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  me: () => request<{ user: import('./types').User }>('/api/auth/me'),

  getPosts: (params: { page?: number; limit?: number; category?: string; q?: string }) => {
    const search = new URLSearchParams();
    if (params.page) search.set('page', String(params.page));
    if (params.limit) search.set('limit', String(params.limit));
    if (params.category && params.category !== 'all') search.set('category', params.category);
    if (params.q) search.set('q', params.q);
    return request<{ posts: import('./types').Post[]; hasMore: boolean; page: number }>(
      `/api/posts?${search}`
    );
  },

  getPost: (id: string) =>
    request<{ post: import('./types').Post; comments: import('./types').Comment[] }>(
      `/api/posts/${id}`
    ),

  createPost: (body: { title: string; description: string; imageUrl: string; category: string }) =>
    request<{ post: import('./types').Post }>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  savePost: (id: string) => request<{ saved: boolean }>(`/api/posts/${id}/save`, { method: 'POST' }),

  unsavePost: (id: string) =>
    request<{ saved: boolean }>(`/api/posts/${id}/save`, { method: 'DELETE' }),

  likePost: (id: string) =>
    request<{ likeCount: number; isLiked: boolean }>(`/api/posts/${id}/like`, { method: 'POST' }),

  addComment: (id: string, text: string) =>
    request<{ comment: import('./types').Comment }>(`/api/posts/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  getUser: (username: string) =>
    request<{
      user: {
        id: string;
        username: string;
        avatarUrl: string;
        bio: string;
        postCount: number;
        savedCount: number;
      };
    }>(`/api/users/${username}`),

  getUserPosts: (username: string, page = 1) =>
    request<{ posts: import('./types').Post[]; hasMore: boolean }>(
      `/api/users/${username}/posts?page=${page}`
    ),
};
