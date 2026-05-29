'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Incorrect password.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-4">
      <div>
        <label className="block text-xs font-sans font-medium text-gray-500 uppercase tracking-wide mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
          placeholder="••••••••••••"
        />
      </div>
      {error && <p className="text-xs text-red-400 font-sans">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-950 text-white py-3 rounded-xl text-sm font-sans font-medium hover:bg-gray-800 transition disabled:opacity-40"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
