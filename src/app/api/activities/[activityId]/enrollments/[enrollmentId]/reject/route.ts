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
      .select('created_by, title')
      .eq('id', activityId)
      .single<{ created_by: string; title: string }>();

    if (activityError || !activity) {
      return NextResponse.json({ message: 'Activitate negăsită' }, { status: 404 });
    }

    if (activity.created_by !== user.id) {
      return NextResponse.json(
        { message: 'Nu ai permisiunea să respingi aplicații pentru această activitate' },
        { status: 403 }
      );
    }

    // Get request body for rejection reason and custom message
    const body = await request.json();
    const { rejection_reason, custom_message, add_to_waitlist } = body;

    if (!rejection_reason) {
      return NextResponse.json(
        { message: 'Motivul respingerii este obligatoriu' },
        { status: 400 }
      );
    }

    // Update enrollment status to CANCELLED or WAITLISTED
    const newStatus = add_to_waitlist ? 'WAITLISTED' : 'CANCELLED';

    const updateResult = await supabase
      .from('enrollments')
      .update({
        status: newStatus,
        rejection_reason,
        custom_message: custom_message || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', enrollmentId)
      .eq('activity_id', activityId);

    const updateError = updateResult.error;

    if (updateError) {
      console.error('Error rejecting application:', updateError);
      return NextResponse.json({ message: 'Eroare la respingerea aplicației' }, { status: 500 });
    }

    // TODO: Send email notification to student (#185)
    // await sendEmail({
    //   to: student.email,
    //   subject: `Aplicația ta pentru ${activity.title}`,
    //   template: add_to_waitlist ? 'application_waitlisted' : 'application_rejected',
    //   data: { rejection_reason, custom_message, activity_title: activity.title }
    // });

    return NextResponse.json({
      message: add_to_waitlist
        ? 'Aplicație adăugată în lista de așteptare'
        : 'Aplicație respinsă cu succes',
      enrollment_id: enrollmentId,
      status: newStatus,
    });
  } catch (error) {
    console.error('Reject application error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}
