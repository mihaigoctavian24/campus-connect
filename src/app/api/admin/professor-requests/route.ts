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

    // Get all professor requests with user and reviewer info
    const { data: requests, error: requestsError } = await supabase
      .from('professor_role_requests')
      .select(
        `
        id,
        user_id,
        department,
        reason,
        supporting_documents,
        status,
        reviewed_by,
        reviewed_at,
        rejection_reason,
        admin_notes,
        created_at,
        user:profiles!professor_role_requests_user_id_fkey (
          id,
          email,
          first_name,
          last_name,
          faculty
        ),
        reviewer:profiles!professor_role_requests_reviewed_by_fkey (
          first_name,
          last_name
        )
      `
      )
      .order('created_at', { ascending: false });

    if (requestsError) {
      console.error('Error fetching professor requests:', requestsError);
      return NextResponse.json({ error: 'Eroare la încărcarea cererilor' }, { status: 500 });
    }

    return NextResponse.json({ requests: requests || [] });
  } catch (error) {
    console.error('Error in GET /api/admin/professor-requests:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
