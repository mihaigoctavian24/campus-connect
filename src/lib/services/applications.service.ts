import { createClient } from '@/lib/supabase/client';
import type { Application } from '@/components/dashboard/MyApplications';

interface EnrollmentWithActivity {
  id: string;
  status: string;
  enrolled_at: string;
  cancelled_at: string | null;
  activity_id: string;
}

interface ActivityData {
  id: string;
  title: string;
  date: string;
  location: string;
  categories: {
    name: string;
  } | null;
}

/**
 * Fetches all applications (enrollments) for a student user
 * Applications include: PENDING (waiting professor approval), CONFIRMED (accepted), REJECTED
 */
export async function getStudentApplications(userId: string): Promise<Application[]> {
  const supabase = createClient();

  // First, get all enrollments for this user
  const { data: enrollments, error: enrollError } = await supabase
    .from('enrollments')
    .select('id, status, enrolled_at, cancelled_at, activity_id')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('enrolled_at', { ascending: false })
    .returns<Array<EnrollmentWithActivity>>();

  if (enrollError) {
    console.error('Error fetching enrollments:', enrollError);
    throw new Error('Failed to fetch applications');
  }

  if (!enrollments || enrollments.length === 0) {
    return [];
  }

  // Then get activities for those enrollments
  const activityIds = enrollments.map((e) => e.activity_id);

  const { data: activities, error: activityError } = await supabase
    .from('activities')
    .select('id, title, date, location, categories (name)')
    .in('id', activityIds)
    .returns<Array<ActivityData>>();

  if (activityError) {
    console.error('Error fetching activities:', activityError);
    throw new Error('Failed to fetch activities');
  }

  if (!activities) {
    return [];
  }

  // Merge enrollments with activities
  const applications = enrollments
    .map((enrollment: EnrollmentWithActivity) => {
      const activity = activities.find((a: ActivityData) => a.id === enrollment.activity_id);
      if (!activity) return null;

      const app: Application = {
        id: enrollment.id,
        activityTitle: activity.title,
        activityCategory: activity.categories?.name || 'General',
        status: enrollment.status as Application['status'],
        appliedAt: enrollment.enrolled_at,
        activityDate: activity.date,
        activityLocation: activity.location,
      };

      if (enrollment.cancelled_at) {
        app.respondedAt = enrollment.cancelled_at;
      }

      return app;
    })
    .filter((app): app is Application => app !== null);

  return applications;
}
