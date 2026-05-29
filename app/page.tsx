import Link from 'next/link';
import { getAllTeardowns } from '@/lib/db';

export const dynamic = 'force-dynamic';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).toUpperCase();
}

export default async function HomePage() {
  const teardowns = await getAllTeardowns();
  const [featured, ...rest] = teardowns;

  return (
    <div className="min-h-screen bg-cream">
      {/* Masthead */}
      <header className="max-w-3xl mx-auto px-6 pt-16 pb-8">
        <p className="font-mono text-xs text-muted tracking-[0.2em] uppercase mb-3">
          Vol. I &nbsp;·&nbsp; A Personal Publication
        </p>
        <h1 className="font-serif text-7xl sm:text-8xl font-black text-ink leading-[0.9] tracking-tight">
          PDF<br />Teardowns
        </h1>

        <div className="zine-divider mt-10">✦ &nbsp; teardowns &nbsp; ✦</div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-24">
        {teardowns.length === 0 ? (
          <p className="font-mono text-xs text-muted uppercase tracking-widest text-center py-24">
            — Nothing published yet —
          </p>
        ) : (
          <div className="space-y-0">
            {/* Featured card */}
            {featured && (
              <Link
                href={`/teardown/${featured.id}`}
                className="group block border-2 border-dashed border-ink p-8 mb-8 transition-colors duration-300 hover:bg-accent"
              >
                <p className="font-mono text-[10px] text-muted tracking-[0.25em] uppercase mb-5 group-hover:text-ink transition-colors">
                  ✦ &nbsp; Featured
                </p>
                <h2 className="font-serif text-5xl sm:text-6xl font-black text-ink leading-tight mb-5">
                  {featured.title}
                </h2>
                <p className="text-muted text-base leading-relaxed mb-8 max-w-xl group-hover:text-ink transition-colors">
                  {featured.description}
                </p>
                <div className="flex items-center justify-between">
                  <time className="font-mono text-[10px] tracking-[0.2em] text-muted group-hover:text-ink transition-colors">
                    {formatDate(featured.date)}
                  </time>
                  <span className="font-mono text-xl text-ink group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </Link>
            )}

            {/* Rest of the cards */}
            {rest.map((t, i) => (
              <Link
                key={t.id}
                href={`/teardown/${t.id}`}
                className="group flex items-start gap-6 py-8 border-t border-dashed border-border transition-colors hover:bg-ink/[0.02]"
              >
                <span className="font-mono text-4xl font-bold text-border leading-none pt-1 shrink-0 select-none group-hover:text-accent transition-colors">
                  {String(i + 2).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-3xl font-bold text-ink leading-tight mb-2">
                    <span className="ink-underline">{t.title}</span>
                  </h2>
                  <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-4">
                    {t.description}
                  </p>
                  <time className="font-mono text-[10px] tracking-[0.2em] text-border uppercase">
                    {formatDate(t.date)}
                  </time>
                </div>
                <span className="font-mono text-xl text-border group-hover:text-ink group-hover:translate-x-1 transition-all inline-block shrink-0 pt-2">→</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
