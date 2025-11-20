import { createClient } from '@/lib/supabase/client';

export interface ProfessorStats {
  activeOpportunities: number;
  totalStudents: number;
  pendingActions: number;
  newApplications: number;
  pendingHours: number;
  upcomingSessions: number;
}

/**
 * Fetches professor dashboard statistics
 *
 * Stats include:
 * - Active opportunities (OPEN status, created by professor)
 * - Total unique students across all activities
 * - New applications (PENDING status)
 * - Pending hours validation requests
 * - Upcoming sessions in next 7 days
 */
export async function getProfessorStats(professorId: string): Promise<ProfessorStats> {
  const supabase = createClient();

  try {
    // 1. Count active opportunities (OPEN status, created by professor)
    const { count: activeOpportunitiesCount, error: oppsError } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', professorId)
      .eq('status', 'OPEN')
      .is('deleted_at', null);

    if (oppsError) {
      console.error('Error fetching active opportunities:', oppsError);
      throw oppsError;
    }

    // 2. Count total unique students enrolled in professor's activities
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select('user_id, activity_id, activities!inner(created_by)')
      .eq('activities.created_by', professorId)
      .eq('status', 'CONFIRMED')
      .is('deleted_at', null)
      .returns<Array<{ user_id: string; activity_id: string }>>();

    if (enrollError) {
      console.error('Error fetching enrollments:', enrollError);
      throw enrollError;
    }

    const uniqueStudents = new Set(enrollments?.map((e) => e.user_id) || []);
    const totalStudents = uniqueStudents.size;

    // 3. Count new applications (PENDING status)
    const { count: newApplicationsCount, error: appsError } = await supabase
      .from('enrollments')
      .select('*, activities!inner(created_by)', { count: 'exact', head: true })
      .eq('activities.created_by', professorId)
      .eq('status', 'PENDING')
      .is('deleted_at', null);

    if (appsError) {
      console.error('Error fetching new applications:', appsError);
      throw appsError;
    }

    // 4. Count pending hours validation (status PENDING in hours_logs)
    // TODO: Implement when hours_logs table exists
    const pendingHours = 0;

    // 5. Count upcoming sessions in next 7 days
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const { count: upcomingSessionsCount, error: sessionsError } = await supabase
      .from('sessions')
      .select('*, activities!inner(created_by)', { count: 'exact', head: true })
      .eq('activities.created_by', professorId)
      .gte('date', today.toISOString().split('T')[0])
      .lte('date', nextWeek.toISOString().split('T')[0])
      .in('status', ['SCHEDULED', 'IN_PROGRESS'])
      .is('deleted_at', null);

    if (sessionsError) {
      console.error('Error fetching upcoming sessions:', sessionsError);
      throw sessionsError;
    }

    // Calculate total pending actions
    const pendingActions =
      (newApplicationsCount || 0) + pendingHours + (upcomingSessionsCount || 0);

    return {
      activeOpportunities: activeOpportunitiesCount || 0,
      totalStudents,
      pendingActions,
      newApplications: newApplicationsCount || 0,
      pendingHours,
      upcomingSessions: upcomingSessionsCount || 0,
    };
  } catch (error) {
    console.error('Failed to fetch professor stats:', error);
    // Return zeros on error to prevent dashboard crash
    return {
      activeOpportunities: 0,
      totalStudents: 0,
      pendingActions: 0,
      newApplications: 0,
      pendingHours: 0,
      upcomingSessions: 0,
    };
  }
}
