import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ activityId: string }> }
) {
  try {
    const { activityId } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Nu ești autentificat' }, { status: 401 });
    }

    // Verify user is the professor who created this activity
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('created_by')
      .eq('id', activityId)
      .single<{ created_by: string }>();

    if (activityError || !activity) {
      return NextResponse.json({ message: 'Activitate negăsită' }, { status: 404 });
    }

    if (activity.created_by !== user.id) {
      return NextResponse.json(
        { message: 'Nu ai permisiunea să vezi aplicațiile pentru această activitate' },
        { status: 403 }
      );
    }

    // Fetch all enrollments (applications) for this activity with student details
    const { data: applications, error: applicationsError } = await supabase
      .from('activity_enrollments')
      .select(
        `
        id,
        user_id,
        status,
        motivation,
        availability,
        experience,
        created_at,
        reviewed_at,
        rejection_reason,
        custom_message,
        profiles (
          id,
          first_name,
          last_name,
          email,
          profile_picture_url,
          faculty,
          specialization,
          year,
          program_type
        )
      `
      )
      .eq('activity_id', activityId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError);
      return NextResponse.json(
        { message: 'Eroare la încărcarea aplicațiilor' },
        { status: 500 }
      );
    }

    // For each student, get their volunteer history
    const enrichedApplications = await Promise.all(
      applications.map(async (app: any) => {
        // Get total completed hours for this student
        const { count: completedActivities } = await supabase
          .from('activity_enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', app.user_id)
          .eq('status', 'APPROVED')
          .is('deleted_at', null);

        // Get certificates count
        const { count: certificatesCount } = await supabase
          .from('certificates')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', app.user_id);

        return {
          id: app.id,
          user_id: app.user_id,
          status: app.status,
          motivation: app.motivation,
          availability: app.availability,
          experience: app.experience,
          applied_at: app.created_at,
          reviewed_at: app.reviewed_at,
          rejection_reason: app.rejection_reason,
          custom_message: app.custom_message,
          student: {
            id: app.profiles.id,
            first_name: app.profiles.first_name,
            last_name: app.profiles.last_name,
            email: app.profiles.email,
            profile_picture_url: app.profiles.profile_picture_url,
            faculty: app.profiles.faculty,
            specialization: app.profiles.specialization,
            year: app.profiles.year,
            program_type: app.profiles.program_type,
            completed_activities: completedActivities || 0,
            certificates_earned: certificatesCount || 0,
          },
        };
      })
    );

    return NextResponse.json(enrichedApplications);
  } catch (error) {
    console.error('Applications fetch error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}
