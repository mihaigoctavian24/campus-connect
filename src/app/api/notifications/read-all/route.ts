import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read for the authenticated user
 */
export async function PATCH() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 });
    }

    // Mark all unread notifications as read
    const { data, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('is_read', false)
      .select('id');

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return NextResponse.json(
        { error: 'Eroare la marcarea notificărilor ca citite' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Toate notificările au fost marcate ca citite',
      updated_count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error in PATCH /api/notifications/read-all:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
