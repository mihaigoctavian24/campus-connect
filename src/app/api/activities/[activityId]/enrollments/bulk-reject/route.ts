import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
      return NextResponse.json(
        { message: 'Lista de aplicații este invalidă' },
        { status: 400 }
      );
    }

    if (!rejection_reason) {
      return NextResponse.json(
        { message: 'Motivul respingerii este obligatoriu' },
        { status: 400 }
      );
    }

    // Update all enrollments to REJECTED or WAITLISTED
    const newStatus = add_to_waitlist ? 'WAITLISTED' : 'REJECTED';

    const { error: updateError } = await supabase
      .from('activity_enrollments')
      .update({
        status: newStatus,
        rejection_reason,
        custom_message: custom_message || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .in('id', enrollment_ids)
      .eq('activity_id', activityId);

    if (updateError) {
      console.error('Error bulk rejecting applications:', updateError);
      return NextResponse.json(
        { message: 'Eroare la respingerea aplicațiilor' },
        { status: 500 }
      );
    }

    // TODO: Send bulk email notifications to students (#185)
    // await sendBulkEmails({
    //   enrollment_ids,
    //   template: add_to_waitlist ? 'application_waitlisted' : 'application_rejected',
    //   data: { rejection_reason, custom_message, activity_title: activity.title }
    // });

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
