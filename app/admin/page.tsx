import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AdminLoginForm from './LoginForm';

export default function AdminPage() {
  if (isAuthenticated()) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-gray-950">
            PDF Teardowns
          </h1>
          <p className="mt-2 text-sm text-gray-400 font-sans">Admin access</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
