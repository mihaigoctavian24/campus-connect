import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ activityId: string }> }
) {
  try {
    const supabase = await createClient();
    const { activityId } = await params;

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Nu ești autentificat' }, { status: 401 });
    }

    // Check if the saved opportunity exists
    const { data: existing, error: fetchError } = await supabase
      .from('saved_opportunities')
      .select('id')
      .eq('user_id', user.id)
      .eq('activity_id', activityId)
      .maybeSingle<{ id: string }>();

    if (fetchError) {
      console.error('Fetch saved error:', fetchError);
      return NextResponse.json(
        { message: 'Eroare la verificarea activității salvate' },
        { status: 500 }
      );
    }

    if (!existing) {
      return NextResponse.json(
        { message: 'Activitatea nu este salvată' },
        { status: 404 }
      );
    }

    // Delete the saved opportunity
    const { error: deleteError } = await supabase
      .from('saved_opportunities')
      .delete()
      .eq('user_id', user.id)
      .eq('activity_id', activityId);

    if (deleteError) {
      console.error('Delete saved error:', deleteError);
      return NextResponse.json(
        { message: 'Eroare la ștergerea activității salvate' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Activitate eliminată din salvate' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unsave API error:', error);
    return NextResponse.json(
      { message: 'A apărut o eroare la eliminarea activității din salvate' },
      { status: 500 }
    );
  }
}
