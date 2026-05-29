import Link from 'next/link';
import { getAllTeardowns } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const teardowns = await getAllTeardowns();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-14">
          <h1 className="font-serif text-5xl font-bold tracking-tight text-gray-950">
            PDF Teardowns
          </h1>
          <p className="mt-3 text-gray-400 text-base font-sans">
            In-depth analyses, page by page.
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {teardowns.length === 0 ? (
          <p className="text-gray-300 text-center py-32 text-base font-sans">
            Nothing published yet.
          </p>
        ) : (
          <div className="space-y-3">
            {teardowns.map((t) => (
              <Link
                key={t.id}
                href={`/teardown/${t.id}`}
                className="group block rounded-2xl border border-gray-100 bg-white px-7 py-6 transition-all duration-200 hover:border-gray-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-serif text-2xl font-semibold text-gray-950 leading-snug group-hover:text-gray-700 transition-colors">
                      {t.title}
                    </h2>
                    <p className="mt-2 text-gray-500 text-sm leading-relaxed line-clamp-2 font-sans">
                      {t.description}
                    </p>
                    <time className="mt-4 block text-xs text-gray-300 font-sans tracking-wide uppercase">
                      {new Date(t.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  <span className="shrink-0 text-gray-200 group-hover:text-gray-400 transition-colors text-xl mt-1 font-sans">
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
