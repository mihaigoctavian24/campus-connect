import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
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

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 });
    }

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select(
        `
        id,
        email,
        first_name,
        last_name,
        role,
        created_at,
        profile_picture_url,
        faculty,
        year,
        specialization,
        is_active,
        last_login
      `
      )
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Eroare la încărcarea utilizatorilor' }, { status: 500 });
    }

    return NextResponse.json({ users: users || [] });
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
