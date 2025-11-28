import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/notifications/:id
 * Get a single notification
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
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

    // Fetch notification
    const { data: notification, error } = await supabase
      .from('notifications')
      .select(
        `
        id,
        type,
        title,
        message,
        is_read,
        read_at,
        created_at,
        related_activity_id,
        activities:related_activity_id (
          id,
          title
        )
      `
      )
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !notification) {
      return NextResponse.json({ error: 'Notificarea nu a fost găsită' }, { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error in GET /api/notifications/:id:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
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

    // Delete notification (only if it belongs to the user)
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting notification:', error);
      return NextResponse.json({ error: 'Eroare la ștergerea notificării' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Notificarea a fost ștearsă' });
  } catch (error) {
    console.error('Error in DELETE /api/notifications/:id:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
