import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateDepartmentSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere').max(100).optional(),
  short_code: z
    .string()
    .min(2, 'Codul scurt trebuie să aibă cel puțin 2 caractere')
    .max(10)
    .optional(),
  description: z.string().max(500).optional().nullable(),
  contact_name: z.string().max(100).optional().nullable(),
  contact_email: z.string().email('Email invalid').optional().nullable().or(z.literal('')),
  logo_url: z.string().url('URL invalid').optional().nullable().or(z.literal('')),
  is_active: z.boolean().optional(),
});

// GET - Get single department
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ departmentId: string }> }
) {
  try {
    const { departmentId } = await params;
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

    // Fetch department
    const { data: department, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', departmentId)
      .single();

    if (error || !department) {
      return NextResponse.json({ error: 'Departamentul nu a fost găsit' }, { status: 404 });
    }

    return NextResponse.json({ department });
  } catch (error) {
    console.error('Error in GET /api/admin/departments/[departmentId]:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

// PATCH - Update department
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ departmentId: string }> }
) {
  try {
    const { departmentId } = await params;
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

    // Check if department exists
    const { data: existingDepartment, error: fetchError } = await supabase
      .from('departments')
      .select('*')
      .eq('id', departmentId)
      .single();

    if (fetchError || !existingDepartment) {
      return NextResponse.json({ error: 'Departamentul nu a fost găsit' }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateDepartmentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Check for duplicate name if changing
    if (updateData.name && updateData.name !== existingDepartment.name) {
      const { data: existing } = await supabase
        .from('departments')
        .select('id')
        .eq('name', updateData.name)
        .neq('id', departmentId)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: 'Un departament cu acest nume există deja' },
          { status: 400 }
        );
      }
    }

    // Check for duplicate short_code if changing
    if (updateData.short_code && updateData.short_code !== existingDepartment.short_code) {
      const { data: existingCode } = await supabase
        .from('departments')
        .select('id')
        .eq('short_code', updateData.short_code)
        .neq('id', departmentId)
        .single();

      if (existingCode) {
        return NextResponse.json(
          { error: 'Un departament cu acest cod scurt există deja' },
          { status: 400 }
        );
      }
    }

    // Build update object
    const updateObject: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updateData.name !== undefined) updateObject.name = updateData.name;
    if (updateData.short_code !== undefined) updateObject.short_code = updateData.short_code;
    if (updateData.description !== undefined)
      updateObject.description = updateData.description || null;
    if (updateData.contact_name !== undefined)
      updateObject.contact_name = updateData.contact_name || null;
    if (updateData.contact_email !== undefined)
      updateObject.contact_email = updateData.contact_email || null;
    if (updateData.logo_url !== undefined) updateObject.logo_url = updateData.logo_url || null;
    if (updateData.is_active !== undefined) updateObject.is_active = updateData.is_active;

    // Update department
    const { data: department, error: updateError } = await supabase
      .from('departments')
      .update(updateObject)
      .eq('id', departmentId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating department:', updateError);
      return NextResponse.json(
        { error: 'Eroare la actualizarea departamentului' },
        { status: 500 }
      );
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'DEPARTMENT_UPDATED',
      entity_type: 'department',
      entity_id: departmentId,
      details: JSON.parse(
        JSON.stringify({
          previous: existingDepartment,
          updated: updateObject,
        })
      ),
    });

    return NextResponse.json({
      message: 'Departamentul a fost actualizat cu succes',
      department,
    });
  } catch (error) {
    console.error('Error in PATCH /api/admin/departments/[departmentId]:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

// DELETE - Delete department
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ departmentId: string }> }
) {
  try {
    const { departmentId } = await params;
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

    // Check if department exists
    const { data: existingDepartment, error: fetchError } = await supabase
      .from('departments')
      .select('*')
      .eq('id', departmentId)
      .single();

    if (fetchError || !existingDepartment) {
      return NextResponse.json({ error: 'Departamentul nu a fost găsit' }, { status: 404 });
    }

    // Check if department is used by any profiles
    const { count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('department_id', departmentId);

    if (profilesCount && profilesCount > 0) {
      return NextResponse.json(
        { error: `Departamentul nu poate fi șters. Este asociat cu ${profilesCount} utilizatori.` },
        { status: 400 }
      );
    }

    // Check if department is used by any activities
    const { count: activitiesCount } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('department_id', departmentId);

    if (activitiesCount && activitiesCount > 0) {
      return NextResponse.json(
        {
          error: `Departamentul nu poate fi șters. Este asociat cu ${activitiesCount} activități.`,
        },
        { status: 400 }
      );
    }

    // Delete department
    const { error: deleteError } = await supabase
      .from('departments')
      .delete()
      .eq('id', departmentId);

    if (deleteError) {
      console.error('Error deleting department:', deleteError);
      return NextResponse.json({ error: 'Eroare la ștergerea departamentului' }, { status: 500 });
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'DEPARTMENT_DELETED',
      entity_type: 'department',
      entity_id: departmentId,
      details: { deleted_department: existingDepartment },
    });

    return NextResponse.json({
      message: 'Departamentul a fost șters cu succes',
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/departments/[departmentId]:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
