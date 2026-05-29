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
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← All teardowns
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1
          className="text-4xl font-bold text-gray-900 leading-tight"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {teardown.title}
        </h1>
        <p className="mt-4 text-gray-600 text-lg leading-relaxed">{teardown.description}</p>
        <time className="mt-3 block text-sm text-gray-400">
          {new Date(teardown.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>

      <div className="border-t border-gray-200">
        <PdfViewer url={`/api/pdf/${teardown.id}`} />
      </div>
    </div>
  );
}
