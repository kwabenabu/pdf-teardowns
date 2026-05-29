import Link from 'next/link';
import { getAllTeardowns } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const teardowns = await getAllTeardowns();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            PDF Teardowns
          </h1>
          <p className="mt-2 text-gray-500 text-lg">In-depth analyses, page by page.</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {teardowns.length === 0 ? (
          <p className="text-gray-400 text-center py-24 text-lg">No teardowns yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {teardowns.map((t) => (
              <Link key={t.id} href={`/teardown/${t.id}`} className="block group py-8">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <h2
                      className="text-2xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors leading-snug"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {t.title}
                    </h2>
                    <p className="mt-2 text-gray-600 text-base leading-relaxed line-clamp-2">
                      {t.description}
                    </p>
                    <time className="mt-3 block text-sm text-gray-400">
                      {new Date(t.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  <span className="shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors text-2xl mt-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
