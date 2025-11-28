import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateRequestSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  rejection_reason: z.string().optional(),
  admin_notes: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;
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
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (adminError || adminProfile?.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { status, rejection_reason, admin_notes } = validationResult.data;

    // Check rejection reason requirement
    if (status === 'REJECTED' && !rejection_reason) {
      return NextResponse.json({ error: 'Motivul respingerii este obligatoriu' }, { status: 400 });
    }

    // Get the request
    const { data: professorRequest, error: requestError } = await supabase
      .from('professor_role_requests')
      .select('id, user_id, status')
      .eq('id', requestId)
      .single();

    if (requestError || !professorRequest) {
      return NextResponse.json({ error: 'Cererea nu a fost găsită' }, { status: 404 });
    }

    // Check if request is already processed
    if (professorRequest.status !== 'PENDING') {
      return NextResponse.json({ error: 'Această cerere a fost deja procesată' }, { status: 400 });
    }

    // Update the request
    const { error: updateError } = await supabase
      .from('professor_role_requests')
      .update({
        status,
        rejection_reason: status === 'REJECTED' ? rejection_reason : null,
        admin_notes: admin_notes || null,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (updateError) {
      console.error('Error updating professor request:', updateError);
      return NextResponse.json({ error: 'Eroare la actualizarea cererii' }, { status: 500 });
    }

    // If approved, update user role to professor
    if (status === 'APPROVED') {
      const { error: roleUpdateError } = await supabase
        .from('profiles')
        .update({ role: 'professor' })
        .eq('id', professorRequest.user_id);

      if (roleUpdateError) {
        console.error('Error updating user role:', roleUpdateError);
        // Rollback the request status
        await supabase
          .from('professor_role_requests')
          .update({
            status: 'PENDING',
            reviewed_by: null,
            reviewed_at: null,
          })
          .eq('id', requestId);

        return NextResponse.json(
          { error: 'Eroare la actualizarea rolului utilizatorului' },
          { status: 500 }
        );
      }
    }

    // Log the action (audit log)
    const { error: auditError } = await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: status === 'APPROVED' ? 'PROFESSOR_REQUEST_APPROVED' : 'PROFESSOR_REQUEST_REJECTED',
      entity_type: 'professor_role_request',
      entity_id: requestId,
      details: {
        target_user_id: professorRequest.user_id,
        status,
        rejection_reason: status === 'REJECTED' ? rejection_reason : undefined,
        admin_notes: admin_notes || undefined,
      },
    });

    if (auditError) {
      // Log but don't fail the request
      console.error('Error creating audit log:', auditError);
    }

    // TODO: Send email notification to the user about the decision
    // This will be implemented in Sprint 17.2 or later

    return NextResponse.json({
      message:
        status === 'APPROVED' ? 'Cererea a fost aprobată cu succes' : 'Cererea a fost respinsă',
      request: {
        id: requestId,
        status,
        reviewed_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in PATCH /api/admin/professor-requests/[requestId]:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;
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

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 });
    }

    // Get the specific request
    const { data: professorRequest, error: requestError } = await supabase
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
      .eq('id', requestId)
      .single();

    if (requestError || !professorRequest) {
      return NextResponse.json({ error: 'Cererea nu a fost găsită' }, { status: 404 });
    }

    return NextResponse.json({ request: professorRequest });
  } catch (error) {
    console.error('Error in GET /api/admin/professor-requests/[requestId]:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
