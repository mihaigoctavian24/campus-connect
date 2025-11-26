import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Update professor notes for an enrollment
 * Only the activity creator (professor) can add/update notes
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ activityId: string; enrollmentId: string }> }
) {
  try {
    const { activityId, enrollmentId } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Nu ești autentificat' }, { status: 401 });
    }

    // Get user profile to verify role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ message: 'Profil negăsit' }, { status: 404 });
    }

    // Only professors can add notes
    if (profile.role !== 'professor') {
      return NextResponse.json({ message: 'Nu ai permisiunea să adaugi notițe' }, { status: 403 });
    }

    // Verify the activity belongs to this professor
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('created_by')
      .eq('id', activityId)
      .single();

    if (activityError || !activity) {
      return NextResponse.json({ message: 'Activitate negăsită' }, { status: 404 });
    }

    if (activity.created_by !== user.id) {
      return NextResponse.json(
        { message: 'Nu ai permisiunea să modifici această activitate' },
        { status: 403 }
      );
    }

    // Verify enrollment exists and belongs to this activity
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('id', enrollmentId)
      .eq('activity_id', activityId)
      .single();

    if (enrollmentError || !enrollment) {
      return NextResponse.json({ message: 'Înscriere negăsită' }, { status: 404 });
    }

    // Get notes from request body
    const body = await request.json();
    const { professor_notes } = body;

    // Update professor notes
    const { error: updateError } = await supabase
      .from('enrollments')
      .update({
        professor_notes: professor_notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', enrollmentId);

    if (updateError) {
      console.error('Error updating professor notes:', updateError);
      return NextResponse.json({ message: 'Eroare la salvarea notițelor' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Notițe salvate cu succes',
      professor_notes,
    });
  } catch (error) {
    console.error('Update professor notes error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}
