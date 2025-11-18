import { createClient } from '@/lib/supabase/client';

export interface StudentStats {
  totalHours: number;
  activeOpportunities: number;
  completedOpportunities: number;
}

interface EnrollmentWithActivity {
  id: string;
  status: string;
  attendance_status: string | null;
  activities: {
    id: string;
    status: string;
    start_time: string;
    end_time: string;
  } | null;
}

/**
 * Fetches statistics for a student user
 * Calculates: total hours, active opportunities, completed opportunities
 */
export async function getStudentStats(userId: string): Promise<StudentStats> {
  const supabase = createClient();

  // First, fetch enrollments
  const { data: enrollments, error: enrollError } = await supabase
    .from('enrollments')
    .select('id, status, attendance_status, activity_id')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .returns<
      Array<{ id: string; status: string; attendance_status: string | null; activity_id: string }>
    >();

  if (enrollError) {
    console.error('Error fetching enrollments:', enrollError);
    throw new Error('Failed to fetch student statistics');
  }

  if (!enrollments || enrollments.length === 0) {
    return {
      totalHours: 0,
      activeOpportunities: 0,
      completedOpportunities: 0,
    };
  }

  // Then fetch activities
  const activityIds = enrollments.map((e) => e.activity_id);

  const { data: activities, error: activityError } = await supabase
    .from('activities')
    .select('id, status, start_time, end_time')
    .in('id', activityIds)
    .returns<Array<{ id: string; status: string; start_time: string; end_time: string }>>();

  if (activityError) {
    console.error('Error fetching activities:', activityError);
    throw new Error('Failed to fetch student statistics');
  }

  if (!activities) {
    return {
      totalHours: 0,
      activeOpportunities: 0,
      completedOpportunities: 0,
    };
  }

  // Merge data
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

  // Calculate stats
  let totalHours = 0;
  let activeCount = 0;
  let completedCount = 0;

  enrollmentsWithActivities.forEach((enrollment) => {
    const activity = enrollment.activities;

    if (!activity) return;

    // Count active opportunities (CONFIRMED status, activity not completed)
    if (
      enrollment.status === 'CONFIRMED' &&
      (activity.status === 'OPEN' || activity.status === 'IN_PROGRESS')
    ) {
      activeCount++;
    }

    // Count completed opportunities
    if (activity.status === 'COMPLETED') {
      completedCount++;
    }

    // Calculate total hours for PRESENT attendance
    if (enrollment.attendance_status === 'PRESENT' && activity.start_time && activity.end_time) {
      // Calculate hours between start_time and end_time
      const start = new Date(`1970-01-01T${activity.start_time}`);
      const end = new Date(`1970-01-01T${activity.end_time}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      totalHours += hours;
    }
  });

  return {
    totalHours: Math.round(totalHours), // Round to nearest hour
    activeOpportunities: activeCount,
    completedOpportunities: completedCount,
  };
}

/**
 * Hook for use in React components
 */
export async function useStudentStats(userId: string | null) {
  if (!userId) {
    return {
      totalHours: 0,
      activeOpportunities: 0,
      completedOpportunities: 0,
    };
  }

  return getStudentStats(userId);
}
