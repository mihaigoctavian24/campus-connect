import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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

    if (profileError || (profile?.role || '').toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action');
    const entityType = searchParams.get('entity_type');
    const userId = searchParams.get('user_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('audit_logs')
      .select(
        `
        id,
        user_id,
        action,
        entity_type,
        entity_id,
        details,
        ip_address,
        user_agent,
        created_at,
        user:profiles!audit_logs_user_id_fkey (
          id,
          email,
          first_name,
          last_name,
          role
        )
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (action) {
      query = query.eq('action', action);
    }
    if (entityType) {
      query = query.eq('entity_type', entityType);
    }
    if (userId) {
      query = query.eq('user_id', userId);
    }
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: logs, error: logsError, count } = await query;

    if (logsError) {
      console.error('Error fetching audit logs:', logsError);
      return NextResponse.json({ error: 'Eroare la încărcarea log-urilor' }, { status: 500 });
    }

    // Get unique actions and entity types for filters
    const { data: actions } = await supabase.from('audit_logs').select('action').limit(100);

    const { data: entityTypes } = await supabase
      .from('audit_logs')
      .select('entity_type')
      .limit(100);

    const uniqueActions = [...new Set(actions?.map((a) => a.action) || [])];
    const uniqueEntityTypes = [...new Set(entityTypes?.map((e) => e.entity_type) || [])];

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
      filters: {
        actions: uniqueActions,
        entityTypes: uniqueEntityTypes,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/audit-logs:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
