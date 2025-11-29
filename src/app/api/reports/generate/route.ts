import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

type ReportType =
  | 'student_hours'
  | 'activity_summary'
  | 'attendance_report'
  | 'enrollment_stats'
  | 'professor_performance';

export async function GET(request: NextRequest) {
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

    // Check if user is admin or professor
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = (profile?.role || '').toLowerCase();
    if (profileError || !['admin', 'professor'].includes(userRole)) {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const reportType = searchParams.get('type') as ReportType;
    const format = searchParams.get('format') || 'csv';
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    if (!reportType) {
      return NextResponse.json({ error: 'Tip raport necesar' }, { status: 400 });
    }

    let reportData: unknown[] = [];
    let headers: string[] = [];

    switch (reportType) {
      case 'student_hours':
        const { data: hoursData } = await supabase
          .from('hours_requests')
          .select(
            `
            id,
            hours,
            status,
            created_at,
            user:profiles!hours_requests_user_id_fkey (
              first_name,
              last_name,
              email,
              faculty,
              year
            ),
            activity:activities (
              title
            )
          `
          )
          .gte('created_at', startDate || '2020-01-01')
          .lte('created_at', endDate || new Date().toISOString())
          .order('created_at', { ascending: false });

        headers = ['Student', 'Email', 'Facultate', 'An', 'Activitate', 'Ore', 'Status', 'Data'];
        reportData = (hoursData || []).map((hr) => ({
          student:
            `${(hr.user as { first_name: string; last_name: string } | null)?.first_name || ''} ${(hr.user as { first_name: string; last_name: string } | null)?.last_name || ''}`.trim(),
          email: (hr.user as { email: string } | null)?.email || '',
          faculty: (hr.user as { faculty: string } | null)?.faculty || '',
          study_year: (hr.user as { year: number } | null)?.year || '',
          activity: (hr.activity as { title: string } | null)?.title || '',
          hours: hr.hours,
          status: hr.status,
          date: hr.created_at ? new Date(hr.created_at).toLocaleDateString('ro-RO') : '',
        }));
        break;

      case 'activity_summary':
        const { data: activities } = await supabase
          .from('activities')
          .select(
            `
            id,
            title,
            status,
            max_participants,
            date,
            created_at,
            creator:profiles!activities_created_by_fkey (
              first_name,
              last_name
            )
          `
          )
          .is('deleted_at', null)
          .gte('created_at', startDate || '2020-01-01')
          .lte('created_at', endDate || new Date().toISOString());

        // Get enrollment counts
        const activityIds = activities?.map((a) => a.id) || [];
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('activity_id, status')
          .in('activity_id', activityIds)
          .is('deleted_at', null);

        const enrollmentCounts: Record<string, { total: number; confirmed: number }> = {};
        enrollments?.forEach((e) => {
          if (!enrollmentCounts[e.activity_id]) {
            enrollmentCounts[e.activity_id] = { total: 0, confirmed: 0 };
          }
          enrollmentCounts[e.activity_id].total++;
          if (e.status === 'CONFIRMED') {
            enrollmentCounts[e.activity_id].confirmed++;
          }
        });

        headers = [
          'Activitate',
          'Status',
          'Profesor',
          'Înscrieri',
          'Confirmate',
          'Locuri max',
          'Data',
        ];
        reportData = (activities || []).map((a) => ({
          title: a.title,
          status: a.status,
          professor:
            `${(a.creator as { first_name: string; last_name: string } | null)?.first_name || ''} ${(a.creator as { first_name: string; last_name: string } | null)?.last_name || ''}`.trim(),
          enrollments: enrollmentCounts[a.id]?.total || 0,
          confirmed: enrollmentCounts[a.id]?.confirmed || 0,
          max_participants: a.max_participants,
          date: a.date ? new Date(a.date).toLocaleDateString('ro-RO') : '',
        }));
        break;

      case 'attendance_report':
        const { data: sessions } = await supabase
          .from('sessions')
          .select(
            `
            id,
            date,
            start_time,
            end_time,
            location,
            activity:activities (
              title
            )
          `
          )
          .is('deleted_at', null)
          .gte('date', startDate?.split('T')[0] || '2020-01-01')
          .lte('date', endDate?.split('T')[0] || new Date().toISOString().split('T')[0]);

        const sessionIds = sessions?.map((s) => s.id) || [];
        const { data: attendance } = await supabase
          .from('attendance')
          .select('session_id, status')
          .in('session_id', sessionIds);

        const attendanceCounts: Record<string, { present: number; absent: number }> = {};
        attendance?.forEach((a) => {
          if (!attendanceCounts[a.session_id]) {
            attendanceCounts[a.session_id] = { present: 0, absent: 0 };
          }
          if (a.status === 'PRESENT') {
            attendanceCounts[a.session_id].present++;
          } else {
            attendanceCounts[a.session_id].absent++;
          }
        });

        headers = ['Activitate', 'Data', 'Ora', 'Locație', 'Prezenți', 'Absenți', 'Rată prezență'];
        reportData = (sessions || []).map((s) => {
          const present = attendanceCounts[s.id]?.present || 0;
          const absent = attendanceCounts[s.id]?.absent || 0;
          const total = present + absent;
          return {
            activity: (s.activity as { title: string } | null)?.title || '',
            date: new Date(s.date).toLocaleDateString('ro-RO'),
            time: `${s.start_time} - ${s.end_time}`,
            location: s.location || '',
            present,
            absent,
            rate: total > 0 ? `${Math.round((present / total) * 100)}%` : 'N/A',
          };
        });
        break;

      case 'enrollment_stats':
        const { data: enrollmentData } = await supabase
          .from('enrollments')
          .select(
            `
            id,
            status,
            created_at,
            activity:activities (
              title
            ),
            user:profiles!enrollments_user_id_fkey (
              first_name,
              last_name,
              email
            )
          `
          )
          .is('deleted_at', null)
          .gte('created_at', startDate || '2020-01-01')
          .lte('created_at', endDate || new Date().toISOString());

        headers = ['Student', 'Email', 'Activitate', 'Status', 'Data înscriere'];
        reportData = (enrollmentData || []).map((e) => ({
          student:
            `${(e.user as { first_name: string; last_name: string } | null)?.first_name || ''} ${(e.user as { first_name: string; last_name: string } | null)?.last_name || ''}`.trim(),
          email: (e.user as { email: string } | null)?.email || '',
          activity: (e.activity as { title: string } | null)?.title || '',
          status: e.status,
          date: new Date(e.created_at).toLocaleDateString('ro-RO'),
        }));
        break;

      case 'professor_performance':
        const { data: professors } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .eq('role', 'professor');

        const professorIds = professors?.map((p) => p.id) || [];

        const { data: profActivities } = await supabase
          .from('activities')
          .select('id, created_by')
          .in('created_by', professorIds)
          .is('deleted_at', null);

        const { data: profHours } = await supabase
          .from('hours_requests')
          .select('hours, status, activity:activities!inner(created_by)')
          .eq('status', 'APPROVED');

        const profStats: Record<
          string,
          { activities: number; hours: number; students: Set<string> }
        > = {};
        professorIds.forEach((id) => {
          profStats[id] = { activities: 0, hours: 0, students: new Set() };
        });

        profActivities?.forEach((a) => {
          if (profStats[a.created_by]) {
            profStats[a.created_by].activities++;
          }
        });

        profHours?.forEach((hr) => {
          const creatorId = (hr.activity as { created_by: string } | null)?.created_by;
          if (creatorId && profStats[creatorId]) {
            profStats[creatorId].hours += hr.hours || 0;
          }
        });

        headers = ['Profesor', 'Email', 'Activități create', 'Ore validate'];
        reportData = (professors || []).map((p) => ({
          professor: `${p.first_name || ''} ${p.last_name || ''}`.trim(),
          email: p.email || '',
          activities: profStats[p.id]?.activities || 0,
          hours: profStats[p.id]?.hours || 0,
        }));
        break;

      default:
        return NextResponse.json({ error: 'Tip raport invalid' }, { status: 400 });
    }

    // Generate CSV
    if (format === 'csv') {
      const csvContent = [
        headers.join(','),
        ...reportData.map((row) =>
          Object.values(row as Record<string, unknown>)
            .map((val) => `"${String(val).replace(/"/g, '""')}"`)
            .join(',')
        ),
      ].join('\n');

      // Add BOM for Excel UTF-8 compatibility
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8' });

      return new NextResponse(blob, {
        headers: {
          'Content-Type': 'text/csv;charset=utf-8',
          'Content-Disposition': `attachment; filename="raport-${reportType}-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Return JSON for other formats
    return NextResponse.json({
      type: reportType,
      headers,
      data: reportData,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in GET /api/reports/generate:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
