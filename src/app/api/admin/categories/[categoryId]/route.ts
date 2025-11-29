import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateCategorySchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere').max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Culoarea trebuie să fie în format hex (#RRGGBB)')
    .optional()
    .nullable(),
  icon: z.string().max(10).optional().nullable(),
  is_active: z.boolean().optional(),
});

// GET - Get single category
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
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

    // Fetch category
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error || !category) {
      return NextResponse.json({ error: 'Categoria nu a fost găsită' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error in GET /api/admin/categories/[categoryId]:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

// PATCH - Update category
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
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

    // Check if category exists
    const { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (fetchError || !existingCategory) {
      return NextResponse.json({ error: 'Categoria nu a fost găsită' }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateCategorySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Check for duplicate name if changing
    if (updateData.name && updateData.name !== existingCategory.name) {
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('name', updateData.name)
        .neq('id', categoryId)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: 'O categorie cu acest nume există deja' },
          { status: 400 }
        );
      }
    }

    // Build update object
    const updateObject: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updateData.name !== undefined) updateObject.name = updateData.name;
    if (updateData.description !== undefined)
      updateObject.description = updateData.description || null;
    if (updateData.color !== undefined) updateObject.color = updateData.color || null;
    if (updateData.icon !== undefined) updateObject.icon = updateData.icon || null;
    if (updateData.is_active !== undefined) updateObject.is_active = updateData.is_active;

    // Update category
    const { data: category, error: updateError } = await supabase
      .from('categories')
      .update(updateObject)
      .eq('id', categoryId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating category:', updateError);
      return NextResponse.json({ error: 'Eroare la actualizarea categoriei' }, { status: 500 });
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'CATEGORY_UPDATED',
      entity_type: 'category',
      entity_id: categoryId,
      details: JSON.parse(
        JSON.stringify({
          previous: existingCategory,
          updated: updateObject,
        })
      ),
    });

    return NextResponse.json({
      message: 'Categoria a fost actualizată cu succes',
      category,
    });
  } catch (error) {
    console.error('Error in PATCH /api/admin/categories/[categoryId]:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

// DELETE - Delete category
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
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

    // Check if category exists
    const { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (fetchError || !existingCategory) {
      return NextResponse.json({ error: 'Categoria nu a fost găsită' }, { status: 404 });
    }

    // Check if category is used by any activities
    const { count: activitiesCount } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId);

    if (activitiesCount && activitiesCount > 0) {
      return NextResponse.json(
        { error: `Categoria nu poate fi ștearsă. Este asociată cu ${activitiesCount} activități.` },
        { status: 400 }
      );
    }

    // Delete category
    const { error: deleteError } = await supabase.from('categories').delete().eq('id', categoryId);

    if (deleteError) {
      console.error('Error deleting category:', deleteError);
      return NextResponse.json({ error: 'Eroare la ștergerea categoriei' }, { status: 500 });
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'CATEGORY_DELETED',
      entity_type: 'category',
      entity_id: categoryId,
      details: { deleted_category: existingCategory },
    });

    return NextResponse.json({
      message: 'Categoria a fost ștearsă cu succes',
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/categories/[categoryId]:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
