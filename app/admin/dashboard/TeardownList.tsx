'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Teardown } from '@/lib/db';

export default function TeardownList({ teardowns }: { teardowns: Teardown[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<number | null>(null);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/teardowns/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      alert('Delete failed. Try again.');
    }
    setDeleting(null);
  }

  if (teardowns.length === 0) {
    return <p className="text-gray-400 text-sm">None yet.</p>;
  }

  return (
    <div className="divide-y divide-gray-100 bg-white border border-gray-200 rounded-xl shadow-sm">
      {teardowns.map((t) => (
        <div key={t.id} className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm truncate">{t.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(t.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href={`/teardown/${t.id}`}
              className="text-xs text-gray-400 hover:text-gray-600 transition"
            >
              View →
            </Link>
            <button
              onClick={() => handleDelete(t.id, t.title)}
              disabled={deleting === t.id}
              className="text-xs text-red-400 hover:text-red-600 transition disabled:opacity-40"
            >
              {deleting === t.id ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
