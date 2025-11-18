import { createClient } from '@/lib/supabase/client';
import type { UpcomingSession } from '@/components/dashboard/UpcomingSessions';

interface EnrollmentData {
  id: string;
  status: string;
  activity_id: string;
}

interface ActivityData {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  status: string;
  categories: {
    name: string;
  } | null;
}

/**
 * Fetches upcoming sessions for a student
 * Sessions = confirmed enrollments with future dates and OPEN/IN_PROGRESS status
 */
export async function getUpcomingSessions(userId: string): Promise<UpcomingSession[]> {
  const supabase = createClient();

  // Get current date at start of day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString().split('T')[0];

  // First, get confirmed enrollments
  const { data: enrollments, error: enrollError } = await supabase
    .from('enrollments')
    .select('id, status, activity_id')
    .eq('user_id', userId)
    .eq('status', 'CONFIRMED')
    .is('deleted_at', null);

  if (enrollError) {
    console.error('Error fetching enrollments:', enrollError);
    throw new Error('Failed to fetch upcoming sessions');
  }

  if (!enrollments || enrollments.length === 0) {
    return [];
  }

  // Then get activities that are in the future and not completed
  const activityIds = enrollments.map((e) => e.activity_id);

  const { data: activities, error: activityError } = await supabase
    .from('activities')
    .select('id, title, date, start_time, end_time, location, status, categories (name)')
    .in('id', activityIds)
    .in('status', ['OPEN', 'IN_PROGRESS'])
    .gte('date', todayISO)
    .order('date', { ascending: true });

  if (activityError) {
    console.error('Error fetching activities:', activityError);
    throw new Error('Failed to fetch activities');
  }

  if (!activities) {
    return [];
  }

  // Merge enrollments with activities
  const sessions: UpcomingSession[] = activities
    .map((activity: ActivityData) => {
      const enrollment = enrollments.find((e: EnrollmentData) => e.activity_id === activity.id);
      if (!enrollment) return null;

      return {
        id: activity.id,
        activityTitle: activity.title,
        activityCategory: activity.categories?.name || 'General',
        date: activity.date,
        startTime: activity.start_time,
        endTime: activity.end_time,
        location: activity.location,
        enrollmentStatus: enrollment.status,
      };
    })
    .filter((session): session is UpcomingSession => session !== null);

  return sessions;
}
