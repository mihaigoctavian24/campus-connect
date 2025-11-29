import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createDepartmentSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere').max(100),
  short_code: z.string().min(2, 'Codul scurt trebuie să aibă cel puțin 2 caractere').max(10),
  description: z.string().max(500).optional(),
  contact_name: z.string().max(100).optional(),
  contact_email: z.string().email('Email invalid').optional().or(z.literal('')),
  logo_url: z.string().url('URL invalid').optional().or(z.literal('')),
  is_active: z.boolean().optional(),
});

// GET - List all departments (admin view with full details)
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

    // Fetch all departments with full details
    const { data: departments, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching departments:', error);
      return NextResponse.json({ error: 'Eroare la încărcarea departamentelor' }, { status: 500 });
    }

    return NextResponse.json({ departments });
  } catch (error) {
    console.error('Error in GET /api/admin/departments:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

// POST - Create new department
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
    const validationResult = createDepartmentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const departmentData = validationResult.data;

    // Check for duplicate name
    const { data: existing } = await supabase
      .from('departments')
      .select('id')
      .eq('name', departmentData.name)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Un departament cu acest nume există deja' },
        { status: 400 }
      );
    }

    // Check for duplicate short_code
    const { data: existingCode } = await supabase
      .from('departments')
      .select('id')
      .eq('short_code', departmentData.short_code)
      .single();

    if (existingCode) {
      return NextResponse.json(
        { error: 'Un departament cu acest cod scurt există deja' },
        { status: 400 }
      );
    }

    // Create department
    const { data: department, error: createError } = await supabase
      .from('departments')
      .insert({
        name: departmentData.name,
        short_code: departmentData.short_code,
        description: departmentData.description || null,
        contact_name: departmentData.contact_name || null,
        contact_email: departmentData.contact_email || null,
        logo_url: departmentData.logo_url || null,
        is_active: departmentData.is_active ?? true,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating department:', createError);
      return NextResponse.json({ error: 'Eroare la crearea departamentului' }, { status: 500 });
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'DEPARTMENT_CREATED',
      entity_type: 'department',
      entity_id: department.id,
      details: { name: department.name, short_code: department.short_code },
    });

    return NextResponse.json({
      message: 'Departamentul a fost creat cu succes',
      department,
    });
  } catch (error) {
    console.error('Error in POST /api/admin/departments:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
