import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendApplicationAcceptedEmail } from '@/lib/email/service';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ activityId: string; enrollmentId: string }> }
) {
  try {
    const { activityId, enrollmentId } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Nu ești autentificat' }, { status: 401 });
    }

    // Verify user is the professor who created this activity and get activity details
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

    // Check if activity is already full
    if (activity.current_participants >= activity.max_participants) {
      return NextResponse.json(
        { message: 'Activitatea este deja completă (max participanți atins)' },
        { status: 400 }
      );
    }

    // Get request body for custom message
    const body = await request.json();
    const { custom_message } = body;

    // Update enrollment status to CONFIRMED
    const updateResult = await supabase
      .from('enrollments')
      .update({
        status: 'CONFIRMED',
        custom_message: custom_message || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', enrollmentId)
      .eq('activity_id', activityId);

    const updateError = updateResult.error;

    if (updateError) {
      console.error('Error accepting application:', updateError);
      return NextResponse.json({ message: 'Eroare la acceptarea aplicației' }, { status: 500 });
    }

    // Increment current_participants counter
    const counterResult = await supabase
      .from('activities')
      .update({
        current_participants: activity.current_participants + 1,
      })
      .eq('id', activityId);

    const counterError = counterResult.error;

    if (counterError) {
      console.error('Error updating participant count:', counterError);
    }

    // Get student and professor details for email
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select(
        `
        user_id,
        profiles!enrollments_user_id_fkey (
          email,
          first_name,
          last_name
        )
      `
      )
      .eq('id', enrollmentId)
      .single();

    const { data: professor } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single();

    // Send email notification to student
    if (enrollment?.profiles && professor) {
      const studentProfile = enrollment.profiles as {
        email: string;
        first_name: string;
        last_name: string;
      };

      const emailResult = await sendApplicationAcceptedEmail({
        studentEmail: studentProfile.email,
        studentName: `${studentProfile.first_name} ${studentProfile.last_name}`,
        activityTitle: activity.title,
        professorName: `${professor.first_name} ${professor.last_name}`,
        customMessage: custom_message,
        activityId,
      });

      if (!emailResult.success) {
        console.error('Failed to send acceptance email:', emailResult.error);
        // Don't fail the request - email is not critical
      }
    }

    return NextResponse.json({
      message: 'Aplicație acceptată cu succes',
      enrollment_id: enrollmentId,
    });
  } catch (error) {
    console.error('Accept application error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}
