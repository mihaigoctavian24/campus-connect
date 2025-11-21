import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    // Update enrollment status to APPROVED
    const { error: updateError } = await supabase
      .from('activity_enrollments')
      .update({
        status: 'APPROVED',
        custom_message: custom_message || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq('id', enrollmentId)
      .eq('activity_id', activityId);

    if (updateError) {
      console.error('Error accepting application:', updateError);
      return NextResponse.json(
        { message: 'Eroare la acceptarea aplicației' },
        { status: 500 }
      );
    }

    // Increment current_participants counter
    const { error: counterError } = await supabase
      .from('activities')
      .update({
        current_participants: activity.current_participants + 1,
      })
      .eq('id', activityId);

    if (counterError) {
      console.error('Error updating participant count:', counterError);
    }

    // TODO: Send email notification to student (#185)
    // await sendEmail({
    //   to: student.email,
    //   subject: `Aplicația ta pentru ${activity.title} a fost acceptată`,
    //   template: 'application_accepted',
    //   data: { custom_message, activity_title: activity.title }
    // });

    return NextResponse.json({
      message: 'Aplicație acceptată cu succes',
      enrollment_id: enrollmentId,
    });
  } catch (error) {
    console.error('Accept application error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}
