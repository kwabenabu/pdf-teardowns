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
    return <p className="text-xs font-sans text-gray-300 uppercase tracking-wide">Nothing published yet.</p>;
  }

  return (
    <div className="divide-y divide-gray-100 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {teardowns.map((t) => (
        <div key={t.id} className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-sans font-medium text-gray-800 text-sm truncate">{t.title}</p>
            <p className="text-xs text-gray-300 font-sans mt-0.5">
              {new Date(t.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <Link
              href={`/teardown/${t.id}`}
              className="text-xs font-sans text-gray-400 hover:text-gray-700 transition"
            >
              View →
            </Link>
            <button
              onClick={() => handleDelete(t.id, t.title)}
              disabled={deleting === t.id}
              className="text-xs font-sans text-gray-300 hover:text-red-400 transition disabled:opacity-40"
            >
              {deleting === t.id ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
