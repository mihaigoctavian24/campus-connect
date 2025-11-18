import { createClient } from '@/lib/supabase/client';
import type { ActiveOpportunity } from '@/components/dashboard/ActiveOpportunities';

interface EnrollmentWithActivity {
  id: string;
  status: string;
  attendance_status: string | null;
  activities: {
    id: string;
    title: string;
    categories: {
      name: string;
    } | null;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    status: string;
  } | null;
}

/**
 * Fetches active enrollments for a student user
 * Active = CONFIRMED status + activity OPEN or IN_PROGRESS
 */
export async function getActiveEnrollments(userId: string): Promise<ActiveOpportunity[]> {
  const supabase = createClient();

  // First, get enrollments
  const { data: enrollments, error: enrollError } = await supabase
    .from('enrollments')
    .select('id, status, attendance_status, activity_id')
    .eq('user_id', userId)
    .eq('status', 'CONFIRMED')
    .is('deleted_at', null)
    .returns<Array<{ id: string; status: string; attendance_status: string | null; activity_id: string }>>();

  if (enrollError) {
    console.error('Error fetching enrollments:', enrollError);
    throw new Error('Failed to fetch active enrollments');
  }

  if (!enrollments || enrollments.length === 0) {
    return [];
  }

  // Then get activities for those enrollments
  const activityIds = enrollments.map((e) => e.activity_id);

  const { data: activities, error: activityError } = await supabase
    .from('activities')
    .select(
      `
      id,
      title,
      categories (name),
      date,
      start_time,
      end_time,
      location,
      status
    `
    )
    .in('id', activityIds)
    .in('status', ['OPEN', 'IN_PROGRESS'])
    .returns<Array<{
      id: string;
      title: string;
      categories: { name: string } | null;
      date: string;
      start_time: string;
      end_time: string;
      location: string;
      status: string;
    }>>();

  if (activityError) {
    console.error('Error fetching activities:', activityError);
    throw new Error('Failed to fetch activities');
  }

  if (!activities) {
    return [];
  }

  // Merge enrollments with activities
  const enrollmentsWithActivities = enrollments
    .map((enrollment) => {
      const activity = activities.find((a) => a.id === enrollment.activity_id);
      if (!activity) return null;

      return {
        ...enrollment,
        activities: activity,
      };
    })
    .filter((e) => e !== null) as EnrollmentWithActivity[];

  // Transform to ActiveOpportunity format
  const activeOpportunities: ActiveOpportunity[] = enrollmentsWithActivities
    .filter((enrollment) => enrollment.activities !== null)
    .map((enrollment) => {
      const activity = enrollment.activities!;

      // Calculate hours completed (mock for now, will be calculated from attendance later)
      const totalHours = calculateHours(activity.start_time, activity.end_time);
      const hoursCompleted = 0; // TODO: Calculate from attendance records

      // Calculate progress percentage
      const progress = totalHours > 0 ? Math.round((hoursCompleted / totalHours) * 100) : 0;

      // Format next session info
      const nextSession = {
        date: formatDate(activity.date),
        time: `${activity.start_time}-${activity.end_time}`,
        location: activity.location,
      };

      return {
        id: enrollment.id,
        title: activity.title,
        department: activity.categories?.name || 'General',
        progress,
        hoursCompleted,
        totalHours,
        nextSession,
      };
    });

  return activeOpportunities;
}

/**
 * Calculate hours between two time strings
 */
function calculateHours(startTime: string, endTime: string): number {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return Math.round(hours);
}

/**
 * Format date to readable string
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}
