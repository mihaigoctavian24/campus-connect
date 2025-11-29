import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateTemplateSchema = z.object({
  subject: z.string().min(2, 'Subiectul trebuie să aibă cel puțin 2 caractere').max(200).optional(),
  body: z.string().min(10, 'Conținutul trebuie să aibă cel puțin 10 caractere').optional(),
  variables: z.array(z.string()).optional(),
  department_id: z.string().uuid().optional().nullable(),
});

// GET - Get single email template
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params;
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

    // Fetch template
    const { data: template, error } = await supabase
      .from('email_templates')
      .select(
        `
        *,
        creator:profiles!email_templates_created_by_fkey (
          first_name,
          last_name
        ),
        department:departments!email_templates_department_id_fkey (
          name
        )
      `
      )
      .eq('id', templateId)
      .single();

    if (error || !template) {
      return NextResponse.json({ error: 'Șablonul nu a fost găsit' }, { status: 404 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error in GET /api/admin/email-templates/[templateId]:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

// PATCH - Update email template
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params;
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

    // Check if template exists
    const { data: existingTemplate, error: fetchError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (fetchError || !existingTemplate) {
      return NextResponse.json({ error: 'Șablonul nu a fost găsit' }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateTemplateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Build update object
    const updateObject: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updateData.subject !== undefined) updateObject.subject = updateData.subject;
    if (updateData.body !== undefined) updateObject.body = updateData.body;
    if (updateData.variables !== undefined) updateObject.variables = updateData.variables;
    if (updateData.department_id !== undefined)
      updateObject.department_id = updateData.department_id;

    // Update template
    const { data: template, error: updateError } = await supabase
      .from('email_templates')
      .update(updateObject)
      .eq('id', templateId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating email template:', updateError);
      return NextResponse.json({ error: 'Eroare la actualizarea șablonului' }, { status: 500 });
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'EMAIL_TEMPLATE_UPDATED',
      entity_type: 'email_template',
      entity_id: templateId,
      details: JSON.parse(
        JSON.stringify({
          previous: existingTemplate,
          updated: updateObject,
        })
      ),
    });

    return NextResponse.json({
      message: 'Șablonul a fost actualizat cu succes',
      template,
    });
  } catch (error) {
    console.error('Error in PATCH /api/admin/email-templates/[templateId]:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

// DELETE - Delete email template
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params;
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

    // Check if template exists
    const { data: existingTemplate, error: fetchError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (fetchError || !existingTemplate) {
      return NextResponse.json({ error: 'Șablonul nu a fost găsit' }, { status: 404 });
    }

    // Delete template
    const { error: deleteError } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', templateId);

    if (deleteError) {
      console.error('Error deleting email template:', deleteError);
      return NextResponse.json({ error: 'Eroare la ștergerea șablonului' }, { status: 500 });
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'EMAIL_TEMPLATE_DELETED',
      entity_type: 'email_template',
      entity_id: templateId,
      details: { deleted_template: existingTemplate },
    });

    return NextResponse.json({
      message: 'Șablonul a fost șters cu succes',
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/email-templates/[templateId]:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
