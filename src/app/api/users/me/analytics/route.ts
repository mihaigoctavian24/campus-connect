import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 });
    }

    // Get user's hours requests with activity data
    const { data: hoursRequests, error: hoursError } = await supabase
      .from('hours_requests')
      .select(
        `
        id,
        hours,
        status,
        created_at,
        activity:activities (
          id,
          title,
          category_id
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (hoursError) {
      console.error('Error fetching hours requests:', hoursError);
      // Continue with empty data if hours_requests table doesn't exist yet
    }

    // Get user's enrollments with activity data (replaces applications)
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(
        `
        id,
        status,
        created_at,
        activity:activities (
          id,
          title,
          category_id
        )
      `
      )
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError);
    }

    // Get user's attendance records
    const { data: attendance, error: attendanceError } = await supabase
      .from('attendance')
      .select(
        `
        id,
        status,
        checked_in_at,
        session:sessions (
          id,
          date,
          start_time,
          end_time,
          location,
          activity:activities (
            id,
            title,
            category_id
          )
        )
      `
      )
      .eq('user_id', user.id)
      .order('checked_in_at', { ascending: false });

    if (attendanceError) {
      console.error('Error fetching attendance:', attendanceError);
    }

    // Process hours data - convert to internal format
    const hoursData: HoursRequest[] = (hoursRequests || []).map((hr) => ({
      id: hr.id,
      hours: Number(hr.hours) || 0,
      status: hr.status || 'PENDING',
      created_at: hr.created_at || new Date().toISOString(),
      activity: hr.activity
        ? {
            id: (hr.activity as { id: string; title: string; category_id: string | null }).id,
            title: (hr.activity as { id: string; title: string; category_id: string | null }).title,
            category_id:
              (hr.activity as { id: string; title: string; category_id: string | null })
                .category_id || null,
          }
        : null,
    }));

    const totalHours = hoursData.reduce((sum, hr) => sum + (hr.hours || 0), 0);
    const approvedHours = hoursData
      .filter((hr) => hr.status === 'APPROVED')
      .reduce((sum, hr) => sum + (hr.hours || 0), 0);
    const pendingHours = hoursData
      .filter((hr) => hr.status === 'PENDING')
      .reduce((sum, hr) => sum + (hr.hours || 0), 0);

    // Process enrollments data (replaces applications)
    const enrollmentsData: Enrollment[] = (enrollments || []).map((e) => ({
      id: e.id,
      status: e.status,
      created_at: e.created_at,
      activity: e.activity
        ? {
            id: (e.activity as { id: string; title: string; category_id: string | null }).id,
            title: (e.activity as { id: string; title: string; category_id: string | null }).title,
            category_id:
              (e.activity as { id: string; title: string; category_id: string | null })
                .category_id || null,
          }
        : null,
    }));

    const totalActivities = enrollmentsData.length;
    const completedActivities = enrollmentsData.filter(
      (e) => e.status === 'CONFIRMED' || e.status === 'COMPLETED'
    ).length;

    // Calculate monthly data (last 6 months)
    const monthlyData = getMonthlyData(hoursData);

    // Calculate category breakdown
    const categoryData = getCategoryData(hoursData);

    // Process attendance for timeline
    const attendanceData: AttendanceRecord[] = (attendance || []).map((att) => {
      const session = att.session as {
        id: string;
        date: string;
        start_time: string;
        end_time: string;
        location: string;
        activity: { id: string; title: string; category_id: string | null } | null;
      } | null;

      return {
        id: att.id,
        status: att.status,
        checked_in_at: att.checked_in_at,
        session: session
          ? {
              id: session.id,
              date: session.date,
              start_time: session.start_time,
              end_time: session.end_time,
              location: session.location,
              activity: session.activity
                ? {
                    id: session.activity.id,
                    title: session.activity.title,
                    category_id: session.activity.category_id,
                  }
                : null,
            }
          : null,
      };
    });

    // Get recent activities for timeline
    const recentActivities = getRecentActivities(attendanceData, enrollmentsData);

    // Default goal hours (volunteer_goal_hours doesn't exist in schema)
    const goalHours = 50; // Default 50h per semester

    return NextResponse.json({
      totalHours,
      approvedHours,
      pendingHours,
      totalActivities,
      completedActivities,
      goalHours,
      monthlyData,
      categoryData,
      recentActivities,
    });
  } catch (error) {
    console.error('Error in GET /api/users/me/analytics:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

interface HoursRequest {
  id: string;
  hours: number;
  status: string;
  created_at: string;
  activity: {
    id: string;
    title: string;
    category_id: string | null;
  } | null;
}

interface Enrollment {
  id: string;
  status: string;
  created_at: string;
  activity: {
    id: string;
    title: string;
    category_id: string | null;
  } | null;
}

function getMonthlyData(hoursData: HoursRequest[]) {
  const months: Record<string, { hours: number; approved: number; pending: number }> = {};

  // Initialize last 6 months
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months[key] = { hours: 0, approved: 0, pending: 0 };
  }

  // Populate with data
  hoursData.forEach((hr) => {
    const date = new Date(hr.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (months[key]) {
      months[key].hours += hr.hours || 0;
      if (hr.status === 'approved') {
        months[key].approved += hr.hours || 0;
      } else if (hr.status === 'pending') {
        months[key].pending += hr.hours || 0;
      }
    }
  });

  return Object.entries(months).map(([month, data]) => ({
    month,
    ...data,
  }));
}

function getCategoryData(hoursData: HoursRequest[]) {
  const categories: Record<string, number> = {};

  hoursData.forEach((hr) => {
    // Use category_id as category name for now (or 'Altele' if null)
    const category = hr.activity?.category_id || 'Altele';
    categories[category] = (categories[category] || 0) + (hr.hours || 0);
  });

  return Object.entries(categories)
    .map(([category, hours]) => ({ category, hours }))
    .sort((a, b) => b.hours - a.hours);
}

interface AttendanceRecord {
  id: string;
  status: string;
  checked_in_at: string | null;
  session: {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    activity: {
      id: string;
      title: string;
      category_id: string | null;
    } | null;
  } | null;
}

function getRecentActivities(attendance: AttendanceRecord[], enrollments: Enrollment[]) {
  const activities: Array<{
    id: string;
    activityId: string;
    activityTitle: string;
    date: string;
    hours: number;
    status: 'completed' | 'attended' | 'missed' | 'upcoming';
    location?: string;
    category_id?: string | null;
  }> = [];

  // Add from attendance records
  attendance.forEach((att) => {
    const session = att.session;
    const activity = session?.activity;

    if (session && activity) {
      // Calculate hours from session times
      let hours = 2; // Default
      if (session.start_time && session.end_time) {
        const start = new Date(`2000-01-01T${session.start_time}`);
        const end = new Date(`2000-01-01T${session.end_time}`);
        hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
      }

      activities.push({
        id: att.id,
        activityId: activity.id,
        activityTitle: activity.title,
        date: session.date,
        hours,
        status:
          att.status === 'PRESENT' ? 'attended' : att.status === 'ABSENT' ? 'missed' : 'completed',
        location: session.location,
        category_id: activity.category_id,
      });
    }
  });

  // Add confirmed enrollments that might not have attendance yet
  enrollments.forEach((enrollment) => {
    if (enrollment.activity && enrollment.status === 'CONFIRMED') {
      // Check if we don't already have this activity in the list
      const exists = activities.some((a) => a.activityId === enrollment.activity?.id);
      if (!exists) {
        activities.push({
          id: enrollment.id,
          activityId: enrollment.activity.id,
          activityTitle: enrollment.activity.title,
          date: enrollment.created_at,
          hours: 0,
          status: 'upcoming',
          category_id: enrollment.activity.category_id,
        });
      }
    }
  });

  // Sort by date (most recent first) and take top 10
  return activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
}
