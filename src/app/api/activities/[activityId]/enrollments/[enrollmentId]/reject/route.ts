import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendApplicationRejectedEmail } from '@/lib/email/service';

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

      const emailResult = await sendApplicationRejectedEmail({
        studentEmail: studentProfile.email,
        studentName: `${studentProfile.first_name} ${studentProfile.last_name}`,
        activityTitle: activity.title,
        professorName: `${professor.first_name} ${professor.last_name}`,
        rejectionReason: rejection_reason,
        customMessage: custom_message,
        isWaitlisted: add_to_waitlist,
      });

      if (!emailResult.success) {
        console.error('Failed to send rejection email:', emailResult.error);
        // Don't fail the request - email is not critical
      }
    }

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
