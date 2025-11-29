import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const roleSchema = z.object({
  role: z.enum(['STUDENT', 'PROFESSOR', 'ADMIN']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 });
    }

    // Check if current user is admin
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
    const validationResult = roleSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Rol invalid', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { role } = validationResult.data;

    // Check if target user exists
    const { data: targetUser, error: targetError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('id', userId)
      .single();

    if (targetError || !targetUser) {
      return NextResponse.json({ error: 'Utilizatorul nu a fost găsit' }, { status: 404 });
    }

    // Prevent self-demotion from admin
    if (userId === user.id && targetUser.role?.toUpperCase() === 'ADMIN' && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Nu îți poți elimina propriul rol de administrator' },
        { status: 400 }
      );
    }

    // Update role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating role:', updateError);
      return NextResponse.json({ error: 'Eroare la actualizarea rolului' }, { status: 500 });
    }

    // Log the role change (could be stored in an audit_logs table)
    console.log(`Admin ${user.id} changed role of ${userId} from ${targetUser.role} to ${role}`);

    return NextResponse.json({
      message: 'Rolul a fost actualizat cu succes',
      user: {
        id: userId,
        previousRole: targetUser.role,
        newRole: role,
      },
    });
  } catch (error) {
    console.error('Error in PATCH /api/admin/users/[userId]/role:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
