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
    return (
      <p className="font-mono text-[10px] text-border uppercase tracking-widest">
        — Nothing published yet —
      </p>
    );
  }

  return (
    <div className="border-2 border-dashed border-border divide-y divide-dashed divide-border">
      {teardowns.map((t, i) => (
        <div key={t.id} className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <span className="font-mono text-xs text-border shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <p className="font-sans font-medium text-ink text-sm truncate">{t.title}</p>
              <p className="font-mono text-[10px] text-muted mt-0.5 uppercase tracking-wider">
                {new Date(t.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                }).toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <Link
              href={`/teardown/${t.id}`}
              className="font-mono text-[10px] text-muted hover:text-ink uppercase tracking-widest transition-colors"
            >
              View →
            </Link>
            <button
              onClick={() => handleDelete(t.id, t.title)}
              disabled={deleting === t.id}
              className="font-mono text-[10px] text-border hover:text-red-500 uppercase tracking-widest transition-colors disabled:opacity-40"
            >
              {deleting === t.id ? 'Removing…' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
