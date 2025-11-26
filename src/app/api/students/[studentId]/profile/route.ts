import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params;
    const supabase = await createClient();

    // Get authenticated user (must be professor or admin)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Nu ești autentificat' }, { status: 401 });
    }

    // Get user role
    const { data: currentUser } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (
      !currentUser ||
      (currentUser.role.toLowerCase() !== 'professor' && currentUser.role.toLowerCase() !== 'admin')
    ) {
      return NextResponse.json(
        { message: 'Nu ai permisiunea să vezi profilul studentului' },
        { status: 403 }
      );
    }

    // Get student profile data
    const { data: studentProfile, error: profileError } = await supabase
      .from('profiles')
      .select(
        `
        id,
        email,
        first_name,
        last_name,
        phone,
        profile_picture_url,
        faculty,
        specialization,
        year,
        program_type,
        gpa,
        created_at
      `
      )
      .eq('id', studentId)
      .ilike('role', 'student')
      .single();

    if (profileError || !studentProfile) {
      return NextResponse.json({ message: 'Student negăsit' }, { status: 404 });
    }

    // Get previous activities completed (CONFIRMED enrollments with PRESENT attendance)
    const { data: completedActivities, error: activitiesError } = await supabase
      .from('enrollments')
      .select(
        `
        id,
        enrolled_at,
        attendance_status,
        activities!enrollments_activity_id_fkey (
          id,
          title,
          date,
          category_id,
          categories (
            name,
            color
          )
        )
      `
      )
      .eq('user_id', studentId)
      .eq('status', 'CONFIRMED')
      .in('attendance_status', ['PRESENT', 'COMPLETED'])
      .order('enrolled_at', { ascending: false })
      .limit(10);

    if (activitiesError) {
      console.error('Error fetching completed activities:', activitiesError);
    }

    // Get total volunteer hours (sum of approved hours requests)
    const { data: hoursData, error: hoursError } = await supabase
      .from('hours_requests')
      .select('hours')
      .eq('user_id', studentId)
      .eq('status', 'APPROVED');

    const totalHours = hoursData?.reduce((sum, record) => sum + Number(record.hours), 0) || 0;

    if (hoursError) {
      console.error('Error fetching total hours:', hoursError);
    }

    // Calculate attendance rate
    // Total enrolled (CONFIRMED status)
    const { count: totalEnrolled } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', studentId)
      .eq('status', 'CONFIRMED');

    // Total attended (PRESENT or COMPLETED attendance_status)
    const { count: totalAttended } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', studentId)
      .eq('status', 'CONFIRMED')
      .in('attendance_status', ['PRESENT', 'COMPLETED']);

    const attendanceRate =
      totalEnrolled && totalEnrolled > 0 ? ((totalAttended || 0) / totalEnrolled) * 100 : 0;

    // Return comprehensive student profile
    return NextResponse.json({
      profile: {
        id: studentProfile.id,
        email: studentProfile.email,
        firstName: studentProfile.first_name,
        lastName: studentProfile.last_name,
        phone: studentProfile.phone,
        profilePictureUrl: studentProfile.profile_picture_url,
        faculty: studentProfile.faculty,
        specialization: studentProfile.specialization,
        year: studentProfile.year,
        programType: studentProfile.program_type,
        gpa: studentProfile.gpa,
        memberSince: studentProfile.created_at,
      },
      completedActivities:
        completedActivities?.map((enrollment) => ({
          id: enrollment.activities?.id,
          title: enrollment.activities?.title,
          date: enrollment.activities?.date,
          categoryName: enrollment.activities?.categories?.name,
          categoryColor: enrollment.activities?.categories?.color,
          enrolledAt: enrollment.enrolled_at,
          attendanceStatus: enrollment.attendance_status,
        })) || [],
      stats: {
        totalVolunteerHours: totalHours,
        attendanceRate: Math.round(attendanceRate * 10) / 10, // Round to 1 decimal
        totalActivitiesEnrolled: totalEnrolled || 0,
        totalActivitiesAttended: totalAttended || 0,
      },
    });
  } catch (error) {
    console.error('Get student profile error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}
