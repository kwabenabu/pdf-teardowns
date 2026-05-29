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
      setError('Wrong password.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-dashed border-ink p-8 space-y-5 bg-cream">
      <div>
        <label className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] block mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-border bg-cream text-ink font-sans text-sm px-4 py-3 focus:outline-none focus:border-ink focus:ring-0 placeholder-border transition-colors"
          placeholder="••••••••••••"
        />
      </div>
      {error && (
        <p className="font-mono text-[10px] text-red-500 uppercase tracking-widest">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ink text-cream font-mono text-xs py-3.5 uppercase tracking-[0.2em] hover:bg-accent hover:text-ink transition-colors disabled:opacity-40"
      >
        {loading ? 'Entering…' : 'Enter →'}
      </button>
    </form>
  );
}
