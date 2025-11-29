import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, rateLimitErrorResponse } from '@/lib/security';

/**
 * GET /api/certificates/verify?code=XX-XXXXXXXX
 * Public endpoint to verify certificate authenticity
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting - 30 verifications per minute per IP
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(clientIp, {
      limit: 30,
      windowMs: 60 * 1000,
      identifier: 'certificate-verify',
    });

    if (!rateLimitResult.success) {
      return rateLimitErrorResponse(rateLimitResult.resetAt);
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Codul certificatului este obligatoriu', valid: false },
        { status: 400 }
      );
    }

    // Sanitize the code - should match format CC-XXXXXXXX
    const sanitizedCode = code.toUpperCase().trim();
    const codeRegex = /^CC-[A-Z0-9]{8}$/;

    if (!codeRegex.test(sanitizedCode)) {
      return NextResponse.json(
        {
          error: 'Format invalid. Codul trebuie să fie în format CC-XXXXXXXX',
          valid: false,
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Look up the certificate
    const { data: certificate, error: certError } = await supabase
      .from('certificates')
      .select(
        `
        id,
        certificate_number,
        issued_at,
        user:profiles!certificates_user_id_fkey (
          first_name,
          last_name
        ),
        activity:activities!certificates_activity_id_fkey (
          title,
          date
        )
      `
      )
      .eq('certificate_number', sanitizedCode)
      .single();

    if (certError || !certificate) {
      return NextResponse.json(
        {
          valid: false,
          message: 'Certificatul nu a fost găsit în baza de date',
          code: sanitizedCode,
        },
        { status: 404 }
      );
    }

    // Certificate is valid - return verification details
    const user = certificate.user as { first_name: string | null; last_name: string | null } | null;
    const activity = certificate.activity as { title: string; date: string } | null;

    return NextResponse.json({
      valid: true,
      message: 'Certificat valid',
      certificate: {
        code: certificate.certificate_number,
        issued_at: certificate.issued_at,
        holder_name: user
          ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
          : 'Necunoscut',
        activity_title: activity?.title || 'Activitate necunoscută',
        activity_date: activity?.date || null,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/certificates/verify:', error);
    return NextResponse.json({ error: 'Eroare internă de server', valid: false }, { status: 500 });
  }
}
