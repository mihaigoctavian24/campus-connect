import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Nu ești autentificat' }, { status: 401 });
    }

    // Get session and verify professor owns the activity
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select(
        `
        *,
        activities!inner (
          id,
          title,
          created_by
        )
      `
      )
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ message: 'Sesiune negăsită' }, { status: 404 });
    }

    // Type the activities relation
    const activity = session.activities as unknown as {
      id: string;
      title: string;
      created_by: string;
    };

    // Verify user is the professor who created this activity
    if (activity.created_by !== user.id) {
      return NextResponse.json(
        { message: 'Nu ai permisiunea să generezi cod QR pentru această sesiune' },
        { status: 403 }
      );
    }

    // Verify session is today or in progress
    const sessionDate = new Date(session.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    sessionDate.setHours(0, 0, 0, 0);

    if (sessionDate.getTime() !== today.getTime() && session.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        {
          message: 'QR code-ul poate fi generat doar pentru sesiunile de astăzi sau în desfășurare',
        },
        { status: 400 }
      );
    }

    // Generate QR code data
    // Structure: sessionId:timestamp:random_token
    const timestamp = Date.now();
    const randomToken = crypto.randomBytes(16).toString('hex');
    const qrPayload = {
      sessionId,
      timestamp,
      token: randomToken,
      activityId: activity.id,
    };

    // Encrypt the payload (in production, use proper encryption)
    const qrCodeData = Buffer.from(JSON.stringify(qrPayload)).toString('base64');

    // Set expiration to 30 seconds from now
    const expiresAt = new Date(timestamp + 30000);

    // Update session with new QR code data
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        qr_code_data: qrCodeData,
        qr_expires_at: expiresAt.toISOString(),
        status: 'IN_PROGRESS', // Mark session as in progress when QR is generated
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error updating session with QR data:', updateError);
      return NextResponse.json({ message: 'Eroare la generarea codului QR' }, { status: 500 });
    }

    return NextResponse.json({
      qr_code_data: qrCodeData,
      qr_expires_at: expiresAt.toISOString(),
      message: 'Cod QR generat cu succes',
    });
  } catch (error) {
    console.error('QR generation error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}
