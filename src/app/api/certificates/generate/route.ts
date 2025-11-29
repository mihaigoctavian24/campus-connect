import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientIp, rateLimitErrorResponse } from '@/lib/security';

const generateCertificateSchema = z.object({
  activity_id: z.string().uuid().optional(),
  student_id: z.string().uuid().optional(),
  certificate_type: z.enum(['participation', 'completion', 'hours']).default('participation'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 10 certificates per hour per IP
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(clientIp, {
      limit: 10,
      windowMs: 60 * 60 * 1000,
      identifier: 'certificate-generate',
    });

    if (!rateLimitResult.success) {
      return rateLimitErrorResponse(rateLimitResult.resetAt);
    }

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, first_name, last_name, email')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: 'Eroare la încărcarea profilului' }, { status: 500 });
    }

    const body = await request.json();
    const validationResult = generateCertificateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { activity_id, student_id, certificate_type } = validationResult.data;

    // Determine target user
    const targetUserId = (profile.role || '').toLowerCase() === 'student' ? user.id : student_id;

    if (!targetUserId) {
      return NextResponse.json({ error: 'ID student necesar' }, { status: 400 });
    }

    // Get student info
    const { data: studentProfile, error: studentError } = await supabase
      .from('profiles')
      .select('first_name, last_name, email, faculty, year')
      .eq('id', targetUserId)
      .single();

    if (studentError || !studentProfile) {
      return NextResponse.json({ error: 'Student negăsit' }, { status: 404 });
    }

    // Get hours data
    let hoursQuery = supabase
      .from('hours_requests')
      .select(
        `
        id,
        hours,
        status,
        created_at,
        activity:activities (
          id,
          title,
          category_id
        )
      `
      )
      .eq('user_id', targetUserId)
      .eq('status', 'APPROVED');

    if (activity_id) {
      hoursQuery = hoursQuery.eq('activity_id', activity_id);
    }

    const { data: hoursRequests, error: hoursError } = await hoursQuery;

    if (hoursError) {
      console.error('Error fetching hours:', hoursError);
      return NextResponse.json({ error: 'Eroare la încărcarea orelor' }, { status: 500 });
    }

    const totalHours = (hoursRequests || []).reduce((sum, hr) => sum + (hr.hours || 0), 0);

    // Get platform config for minimum hours
    // Note: platform_config may not be in generated types yet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: minHoursConfig } = (await (supabase as any)
      .from('platform_config')
      .select('value')
      .eq('key', 'certificate_min_hours')
      .single()) as { data: { value: unknown } | null };

    const minHours = minHoursConfig?.value ? parseInt(String(minHoursConfig.value)) : 10;

    if (totalHours < minHours) {
      return NextResponse.json(
        {
          error: `Ore insuficiente pentru certificat. Minim ${minHours} ore necesare, ai ${totalHours} ore.`,
        },
        { status: 400 }
      );
    }

    // Get activity info if specific activity
    let activityInfo = null;
    if (activity_id) {
      const { data: activity } = await supabase
        .from('activities')
        .select('title, description, date')
        .eq('id', activity_id)
        .single();
      activityInfo = activity;
    }

    // Generate certificate data
    const certificateData = {
      id: crypto.randomUUID(),
      generated_at: new Date().toISOString(),
      certificate_type,
      student: {
        name: `${studentProfile.first_name} ${studentProfile.last_name}`,
        email: studentProfile.email,
        faculty: studentProfile.faculty,
        study_year: studentProfile.year,
      },
      hours: {
        total: totalHours,
        activities: (hoursRequests || []).map((hr) => ({
          title: (hr.activity as { title: string } | null)?.title || 'Activitate necunoscută',
          hours: hr.hours,
          date: hr.created_at,
        })),
      },
      activity: activityInfo,
      verification_code: generateVerificationCode(),
    };

    // Log the certificate generation
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'CERTIFICATE_GENERATED',
      entity_type: 'certificate',
      entity_id: certificateData.id,
      details: {
        student_id: targetUserId,
        certificate_type,
        total_hours: totalHours,
        activity_id,
      },
    });

    return NextResponse.json({
      message: 'Certificat generat cu succes',
      certificate: certificateData,
    });
  } catch (error) {
    console.error('Error in POST /api/certificates/generate:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'CC-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
