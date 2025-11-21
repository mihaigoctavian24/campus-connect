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
      return NextResponse.json(
        { message: 'Lista de aplicații este invalidă' },
        { status: 400 }
      );
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

    // Update all enrollments to APPROVED
    const { error: updateError } = await supabase
      .from('activity_enrollments')
      .update({
        status: 'APPROVED',
        custom_message: custom_message || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .in('id', enrollment_ids)
      .eq('activity_id', activityId);

    if (updateError) {
      console.error('Error bulk accepting applications:', updateError);
      return NextResponse.json(
        { message: 'Eroare la acceptarea aplicațiilor' },
        { status: 500 }
      );
    }

    // Update current_participants counter
    const { error: counterError } = await supabase
      .from('activities')
      .update({
        current_participants: activity.current_participants + enrollment_ids.length,
      })
      .eq('id', activityId);

    if (counterError) {
      console.error('Error updating participant count:', counterError);
    }

    // TODO: Send bulk email notifications to students (#185)
    // await sendBulkEmails({
    //   enrollment_ids,
    //   template: 'application_accepted',
    //   data: { custom_message, activity_title: activity.title }
    // });

    return NextResponse.json({
      message: `${enrollment_ids.length} aplicații acceptate cu succes`,
      accepted_count: enrollment_ids.length,
    });
  } catch (error) {
    console.error('Bulk accept error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}
