import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SessionCalendar } from '@/components/sessions/SessionCalendar';
import { AttendanceHistory } from '@/components/attendance/AttendanceHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function MyActivitiesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'STUDENT') {
    redirect('/dashboard/professor');
  }

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id, activity_id, status, activities!inner(id, title)')
    .eq('user_id', user.id)
    .eq('status', 'CONFIRMED')
    .is('deleted_at', null);

  const activityIds = enrollments?.map((e) => e.activity_id as string) || [];
  
  const { data: sessions } = await supabase
    .schema('public')
    .from('sessions')
    .select('*, activities!inner(id, title)')
    .in('activity_id', activityIds)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });

  const transformedSessions = sessions?.map((session) => ({
    id: session.id,
    activity_id: session.activity_id,
    activity_title: (session.activities as unknown as { title: string }).title,
    date: session.date,
    start_time: session.start_time,
    end_time: session.end_time,
    location: session.location,
    max_participants: session.max_participants,
    status: session.status,
    reminder_sent: session.reminder_sent,
    created_at: session.created_at,
    updated_at: session.updated_at,
    deleted_at: session.deleted_at,
  })) || [];

  // Fetch attendance records with session and activity details
  const { data: attendanceRecords } = await supabase
    .from('attendance')
    .select(`
      id,
      status,
      check_in_method,
      checked_in_at,
      hours_credited,
      session:sessions (
        date,
        start_time,
        end_time,
        location,
        activity:activities (
          title,
          category:categories (
            name
          )
        )
      )
    `)
    .eq('user_id', user.id)
    .order('checked_in_at', { ascending: false });

  const transformedAttendance = attendanceRecords?.map((record) => ({
    id: record.id,
    status: record.status,
    check_in_method: record.check_in_method,
    checked_in_at: record.checked_in_at,
    hours_credited: Number(record.hours_credited),
    session: {
      date: (record.session as any).date,
      start_time: (record.session as any).start_time,
      end_time: (record.session as any).end_time,
      location: (record.session as any).location,
      activity_title: (record.session as any).activity.title,
      activity_category: (record.session as any).activity.category?.name || 'General',
    },
  })) || [];

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#001f3f]">My Activities</h1>
        <p className="text-muted-foreground mt-2">
          View and check-in to your upcoming sessions
        </p>
      </div>

      {enrollments && enrollments.length > 0 ? (
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="history">Attendance History</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <SessionCalendar
              sessions={transformedSessions}
              viewMode="student"
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <AttendanceHistory attendanceRecords={transformedAttendance} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-muted-foreground mb-4">
            You are not enrolled in any activities yet
          </p>
          <a
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#001f3f] text-white rounded-md hover:bg-[#003366] transition-colors"
          >
            Explore Opportunities
          </a>
        </div>
      )}
    </div>
  );
}
