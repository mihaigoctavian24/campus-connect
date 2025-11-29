import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createTemplateSchema = z.object({
  template_type: z.string().min(2, 'Tipul trebuie să aibă cel puțin 2 caractere').max(50),
  subject: z.string().min(2, 'Subiectul trebuie să aibă cel puțin 2 caractere').max(200),
  body: z.string().min(10, 'Conținutul trebuie să aibă cel puțin 10 caractere'),
  variables: z.array(z.string()).optional(),
  department_id: z.string().uuid().optional().nullable(),
});

// GET - List all email templates
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

    if (profileError || profile?.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 });
    }

    // Fetch templates with creator info
    const { searchParams } = new URL(request.url);
    const templateType = searchParams.get('type');

    let query = supabase
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
      .order('template_type', { ascending: true });

    if (templateType) {
      query = query.eq('template_type', templateType);
    }

    const { data: templates, error } = await query;

    if (error) {
      console.error('Error fetching email templates:', error);
      return NextResponse.json({ error: 'Eroare la încărcarea șabloanelor' }, { status: 500 });
    }

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error in GET /api/admin/email-templates:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

// POST - Create new email template
export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createTemplateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const {
      template_type,
      subject,
      body: templateBody,
      variables,
      department_id,
    } = validationResult.data;

    // Check for duplicate template_type (for the same department or global)
    let duplicateQuery = supabase
      .from('email_templates')
      .select('id')
      .eq('template_type', template_type);

    if (department_id) {
      duplicateQuery = duplicateQuery.eq('department_id', department_id);
    } else {
      duplicateQuery = duplicateQuery.is('department_id', null);
    }

    const { data: existing } = await duplicateQuery.single();

    if (existing) {
      return NextResponse.json({ error: 'Un șablon cu acest tip există deja' }, { status: 400 });
    }

    // Create template
    const { data: template, error: insertError } = await supabase
      .from('email_templates')
      .insert({
        template_type,
        subject,
        body: templateBody,
        variables: variables || [],
        department_id: department_id || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating email template:', insertError);
      return NextResponse.json({ error: 'Eroare la crearea șablonului' }, { status: 500 });
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'EMAIL_TEMPLATE_CREATED',
      entity_type: 'email_template',
      entity_id: template.id,
      details: { template_type, subject },
    });

    return NextResponse.json(
      {
        message: 'Șablonul a fost creat cu succes',
        template,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/admin/email-templates:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
