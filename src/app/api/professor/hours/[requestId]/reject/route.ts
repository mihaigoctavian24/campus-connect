import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendHoursRejectedEmail } from '@/lib/email/service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const supabase = await createClient();
    const { requestId } = await params;

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 });
    }

    // Get body
    const body = await request.json();
    const { reason } = body;

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json({ error: 'Motivul respingerii este obligatoriu' }, { status: 400 });
    }

    // Verify hours request exists and professor owns the activity
    const { data: hoursRequest, error: fetchError } = await supabase
      .from('hours_requests')
      .select(
        `
        id,
        status,
        hours,
        date,
        enrollments (
          id,
          user_id,
          activities (
            id,
            created_by,
            title
          )
        )
      `
      )
      .eq('id', requestId)
      .single();

    if (fetchError || !hoursRequest) {
      return NextResponse.json({ error: 'Cerere negăsită' }, { status: 404 });
    }

    // Check if professor owns the activity
    if (hoursRequest.enrollments?.activities?.created_by !== user.id) {
      return NextResponse.json(
        { error: 'Nu ai permisiunea să validezi această cerere' },
        { status: 403 }
      );
    }

    // Check if already processed
    if (hoursRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Cererea este deja ${hoursRequest.status?.toLowerCase() || 'procesată'}` },
        { status: 400 }
      );
    }

    // Get professor profile
    const { data: professorProfile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single();

    // Update hours request
    const { error: updateError } = await supabase
      .from('hours_requests')
      .update({
        status: 'REJECTED',
        approved_at: new Date().toISOString(),
        approved_by: user.id,
        professor_notes: reason,
      })
      .eq('id', requestId);

    if (updateError) {
      throw updateError;
    }

    // Get student email for notification
    const { data: studentProfile } = await supabase
      .from('profiles')
      .select('email, first_name')
      .eq('id', hoursRequest.enrollments?.user_id)
      .single();

    // Send email notification to student
    if (studentProfile && professorProfile) {
      await sendHoursRejectedEmail({
        studentEmail: studentProfile.email,
        studentName: studentProfile.first_name,
        activityTitle: hoursRequest.enrollments.activities.title,
        professorName: `${professorProfile.first_name} ${professorProfile.last_name}`,
        hours: hoursRequest.hours,
        date: hoursRequest.date,
        reason: reason,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Cerere respinsă',
    });
  } catch (error) {
    console.error('Reject hours error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Eroare la respingere' },
      { status: 500 }
    );
  }
}
