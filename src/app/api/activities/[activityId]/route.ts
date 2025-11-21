import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
        category,
        location,
        start_date,
        end_date,
        status,
        max_participants,
        current_participants,
        created_by,
        created_at,
        updated_at
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
