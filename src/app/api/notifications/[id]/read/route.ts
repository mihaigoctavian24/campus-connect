import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read
 */
export async function PATCH(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 });
    }

    // Mark notification as read
    const { data: notification, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error marking notification as read:', error);
      return NextResponse.json(
        { error: 'Eroare la marcarea notificării ca citită' },
        { status: 500 }
      );
    }

    if (!notification) {
      return NextResponse.json({ error: 'Notificarea nu a fost găsită' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Notificarea a fost marcată ca citită',
      notification,
    });
  } catch (error) {
    console.error('Error in PATCH /api/notifications/:id/read:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
