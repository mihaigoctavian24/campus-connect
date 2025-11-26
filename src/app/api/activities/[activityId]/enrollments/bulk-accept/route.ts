import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendApplicationAcceptedEmail } from '@/lib/email/service';

export async function POST(
  request: NextRequest,
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
      .select('created_by, title, max_participants, current_participants')
      .eq('id', activityId)
      .single<{
        created_by: string;
        title: string;
        max_participants: number;
        current_participants: number;
      }>();

    if (activityError || !activity) {
      return NextResponse.json({ message: 'Activitate negăsită' }, { status: 404 });
    }

    if (activity.created_by !== user.id) {
      return NextResponse.json(
        { message: 'Nu ai permisiunea să accepți aplicații pentru această activitate' },
        { status: 403 }
      );
    }

    // Get request body
    const body = await request.json();
    const { enrollment_ids, custom_message } = body;

    if (!enrollment_ids || !Array.isArray(enrollment_ids) || enrollment_ids.length === 0) {
      return NextResponse.json({ message: 'Lista de aplicații este invalidă' }, { status: 400 });
    }

    // Check if accepting these would exceed max participants
    const available_spots = activity.max_participants - activity.current_participants;
    if (enrollment_ids.length > available_spots) {
      return NextResponse.json(
        {
          message: `Poți accepta maximum ${available_spots} aplicații (locuri disponibile: ${available_spots})`,
        },
        { status: 400 }
      );
    }

    // Update all enrollments to CONFIRMED
    const updateResult = await supabase
      .from('enrollments')
      .update({
        status: 'CONFIRMED',
        custom_message: custom_message || null,
        reviewed_at: new Date().toISOString(),
      })
      .in('id', enrollment_ids)
      .eq('activity_id', activityId);

    const updateError = updateResult.error;

    if (updateError) {
      console.error('Error bulk accepting applications:', updateError);
      return NextResponse.json({ message: 'Eroare la acceptarea aplicațiilor' }, { status: 500 });
    }

    // Update current_participants counter
    const counterResult = await supabase
      .from('activities')
      .update({
        current_participants: activity.current_participants + enrollment_ids.length,
      })
      .eq('id', activityId);

    const counterError = counterResult.error;

    if (counterError) {
      console.error('Error updating participant count:', counterError);
    }

    // Send email notifications to accepted students
    // Fetch enrollment details with student profiles
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(
        `
        id,
        user_id,
        profiles!enrollments_user_id_fkey (
          email,
          first_name,
          last_name
        )
      `
      )
      .in('id', enrollment_ids);

    // Get professor details for email
    const { data: professorProfile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', activity.created_by)
      .single();

    // Send individual acceptance emails
    if (enrollments && professorProfile) {
      const professorName = `${professorProfile.first_name} ${professorProfile.last_name}`;

      for (const enrollment of enrollments) {
        if (enrollment.profiles) {
          const studentProfile = enrollment.profiles as {
            email: string;
            first_name: string;
            last_name: string;
          };

          const emailResult = await sendApplicationAcceptedEmail({
            studentEmail: studentProfile.email,
            studentName: `${studentProfile.first_name} ${studentProfile.last_name}`,
            activityTitle: activity.title,
            professorName,
            customMessage: custom_message || undefined,
            activityId,
          });

          if (!emailResult.success) {
            console.error(
              `[Bulk Accept] Failed to send email to ${studentProfile.email}:`,
              emailResult.error
            );
          }
        }
      }
    }

    return NextResponse.json({
      message: `${enrollment_ids.length} aplicații acceptate cu succes`,
      accepted_count: enrollment_ids.length,
    });
  } catch (error) {
    console.error('Bulk accept error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}
