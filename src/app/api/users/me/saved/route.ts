import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema
const saveSchema = z.object({
  activityId: z.string().uuid('ID activitate invalid'),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Nu ești autentificat' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const { activityId } = saveSchema.parse(body);

    // Check if activity exists and is not deleted
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('id, title, status')
      .eq('id', activityId)
      .is('deleted_at', null)
      .single<{ id: string; title: string; status: string }>();

    if (activityError || !activity) {
      return NextResponse.json({ message: 'Activitatea nu a fost găsită' }, { status: 404 });
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from('saved_opportunities')
      .select('id')
      .eq('user_id', user.id)
      .eq('activity_id', activityId)
      .maybeSingle<{ id: string }>();

    if (existing) {
      return NextResponse.json(
        { message: 'Activitatea este deja salvată' },
        { status: 400 }
      );
    }

    // Save the opportunity
    const { data: saved, error: saveError } = await supabase
      .from('saved_opportunities')
      // @ts-expect-error - Database types haven't been regenerated after migration
      .insert({
        user_id: user.id,
        activity_id: activityId,
      })
      .select()
      .single<{ id: string; user_id: string; activity_id: string; saved_at: string }>();

    if (saveError) {
      console.error('Save error:', saveError);
      return NextResponse.json(
        { message: 'Eroare la salvarea activității' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Activitate salvată cu succes',
        saved,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Save API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Date invalide',
          errors: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'A apărut o eroare la salvarea activității' },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Nu ești autentificat' }, { status: 401 });
    }

    // Get all saved opportunities for the user
    const { data: savedOpportunities, error: fetchError } = await supabase
      .from('saved_opportunities')
      .select(
        `
        id,
        saved_at,
        activity:activities (
          id,
          title,
          description,
          date,
          start_time,
          end_time,
          location,
          max_participants,
          current_participants,
          status,
          image_url,
          category_id
        )
      `
      )
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });

    if (fetchError) {
      console.error('Fetch saved error:', fetchError);
      return NextResponse.json(
        { message: 'Eroare la încărcarea activităților salvate' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        saved: savedOpportunities || [],
        count: savedOpportunities?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get saved API error:', error);
    return NextResponse.json(
      { message: 'A apărut o eroare la încărcarea activităților salvate' },
      { status: 500 }
    );
  }
}
