import { createClient } from '@/lib/supabase/server';
import { logHoursApiSchema } from '@/lib/validations/hours';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/hours/log
 * Student logs hours for validation by professor
 *
 * Request body:
 * - enrollment_id: UUID
 * - activity_id: UUID
 * - hours: number (0.5-24)
 * - date: ISO date string
 * - description: string (20-1000 chars)
 * - evidence_urls: string[] (optional)
 *
 * Response:
 * - 201: Hours logged successfully
 * - 400: Validation error
 * - 401: Unauthorized
 * - 403: Not enrolled or not confirmed
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = logHoursApiSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return NextResponse.json(
        {
          error: 'Validation failed',
          details: errors,
        },
        { status: 400 }
      );
    }

    const { enrollment_id, activity_id, hours, date, description, evidence_urls } =
      validationResult.data;

    // Verify enrollment exists and belongs to user
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id, status, activity_id, user_id')
      .eq('id', enrollment_id)
      .eq('user_id', user.id)
      .eq('activity_id', activity_id)
      .single();

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found or does not belong to you' },
        { status: 403 }
      );
    }

    if (enrollment.status !== 'CONFIRMED') {
      return NextResponse.json(
        { error: 'Your enrollment must be confirmed before logging hours' },
        { status: 403 }
      );
    }

    // Verify activity exists
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('id, title, status')
      .eq('id', activity_id)
      .single();

    if (activityError || !activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    // Create hours request
    const { data: hoursRequest, error: hoursError } = await supabase
      .from('hours_requests')
      .insert({
        enrollment_id,
        user_id: user.id,
        activity_id,
        hours,
        date,
        description,
        evidence_urls: evidence_urls || null,
        status: 'PENDING', // Default status
      })
      .select(
        `
        id,
        hours,
        date,
        description,
        evidence_urls,
        status,
        created_at
      `
      )
      .single();

    if (hoursError) {
      console.error('Error creating hours request:', hoursError);
      return NextResponse.json(
        { error: 'Failed to log hours', details: hoursError.message },
        { status: 500 }
      );
    }

    // TODO: Send email notification to professor (Week 21-22: Platform Configuration)
    // - Professor receives notification: "Student [Name] logged [X] hours for [Activity]"
    // - Include link to validation page

    return NextResponse.json(
      {
        message: 'Hours logged successfully',
        request: hoursRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Hours logging error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
