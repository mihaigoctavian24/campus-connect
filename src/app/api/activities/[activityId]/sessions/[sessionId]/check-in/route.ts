import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface CheckInRequest {
  qr_code?: string;
  gps_latitude?: number;
  gps_longitude?: number;
  gps_accuracy?: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ activityId: string; sessionId: string }> }
) {
  try {
    const { activityId, sessionId } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: CheckInRequest = await request.json();

    // Verify session exists and belongs to activity
    const { data: session, error: sessionError } = await supabase
      .schema('public')
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('activity_id', activityId)
      .single<{
        id: string;
        activity_id: string;
        date: string;
        start_time: string;
        end_time: string;
        qr_code_data: string | null;
        status: string | null;
      }>();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Verify QR code if provided
    if (body.qr_code && session.qr_code_data !== body.qr_code) {
      return NextResponse.json({ error: 'Invalid QR code' }, { status: 400 });
    }

    // Check if session is happening now (±15 minutes window)
    const now = new Date();
    const sessionDate = new Date(session.date);
    const [startHour, startMin] = session.start_time.split(':').map(Number);
    const [endHour, endMin] = session.end_time.split(':').map(Number);

    const sessionStart = new Date(sessionDate);
    sessionStart.setHours(startHour, startMin, 0, 0);

    const sessionEnd = new Date(sessionDate);
    sessionEnd.setHours(endHour, endMin, 0, 0);

    const checkInWindowStart = new Date(sessionStart.getTime() - 15 * 60 * 1000); // 15 min before
    const checkInWindowEnd = new Date(sessionEnd.getTime() + 15 * 60 * 1000); // 15 min after

    if (now < checkInWindowStart || now > checkInWindowEnd) {
      return NextResponse.json(
        {
          error: 'Check-in window not active',
          message:
            'You can only check in 15 minutes before the session starts until 15 minutes after it ends',
        },
        { status: 400 }
      );
    }

    // Get user's enrollment for this activity
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id, status')
      .eq('activity_id', activityId)
      .eq('user_id', user.id)
      .single<{ id: string; status: string }>();

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'You are not enrolled in this activity' },
        { status: 403 }
      );
    }

    if (enrollment.status !== 'CONFIRMED') {
      return NextResponse.json(
        { error: 'Your enrollment is not approved yet' },
        { status: 403 }
      );
    }

    // Check for duplicate check-in
    const { data: existingAttendance } = await supabase
      .schema('public')
      .from('attendance')
      .select('id')
      .eq('session_id', sessionId)
      .eq('enrollment_id', enrollment.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'You have already checked in for this session' },
        { status: 400 }
      );
    }

    // Calculate hours to credit (session duration in hours)
    const durationMs = sessionEnd.getTime() - sessionStart.getTime();
    const hoursToCredit = durationMs / (1000 * 60 * 60); // Convert ms to hours

    // Create attendance record
    const attendanceData = {
      session_id: sessionId,
      enrollment_id: enrollment.id,
      user_id: user.id,
      status: 'PRESENT',
      check_in_method: body.qr_code ? 'QR_CODE' : 'MANUAL',
      checked_in_at: new Date().toISOString(),
      hours_credited: hoursToCredit,
      gps_latitude: body.gps_latitude || null,
      gps_longitude: body.gps_longitude || null,
      gps_accuracy: body.gps_accuracy || null,
    };

    const { data: attendance, error: attendanceError } = await supabase
      .schema('public')
      .from('attendance')
      .insert(attendanceData)
      .select()
      .single();

    if (attendanceError) {
      console.error('Error creating attendance record:', attendanceError);
      return NextResponse.json({ error: 'Failed to check in' }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: 'Checked in successfully',
        attendance,
        hours_credited: hoursToCredit,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
