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
        <h1
          className="text-3xl font-bold text-center text-gray-900 mb-8"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Admin
        </h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}
