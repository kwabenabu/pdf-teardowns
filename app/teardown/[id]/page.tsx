import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTeardownById } from '@/lib/db';
import PdfViewer from '@/components/PdfViewer';

export const dynamic = 'force-dynamic';

export default async function TeardownPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const teardown = await getTeardownById(id);
  if (!teardown) notFound();

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav bar */}
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <Link
          href="/"
          className="font-mono text-[10px] text-muted tracking-[0.2em] uppercase hover:text-ink transition-colors"
        >
          ← Back to Teardowns
        </Link>
      </div>

      {/* Article header */}
      <article className="max-w-2xl mx-auto px-6 pt-10 pb-12">
        <time className="font-mono text-[10px] tracking-[0.2em] text-border uppercase block mb-6">
          {new Date(teardown.date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          }).toUpperCase()}
        </time>

        <h1 className="font-serif text-5xl sm:text-6xl font-black text-ink leading-[1.05] tracking-tight mb-8">
          {teardown.title}
        </h1>

        <div className="zine-divider">✦</div>

        <p className="drop-cap font-sans text-lg text-muted leading-relaxed mt-6">
          {teardown.description}
        </p>
      </article>

      {/* PDF — framed like a document placed on a desk */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="font-mono text-[10px] text-border uppercase tracking-[0.2em] mb-4 text-center">
          ── ── Document ── ──
        </div>
        <div className="md:-rotate-[0.4deg] transform-gpu">
          <div className="border-[3px] border-ink shadow-[8px_8px_0_0_#1A1A1A] overflow-hidden">
            <PdfViewer url={`/api/pdf/${teardown.id}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
