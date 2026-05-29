import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getAllTeardowns } from '@/lib/db';
import UploadForm from './UploadForm';
import TeardownList from './TeardownList';
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
          <TeardownList teardowns={teardowns} />
        </section>
      </main>
    </div>
  );
}
