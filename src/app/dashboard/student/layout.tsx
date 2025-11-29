import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default async function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
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

  // ADMIN can access all routes
  // PROFESSOR gets redirected to professor dashboard
  // STUDENT stays here
  if (userRole === 'PROFESSOR') {
    redirect('/dashboard/professor');
  }

  return <DashboardLayout role="student">{children}</DashboardLayout>;
}
