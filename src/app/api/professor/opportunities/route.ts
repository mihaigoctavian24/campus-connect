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

        // Get sessions for this activity
        const { data: sessions } = await supabase
          .schema('public')
          .from('sessions')
          .select('id, start_time, end_time, status')
          .eq('activity_id', activity.id);

        // Calculate total hours from sessions (difference between start and end time)
        let totalHours = 0;
        if (sessions && sessions.length > 0) {
          sessions.forEach((session) => {
            if (session.start_time && session.end_time) {
              const start = new Date(`1970-01-01T${session.start_time}`);
              const end = new Date(`1970-01-01T${session.end_time}`);
              const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
              totalHours += hours;
            }
          });
        }

        // Calculate average attendance rate from attendance records
        let avgAttendance: number | null = null;
        if (sessions && sessions.length > 0) {
          const sessionIds = sessions.map((s) => s.id);

          // Get total attendance records for these sessions
          const { count: totalAttendance } = await supabase
            .from('attendance')
            .select('*', { count: 'exact', head: true })
            .in('session_id', sessionIds);

          // Get present attendance records
          const { count: presentCount } = await supabase
            .from('attendance')
            .select('*', { count: 'exact', head: true })
            .in('session_id', sessionIds)
            .eq('status', 'PRESENT');

          if (totalAttendance && totalAttendance > 0) {
            avgAttendance = Math.round(((presentCount || 0) / totalAttendance) * 100);
          }
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
