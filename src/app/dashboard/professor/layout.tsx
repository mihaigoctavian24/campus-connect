import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default async function ProfessorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  // ADMIN and PROFESSOR can access professor routes
  if (userRole !== 'ADMIN' && userRole !== 'PROFESSOR') {
    // Students get redirected to student dashboard
    redirect('/dashboard/student');
  }

  return <DashboardLayout role="professor">{children}</DashboardLayout>;
}
