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
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 pt-10 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors font-sans tracking-wide uppercase"
        >
          ← All teardowns
        </Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-8 pb-14">
        <time className="block text-xs text-gray-300 font-sans tracking-wide uppercase mb-4">
          {new Date(teardown.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-950 leading-tight tracking-tight">
          {teardown.title}
        </h1>
        <p className="mt-5 text-gray-500 text-lg leading-relaxed font-sans">
          {teardown.description}
        </p>
      </article>

      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <PdfViewer url={`/api/pdf/${teardown.id}`} />
        </div>
      </div>
    </div>
  );
}
