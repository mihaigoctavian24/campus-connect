import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Nu ești autentificat' }, { status: 401 });
    }

    // Verify user is a professor
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: string }>();

    if (profileError || !profile) {
      return NextResponse.json({ message: 'Profil negăsit' }, { status: 404 });
    }

    if (profile.role !== 'PROFESSOR') {
      return NextResponse.json(
        { message: 'Doar profesorii pot accesa această resursă' },
        { status: 403 }
      );
    }

    // Fetch opportunities created by this professor with stats
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select(
        `
        id,
        title,
        description,
        status,
        location,
        date,
        start_time,
        end_time,
        max_participants,
        current_participants,
        created_at,
        category_id,
        department_id
      `
      )
      .eq('created_by', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError);
      return NextResponse.json(
        { message: 'Eroare la încărcarea oportunităților' },
        { status: 500 }
      );
    }

    // Get category and department names for each activity
    const enrichedActivities = await Promise.all(
      activities.map(async (activity) => {
        // Get category name
        const { data: category } = await supabase
          .from('categories')
          .select('name')
          .eq('id', activity.category_id)
          .single();

        // Get department name
        const { data: department } = await supabase
          .from('departments')
          .select('name')
          .eq('id', activity.department_id)
          .single();

        // Get enrollment stats
        const { count: enrolledCount } = await supabase
          .from('activity_enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('activity_id', activity.id)
          .eq('status', 'APPROVED');

        // Get pending applications count
        const { count: pendingCount } = await supabase
          .from('activity_enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('activity_id', activity.id)
          .eq('status', 'PENDING');

        // Get total hours from sessions
        const { data: sessions } = await supabase
          .from('activity_sessions')
          .select('duration_hours')
          .eq('activity_id', activity.id);

        const totalHours = sessions?.reduce((sum, session) => sum + (session.duration_hours || 0), 0) || 0;

        // Calculate average attendance rate from sessions
        const { data: sessionStats } = await supabase
          .from('activity_sessions')
          .select('total_participants, attended_count')
          .eq('activity_id', activity.id)
          .gt('total_participants', 0);

        let avgAttendance: number | null = null;
        if (sessionStats && sessionStats.length > 0) {
          const totalAttendanceRate = sessionStats.reduce((sum, stat) => {
            const rate = (stat.attended_count / stat.total_participants) * 100;
            return sum + rate;
          }, 0);
          avgAttendance = Math.round(totalAttendanceRate / sessionStats.length);
        }

        return {
          id: activity.id,
          title: activity.title,
          description: activity.description,
          status: activity.status,
          location: activity.location,
          date: activity.date,
          start_time: activity.start_time,
          end_time: activity.end_time,
          category_name: category?.name || 'Unknown',
          department_name: department?.name || 'Unknown',
          stats: {
            enrolled: enrolledCount || 0,
            maxStudents: activity.max_participants,
            avgAttendance,
            totalHours,
            pendingApplications: pendingCount || 0,
          },
        };
      })
    );

    return NextResponse.json(enrichedActivities);
  } catch (error) {
    console.error('Professor opportunities fetch error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}
