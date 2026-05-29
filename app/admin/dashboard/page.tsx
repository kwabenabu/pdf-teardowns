import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getAllTeardowns } from '@/lib/db';
import UploadForm from './UploadForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  if (!isAuthenticated()) {
    redirect('/admin');
  }

  const teardowns = await getAllTeardowns();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
              View site →
            </Link>
            <form action="/api/auth?logout=1" method="POST">
              <button
                type="submit"
                className="text-sm text-gray-400 hover:text-red-500 transition"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-12">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Upload New Teardown</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <UploadForm />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Published Teardowns</h2>
          {teardowns.length === 0 ? (
            <p className="text-gray-400 text-sm">None yet.</p>
          ) : (
            <div className="divide-y divide-gray-100 bg-white border border-gray-200 rounded-xl shadow-sm">
              {teardowns.map((t) => (
                <div key={t.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(t.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Link
                    href={`/teardown/${t.id}`}
                    className="text-xs text-gray-400 hover:text-gray-600 transition shrink-0"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
