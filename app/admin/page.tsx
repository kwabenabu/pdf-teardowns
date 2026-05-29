import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AdminLoginForm from './LoginForm';

export default function AdminPage() {
  if (isAuthenticated()) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl font-black text-ink">PDF Teardowns</h1>
          <p className="font-mono text-[10px] text-muted tracking-[0.25em] uppercase mt-2">
            Admin Access
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
