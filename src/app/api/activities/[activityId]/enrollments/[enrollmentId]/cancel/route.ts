import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendApplicationAcceptedEmail } from '@/lib/email/service';

/**
 * Cancel/Unenroll from activity
 * Decrements participant count and auto-promotes from waiting list if available
 */
export async function PUT(
  _request: NextRequest,
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

    // Get enrollment details to verify ownership
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('user_id, status, activity_id')
      .eq('id', enrollmentId)
      .eq('activity_id', activityId)
      .single();

    if (enrollmentError || !enrollment) {
      return NextResponse.json({ message: 'Înscriere negăsită' }, { status: 404 });
    }

    // Verify user owns this enrollment
    if (enrollment.user_id !== user.id) {
      return NextResponse.json(
        { message: 'Nu ai permisiunea să anulezi această înscriere' },
        { status: 403 }
      );
    }

    // Can only cancel CONFIRMED enrollments
    if (enrollment.status !== 'CONFIRMED') {
      return NextResponse.json(
        { message: 'Poți anula doar înscrieri confirmate' },
        { status: 400 }
      );
    }

    // Get activity details
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('title, current_participants, max_participants')
      .eq('id', activityId)
      .single<{
        title: string;
        current_participants: number;
        max_participants: number;
      }>();

    if (activityError || !activity) {
      return NextResponse.json({ message: 'Activitate negăsită' }, { status: 404 });
    }

    // Cancel the enrollment
    const { error: cancelError } = await supabase
      .from('enrollments')
      .update({
        status: 'CANCELLED',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', enrollmentId);

    if (cancelError) {
      console.error('Error cancelling enrollment:', cancelError);
      return NextResponse.json({ message: 'Eroare la anularea înscrierii' }, { status: 500 });
    }

    // Decrement current_participants
    const newParticipantCount = Math.max(0, activity.current_participants - 1);

    const { error: counterError } = await supabase
      .from('activities')
      .update({
        current_participants: newParticipantCount,
      })
      .eq('id', activityId);

    if (counterError) {
      console.error('Error updating participant count:', counterError);
    }

    // AUTO-PROMOTE: Check if there's space and students in waiting list
    const hasAvailableSlot = newParticipantCount < activity.max_participants;

    if (hasAvailableSlot) {
      // Get first student from waiting list (ordered by enrolled_at)
      const { data: waitingList, error: waitlistError } = await supabase
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
        .eq('activity_id', activityId)
        .eq('status', 'WAITLISTED')
        .order('enrolled_at', { ascending: true })
        .limit(1);

      if (!waitlistError && waitingList && waitingList.length > 0) {
        const firstInLine = waitingList[0];

        // Promote to CONFIRMED
        const { error: promoteError } = await supabase
          .from('enrollments')
          .update({
            status: 'CONFIRMED',
            reviewed_at: new Date().toISOString(),
          })
          .eq('id', firstInLine.id);

        if (promoteError) {
          console.error('Error auto-promoting from waiting list:', promoteError);
        } else {
          // Increment counter again
          await supabase
            .from('activities')
            .update({
              current_participants: newParticipantCount + 1,
            })
            .eq('id', activityId);

          // Get professor details for email
          const { data: activityDetails } = await supabase
            .from('activities')
            .select(
              `
              created_by,
              profiles!activities_created_by_fkey (
                first_name,
                last_name
              )
            `
            )
            .eq('id', activityId)
            .single();

          // Send promotion email
          if (firstInLine.profiles && activityDetails?.profiles) {
            const studentProfile = firstInLine.profiles as {
              email: string;
              first_name: string;
              last_name: string;
            };

            const professorProfile = activityDetails.profiles as {
              first_name: string;
              last_name: string;
            };

            const emailResult = await sendApplicationAcceptedEmail({
              studentEmail: studentProfile.email,
              studentName: `${studentProfile.first_name} ${studentProfile.last_name}`,
              activityTitle: activity.title,
              professorName: `${professorProfile.first_name} ${professorProfile.last_name}`,
              customMessage:
                'Felicitări! Un loc s-a eliberat și ai fost promovat automat din lista de așteptare. Te așteptăm!',
              activityId,
            });

            if (!emailResult.success) {
              console.error('Failed to send auto-promotion email:', emailResult.error);
            }
          }

          console.log(
            `[Auto-Promote] Student ${firstInLine.user_id} promoted from waiting list for activity ${activityId}`
          );
        }
      }
    }

    return NextResponse.json({
      message: 'Înscriere anulată cu succes',
      enrollment_id: enrollmentId,
    });
  } catch (error) {
    console.error('Cancel enrollment error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}
