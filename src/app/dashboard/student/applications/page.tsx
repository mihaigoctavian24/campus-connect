import { createClient } from '@/lib/supabase/server';
import { MyApplications, Application } from '@/components/dashboard/MyApplications';
import { redirect } from 'next/navigation';

export default async function ApplicationsPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch user's enrollments with activity details
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(
      `
      id,
      status,
      created_at,
      updated_at,
      activities!inner(
        id,
        title,
        category_id,
        date,
        location,
        categories(name)
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Transform enrollments to Application format
  const applications: Application[] =
    enrollments?.map((enrollment) => {
      const activity = enrollment.activities as any;
      const category = activity.categories as any;

      return {
        id: enrollment.id,
        activityTitle: activity.title,
        activityCategory: category?.name || 'Uncategorized',
        status: enrollment.status.toUpperCase() as Application['status'],
        appliedAt: enrollment.created_at,
        respondedAt:
          enrollment.updated_at !== enrollment.created_at ? enrollment.updated_at : undefined,
        activityDate: activity.date,
        activityLocation: activity.location,
      };
    }) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">My Applications</h1>
        <p className="text-muted-foreground mt-2">
          Track the status of your volunteer opportunity applications
        </p>
      </div>

      <MyApplications applications={applications} />
    </div>
  );
}
