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
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="font-serif text-lg font-semibold text-gray-950">Dashboard</span>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-xs font-sans text-gray-400 hover:text-gray-700 transition tracking-wide uppercase">
              View site →
            </Link>
            <form action="/api/auth?logout=1" method="POST">
              <button
                type="submit"
                className="text-xs font-sans text-gray-300 hover:text-red-400 transition tracking-wide uppercase"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-14">
        <section>
          <h2 className="font-sans text-xs font-medium text-gray-400 uppercase tracking-widest mb-5">
            New Teardown
          </h2>
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <UploadForm />
          </div>
        </section>

        <section>
          <h2 className="font-sans text-xs font-medium text-gray-400 uppercase tracking-widest mb-5">
            Published ({teardowns.length})
          </h2>
          <TeardownList teardowns={teardowns} />
        </section>
      </main>
    </div>
  );
}
