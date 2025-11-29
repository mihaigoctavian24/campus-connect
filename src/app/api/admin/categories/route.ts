import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere').max(100),
  description: z.string().max(500).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Culoarea trebuie să fie în format hex (#RRGGBB)')
    .optional(),
  icon: z.string().max(10).optional(), // Emoji or icon code
  is_active: z.boolean().optional(),
});

// GET - List all categories (admin view with full details)
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

    // Fetch all categories with full details
    const { data: categories, error } = await supabase.from('categories').select('*').order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ error: 'Eroare la încărcarea categoriilor' }, { status: 500 });
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error in GET /api/admin/categories:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

// POST - Create new category
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
    const validationResult = createCategorySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const categoryData = validationResult.data;

    // Check for duplicate name
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryData.name)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'O categorie cu acest nume există deja' }, { status: 400 });
    }

    // Create category
    const { data: category, error: createError } = await supabase
      .from('categories')
      .insert({
        name: categoryData.name,
        description: categoryData.description || null,
        color: categoryData.color || null,
        icon: categoryData.icon || null,
        is_active: categoryData.is_active ?? true,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating category:', createError);
      return NextResponse.json({ error: 'Eroare la crearea categoriei' }, { status: 500 });
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'CATEGORY_CREATED',
      entity_type: 'category',
      entity_id: category.id,
      details: { name: category.name },
    });

    return NextResponse.json({
      message: 'Categoria a fost creată cu succes',
      category,
    });
  } catch (error) {
    console.error('Error in POST /api/admin/categories:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
