import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const updateProfileSchema = z.object({
  first_name: z.string().min(2, 'Prenumele trebuie să aibă minim 2 caractere'),
  last_name: z.string().min(2, 'Numele trebuie să aibă minim 2 caractere'),
  phone: z.string().optional().nullable(),
  faculty: z.string().optional().nullable(),
  specialization: z.string().optional().nullable(),
  year: z.number().min(1).max(6).optional().nullable(),
  program_type: z.enum(['LICENSE', 'MASTER', 'DOCTORAT']).optional().nullable(),
});

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

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Eroare la preluarea profilului' }, { status: 500 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error in GET /api/users/me:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Date invalide',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const updates = validationResult.data;

    // Update profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return NextResponse.json({ error: 'Eroare la actualizarea profilului' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Profilul a fost actualizat cu succes',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Error in PUT /api/users/me:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
