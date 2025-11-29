import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const userRole = (profile?.role || '').toUpperCase();

  // Only ADMIN can access admin routes
  if (userRole !== 'ADMIN') {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'PROFESSOR') {
      redirect('/dashboard/professor');
    } else {
      redirect('/dashboard/student');
    }
  }

  return <DashboardLayout role="admin">{children}</DashboardLayout>;
}
