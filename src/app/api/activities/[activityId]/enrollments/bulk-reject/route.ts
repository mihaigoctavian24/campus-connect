import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendApplicationRejectedEmail } from '@/lib/email/service';

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

    // Get request body
    const body = await request.json();
    const { enrollment_ids, rejection_reason, custom_message, add_to_waitlist } = body;

    if (!enrollment_ids || !Array.isArray(enrollment_ids) || enrollment_ids.length === 0) {
      return NextResponse.json({ message: 'Lista de aplicații este invalidă' }, { status: 400 });
    }

    if (!rejection_reason) {
      return NextResponse.json(
        { message: 'Motivul respingerii este obligatoriu' },
        { status: 400 }
      );
    }

    // Update all enrollments to CANCELLED or WAITLISTED
    const newStatus = add_to_waitlist ? 'WAITLISTED' : 'CANCELLED';

    const updateResult = await supabase
      .from('enrollments')
      .update({
        status: newStatus,
        rejection_reason,
        custom_message: custom_message || null,
        reviewed_at: new Date().toISOString(),
      })
      .in('id', enrollment_ids)
      .eq('activity_id', activityId);

    const updateError = updateResult.error;

    if (updateError) {
      console.error('Error bulk rejecting applications:', updateError);
      return NextResponse.json({ message: 'Eroare la respingerea aplicațiilor' }, { status: 500 });
    }

    // Send email notifications to rejected/waitlisted students
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

    // Send individual rejection/waitlist emails
    if (enrollments && professorProfile) {
      const professorName = `${professorProfile.first_name} ${professorProfile.last_name}`;

      for (const enrollment of enrollments) {
        if (enrollment.profiles) {
          const studentProfile = enrollment.profiles as {
            email: string;
            first_name: string;
            last_name: string;
          };

          const emailResult = await sendApplicationRejectedEmail({
            studentEmail: studentProfile.email,
            studentName: `${studentProfile.first_name} ${studentProfile.last_name}`,
            activityTitle: activity.title,
            professorName,
            rejectionReason: rejection_reason,
            customMessage: custom_message || undefined,
            isWaitlisted: add_to_waitlist || false,
          });

          if (!emailResult.success) {
            console.error(
              `[Bulk Reject] Failed to send email to ${studentProfile.email}:`,
              emailResult.error
            );
          }
        }
      }
    }

    return NextResponse.json({
      message: add_to_waitlist
        ? `${enrollment_ids.length} aplicații adăugate în lista de așteptare`
        : `${enrollment_ids.length} aplicații respinse cu succes`,
      rejected_count: enrollment_ids.length,
      status: newStatus,
    });
  } catch (error) {
    console.error('Bulk reject error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}
