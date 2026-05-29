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
    <div className="min-h-screen bg-cream">
      <header className="border-b-2 border-dashed border-ink">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="font-serif text-2xl font-black text-ink">Dashboard</span>
          <div className="flex items-center gap-6">
            <Link href="/" className="font-mono text-[10px] text-muted hover:text-ink uppercase tracking-[0.2em] transition-colors">
              View Site →
            </Link>
            <form action="/api/auth?logout=1" method="POST">
              <button type="submit" className="font-mono text-[10px] text-muted hover:text-red-500 uppercase tracking-[0.2em] transition-colors">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-14">
        <section>
          <div className="zine-divider mb-8">✦ &nbsp; New Teardown &nbsp; ✦</div>
          <div className="border-2 border-dashed border-border p-8">
            <UploadForm />
          </div>
        </section>

        <section>
          <div className="zine-divider mb-8">
            ✦ &nbsp; Published ({teardowns.length}) &nbsp; ✦
          </div>
          <TeardownList teardowns={teardowns} />
        </section>
      </main>
    </div>
  );
}
