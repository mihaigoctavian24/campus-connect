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

    // Check if user is professor
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role?.toUpperCase() !== 'PROFESSOR') {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 });
    }

    // Get professor's activities
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('id, title')
      .eq('created_by', user.id)
      .is('deleted_at', null);

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError);
    }

    const activityIds = activities?.map((a) => a.id) || [];

    // Initialize default values
    let totalStudents = 0;
    let totalHoursValidated = 0;
    let averageAttendance = 0;
    let completionRate = 0;
    const totalActivities = activities?.length || 0;
    let totalSessions = 0;

    const attendanceTrends: Array<{
      date: string;
      present: number;
      absent: number;
      total: number;
    }> = [];

    const studentsMap = new Map<
      string,
      {
        id: string;
        name: string;
        email: string;
        totalHours: number;
        approvedHours: number;
        sessionsAttended: number;
        totalSessions: number;
        lastActivity: string | null;
      }
    >();

    const atRiskStudents: Array<{
      id: string;
      name: string;
      email: string;
      attendanceRate: number;
      missedSessions: number;
      lastActivity: string | null;
      activityTitle: string;
      trend: 'declining' | 'stable' | 'improving';
    }> = [];

    if (activityIds.length > 0) {
      // Get enrollments for professor's activities (replaces applications)
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(
          `
          id,
          user_id,
          activity_id,
          status,
          created_at,
          user:profiles!enrollments_user_id_fkey (
            id,
            first_name,
            last_name,
            email
          )
        `
        )
        .in('activity_id', activityIds)
        .is('deleted_at', null);

      // Get unique students
      const uniqueStudentIds = new Set(enrollments?.map((a) => a.user_id) || []);
      totalStudents = uniqueStudentIds.size;

      // Get approved hours for these activities
      const { data: hoursRequests } = await supabase
        .from('hours_requests')
        .select('id, hours, status, user_id, activity_id')
        .in('activity_id', activityIds);

      totalHoursValidated = (hoursRequests || [])
        .filter((hr) => hr.status === 'approved')
        .reduce((sum, hr) => sum + (hr.hours || 0), 0);

      // Get sessions for these activities
      const { data: sessions } = await supabase
        .from('sessions')
        .select('id, activity_id, date')
        .in('activity_id', activityIds)
        .is('deleted_at', null);

      totalSessions = sessions?.length || 0;

      // Get attendance records
      const sessionIds = sessions?.map((s) => s.id) || [];
      let attendanceRecords: Array<{
        id: string;
        user_id: string;
        session_id: string;
        status: string;
        checked_in_at: string | null;
      }> = [];

      if (sessionIds.length > 0) {
        const { data: attendance } = await supabase
          .from('attendance')
          .select('id, user_id, session_id, status, checked_in_at')
          .in('session_id', sessionIds);

        attendanceRecords = attendance || [];
      }

      // Calculate attendance trends by month
      const monthlyAttendance: Record<string, { present: number; absent: number; total: number }> =
        {};

      // Initialize last 6 months
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyAttendance[key] = { present: 0, absent: 0, total: 0 };
      }

      // Populate attendance data
      attendanceRecords.forEach((att) => {
        const session = sessions?.find((s) => s.id === att.session_id);
        if (session) {
          const date = new Date(session.date);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (monthlyAttendance[key]) {
            monthlyAttendance[key].total += 1;
            if (att.status === 'present') {
              monthlyAttendance[key].present += 1;
            } else {
              monthlyAttendance[key].absent += 1;
            }
          }
        }
      });

      // Convert to array
      Object.entries(monthlyAttendance).forEach(([date, data]) => {
        attendanceTrends.push({ date, ...data });
      });

      // Calculate average attendance
      const totalAttendance = attendanceRecords.length;
      const presentCount = attendanceRecords.filter((a) => a.status === 'present').length;
      averageAttendance =
        totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

      // Calculate completion rate (students who completed vs enrolled)
      const completedEnrollments = enrollments?.filter((a) => a.status === 'CONFIRMED').length || 0;
      const totalEnrollments = enrollments?.length || 0;
      completionRate =
        totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

      // Build student performance data
      enrollments?.forEach((enrollment) => {
        const userProfile = enrollment.user as {
          id: string;
          first_name: string | null;
          last_name: string | null;
          email: string | null;
        } | null;
        if (!userProfile) return;

        const studentId = enrollment.user_id;
        const existing = studentsMap.get(studentId);

        const studentHours = (hoursRequests || [])
          .filter((hr) => hr.user_id === studentId)
          .reduce(
            (acc, hr) => {
              acc.total += hr.hours || 0;
              if (hr.status === 'approved') acc.approved += hr.hours || 0;
              return acc;
            },
            { total: 0, approved: 0 }
          );

        const studentAttendance = attendanceRecords.filter((a) => a.user_id === studentId);
        const sessionsAttended = studentAttendance.filter((a) => a.status === 'present').length;
        const studentTotalSessions = studentAttendance.length;

        const lastAtt = studentAttendance
          .filter((a) => a.checked_in_at)
          .sort(
            (a, b) => new Date(b.checked_in_at!).getTime() - new Date(a.checked_in_at!).getTime()
          )[0];

        if (!existing) {
          studentsMap.set(studentId, {
            id: studentId,
            name:
              `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'Anonim',
            email: userProfile.email || '',
            totalHours: studentHours.total,
            approvedHours: studentHours.approved,
            sessionsAttended,
            totalSessions: studentTotalSessions,
            lastActivity: lastAtt?.checked_in_at || null,
          });
        } else {
          studentsMap.set(studentId, {
            ...existing,
            totalHours: existing.totalHours + studentHours.total,
            approvedHours: existing.approvedHours + studentHours.approved,
            sessionsAttended: existing.sessionsAttended + sessionsAttended,
            totalSessions: existing.totalSessions + studentTotalSessions,
            lastActivity: lastAtt?.checked_in_at || existing.lastActivity,
          });
        }
      });

      // Identify at-risk students (attendance < 40%)
      studentsMap.forEach((student) => {
        const rate =
          student.totalSessions > 0
            ? Math.round((student.sessionsAttended / student.totalSessions) * 100)
            : 100; // Don't flag if no sessions yet

        if (rate < 40 && student.totalSessions > 0) {
          // Find which activity this student is in
          const studentEnrollment = enrollments?.find((a) => a.user_id === student.id);
          const activity = activities?.find((a) => a.id === studentEnrollment?.activity_id);

          atRiskStudents.push({
            id: student.id,
            name: student.name,
            email: student.email,
            attendanceRate: rate,
            missedSessions: student.totalSessions - student.sessionsAttended,
            lastActivity: student.lastActivity,
            activityTitle: activity?.title || 'Activitate necunoscută',
            trend: 'stable', // Could calculate based on recent vs older attendance
          });
        }
      });
    }

    // Convert students map to array with attendance rate
    const students = Array.from(studentsMap.values()).map((s) => ({
      ...s,
      attendanceRate:
        s.totalSessions > 0 ? Math.round((s.sessionsAttended / s.totalSessions) * 100) : 100,
    }));

    return NextResponse.json({
      summary: {
        totalStudents,
        totalHoursValidated,
        averageAttendance,
        completionRate,
        totalActivities,
        totalSessions,
      },
      attendanceTrends,
      students,
      atRiskStudents,
    });
  } catch (error) {
    console.error('Error in GET /api/professor/analytics:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
