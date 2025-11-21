import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// QR code data validation schema
const qrDataSchema = z.object({
  session_id: z.string().uuid(),
  activity_id: z.string().uuid(),
  timestamp: z.string().datetime(),
  location_hash: z.string().optional(),
  signature: z.string().optional(),
});

// Request body schema
const checkInSchema = z.object({
  qr_data: qrDataSchema,
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ activityId: string; sessionId: string }> }
) {
  try {
    const supabase = await createClient();
    const { activityId, sessionId } = await params;

    // 1. Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Nu ești autentificat' }, { status: 401 });
    }

    // 2. Verify user is a student
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: string }>();

    if (profileError || !profile) {
      return NextResponse.json({ message: 'Profil negăsit' }, { status: 404 });
    }

    if (profile.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Doar studenții pot face check-in' }, { status: 403 });
    }

    // 3. Parse and validate request body
    const body = await request.json();
    const validatedData = checkInSchema.parse(body);
    const qrData = validatedData.qr_data;

    // 4. Validate QR code data matches URL parameters (#108)
    if (qrData.session_id !== sessionId) {
      return NextResponse.json(
        { message: 'ID-ul sesiunii din QR nu corespunde cu sesiunea curentă' },
        { status: 400 }
      );
    }

    if (qrData.activity_id !== activityId) {
      return NextResponse.json(
        { message: 'ID-ul activității din QR nu corespunde cu activitatea curentă' },
        { status: 400 }
      );
    }

    // 5. Verify session exists and belongs to activity
    const { data: session, error: sessionError } = await supabase
      .schema('public')
      .from('sessions')
      .select('id, activity_id, date, start_time, end_time, status')
      .eq('id', sessionId)
      .eq('activity_id', activityId)
      .single<{
        id: string;
        activity_id: string;
        date: string;
        start_time: string;
        end_time: string;
        status: string;
      }>();

    if (sessionError || !session) {
      return NextResponse.json({ message: 'Sesiunea nu a fost găsită' }, { status: 404 });
    }

    // 6. Check session status
    if (session.status === 'CANCELLED') {
      return NextResponse.json({ message: 'Această sesiune a fost anulată' }, { status: 400 });
    }

    if (session.status === 'COMPLETED') {
      return NextResponse.json({ message: 'Această sesiune s-a încheiat deja' }, { status: 400 });
    }

    // 7. Validate time window (±15 minutes from session start) (#109)
    const sessionDateTime = new Date(`${session.date}T${session.start_time}`);
    const now = new Date();
    const timeDiffMs = Math.abs(now.getTime() - sessionDateTime.getTime());
    const timeDiffMinutes = timeDiffMs / (1000 * 60);

    if (timeDiffMinutes > 15) {
      const isTooEarly = now < sessionDateTime;
      return NextResponse.json(
        {
          message: isTooEarly
            ? 'Ești prea devreme. Check-in este disponibil cu 15 minute înainte de începerea sesiunii.'
            : 'Ești prea târziu. Check-in este disponibil doar în primele 15 minute de la începerea sesiunii.',
        },
        { status: 400 }
      );
    }

    // 8. Verify user is enrolled in this activity
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id, status')
      .eq('activity_id', activityId)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single<{ id: string; status: string }>();

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { message: 'Nu ești înscris la această activitate' },
        { status: 403 }
      );
    }

    if (enrollment.status !== 'CONFIRMED') {
      return NextResponse.json(
        { message: 'Înscrierea ta nu a fost confirmată încă' },
        { status: 403 }
      );
    }

    // 9. Check for duplicate check-in
    const { data: existingAttendance } = await supabase
      .from('attendance')
      .select('id')
      .eq('session_id', sessionId)
      .eq('enrollment_id', enrollment.id)
      .maybeSingle<{ id: string }>();

    if (existingAttendance) {
      return NextResponse.json(
        { message: 'Ai făcut deja check-in pentru această sesiune' },
        { status: 400 }
      );
    }

    // 10. Calculate hours for this session
    const sessionStart = new Date(`${session.date}T${session.start_time}`);
    const sessionEnd = new Date(`${session.date}T${session.end_time}`);
    const durationMs = sessionEnd.getTime() - sessionStart.getTime();
    const hours = Number((durationMs / (1000 * 60 * 60)).toFixed(2));

    // 11. Create attendance record
    const { data: attendance, error: attendanceError } = await supabase
      .from('attendance')
      // @ts-expect-error - Database types haven't been regenerated after attendance migration
      .insert({
        session_id: sessionId,
        enrollment_id: enrollment.id,
        user_id: user.id,
        status: 'PRESENT',
        check_in_method: 'QR_CODE',
        hours_credited: hours,
        checked_in_at: now.toISOString(),
      })
      .select('id, checked_in_at, hours_credited')
      .single<{ id: string; checked_in_at: string; hours_credited: number }>();

    if (attendanceError) {
      console.error('Attendance creation error:', attendanceError);
      return NextResponse.json(
        { message: 'Eroare la înregistrarea prezenței. Te rugăm să încerci din nou.' },
        { status: 500 }
      );
    }

    // 12. Success response
    return NextResponse.json(
      {
        message: 'Prezență înregistrată cu succes',
        attendance: {
          id: attendance.id,
          checked_in_at: attendance.checked_in_at,
          hours_credited: attendance.hours_credited,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Check-in API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Date QR code invalide',
          errors: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'A apărut o eroare la procesarea check-in-ului' },
      { status: 500 }
    );
  }
}
