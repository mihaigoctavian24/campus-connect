import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendHoursApprovedEmail } from '@/lib/email/service';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

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
    const { requestIds, notes } = body;

    if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
      return NextResponse.json({ error: 'Lista de cereri este invalidă' }, { status: 400 });
    }

    // Get professor profile once
    const { data: professorProfile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single();

    // Fetch all requests with details
    const { data: hoursRequests, error: fetchError } = await supabase
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
          ),
          profiles:user_id (
            id,
            email,
            first_name,
            last_name
          )
        )
      `
      )
      .in('id', requestIds);

    if (fetchError || !hoursRequests) {
      return NextResponse.json({ error: 'Eroare la căutarea cererilor' }, { status: 404 });
    }

    // Validate all requests
    const errors: string[] = [];
    const validRequests: typeof hoursRequests = [];

    for (const request of hoursRequests) {
      // Check if professor owns the activity
      if (request.enrollments?.activities?.created_by !== user.id) {
        errors.push(`Cererea ${request.id} nu este pentru activitatea ta`);
        continue;
      }

      // Check if already processed
      if (request.status !== 'PENDING') {
        errors.push(
          `Cererea ${request.id} este deja ${request.status?.toLowerCase() || 'procesată'}`
        );
        continue;
      }

      validRequests.push(request);
    }

    if (validRequests.length === 0) {
      return NextResponse.json(
        {
          error: 'Nicio cerere validă pentru aprobare',
          details: errors,
        },
        { status: 400 }
      );
    }

    // Batch update all valid requests
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('hours_requests')
      .update({
        status: 'APPROVED',
        approved_at: now,
        approved_by: user.id,
        professor_notes: notes || null,
      })
      .in(
        'id',
        validRequests.map((r) => r.id)
      );

    if (updateError) {
      throw updateError;
    }

    // Send email notifications to all students (in background, don't await)
    if (professorProfile) {
      const professorName = `${professorProfile.first_name} ${professorProfile.last_name}`;

      // Group by student to avoid sending multiple emails to same student
      const emailsByStudent = new Map<
        string,
        { email: string; name: string; requests: typeof validRequests }
      >();

      for (const request of validRequests) {
        const studentId = request.enrollments?.user_id;
        const studentEmail = (request.enrollments?.profiles as any)?.email;
        const studentName = (request.enrollments?.profiles as any)?.first_name;

        if (studentId && studentEmail && studentName) {
          if (!emailsByStudent.has(studentId)) {
            emailsByStudent.set(studentId, {
              email: studentEmail,
              name: studentName,
              requests: [],
            });
          }
          emailsByStudent.get(studentId)!.requests.push(request);
        }
      }

      // Send emails (fire and forget - don't block response)
      for (const { email, name, requests: studentRequests } of emailsByStudent.values()) {
        // Send one email per approved request
        for (const request of studentRequests) {
          sendHoursApprovedEmail({
            studentEmail: email,
            studentName: name,
            activityTitle: request.enrollments?.activities?.title || 'Activitate',
            professorName,
            hours: request.hours,
            date: request.date,
            notes,
          }).catch((err) => {
            console.error(`Failed to send email to ${email}:`, err);
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${validRequests.length} cerer${validRequests.length > 1 ? 'i' : 'e'} aprobat${validRequests.length > 1 ? 'e' : 'ă'} cu succes`,
      approved: validRequests.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Bulk approve error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Eroare la aprobare în masă' },
      { status: 500 }
    );
  }
}
