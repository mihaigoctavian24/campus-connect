import { createClient } from '@/lib/supabase/client';
import type { ActiveOpportunity } from '@/components/dashboard/ActiveOpportunities';

interface EnrollmentWithActivity {
  id: string;
  status: string;
  attendance_status: string | null;
  activity: {
    id: string;
    title: string;
    category: {
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

  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select(
      `
      id,
      status,
      attendance_status,
      activity:activities (
        id,
        title,
        category:categories (
          name
        ),
        date,
        start_time,
        end_time,
        location,
        status
      )
    `
    )
    .eq('user_id', userId)
    .eq('status', 'CONFIRMED')
    .in('activity.status', ['OPEN', 'IN_PROGRESS'])
    .is('deleted_at', null)
    .order('activity.date', { ascending: true });

  if (error) {
    console.error('Error fetching active enrollments:', error);
    throw new Error('Failed to fetch active enrollments');
  }

  if (!enrollments) {
    return [];
  }

  // Transform to ActiveOpportunity format
  const activeOpportunities: ActiveOpportunity[] = (
    enrollments as unknown as EnrollmentWithActivity[]
  )
    .filter((enrollment) => enrollment.activity !== null)
    .map((enrollment) => {
      const activity = enrollment.activity!;

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
        department: activity.category?.name || 'General',
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
