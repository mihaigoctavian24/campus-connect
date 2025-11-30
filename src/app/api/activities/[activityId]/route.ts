import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for PATCH
const updateActivitySchema = z.object({
  title: z.string().min(10).max(100).optional(),
  description: z.string().min(50).max(2000).optional(),
  category_id: z.string().uuid().optional(),
  department_id: z.string().uuid().optional(),
  location: z.string().min(5).optional(),
  max_participants: z.number().min(1).max(500).optional(),
  date: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  status: z.enum(['OPEN', 'CLOSED', 'DRAFT']).optional(),
  image_url: z.string().url().nullable().optional(),
});

export async function GET(
  _request: NextRequest,
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

    // Fetch activity details
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select(
        `
        id,
        title,
        description,
        category_id,
        location,
        date,
        start_time,
        end_time,
        status,
        max_participants,
        current_participants,
        created_by,
        created_at,
        updated_at,
        department_id
      `
      )
      .eq('id', activityId)
      .is('deleted_at', null)
      .single();

    if (activityError || !activity) {
      return NextResponse.json({ message: 'Activitatea nu a fost găsită' }, { status: 404 });
    }

    // Check authorization - only creator can view full details
    // (Public endpoint might exist separately for students)
    if (activity.created_by !== user.id) {
      return NextResponse.json(
        { message: 'Nu ai permisiunea să vezi această activitate' },
        { status: 403 }
      );
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Get activity error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}

export async function PATCH(
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

    // Check if activity exists and user is the creator
    const { data: existingActivity, error: fetchError } = await supabase
      .from('activities')
      .select('id, created_by')
      .eq('id', activityId)
      .is('deleted_at', null)
      .single();

    if (fetchError || !existingActivity) {
      return NextResponse.json({ message: 'Activitatea nu a fost găsită' }, { status: 404 });
    }

    if (existingActivity.created_by !== user.id) {
      return NextResponse.json(
        { message: 'Nu ai permisiunea să editezi această activitate' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateActivitySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: 'Date invalide',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Update the activity
    const { data: updatedActivity, error: updateError } = await supabase
      .from('activities')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', activityId)
      .select()
      .single();

    if (updateError) {
      console.error('Update activity error:', updateError);
      return NextResponse.json({ message: 'Eroare la actualizarea activității' }, { status: 500 });
    }

    return NextResponse.json(updatedActivity);
  } catch (error) {
    console.error('PATCH activity error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}
