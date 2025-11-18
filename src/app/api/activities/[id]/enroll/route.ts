import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema matching the frontend
const enrollmentSchema = z.object({
  motivation: z.string().min(50).max(1000),
  availability: z.string().min(10).max(500),
  experience: z.string().max(500).optional().or(z.literal('')),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: activityId } = await params;

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Nu ești autentificat' }, { status: 401 });
    }

    // Verify user is a student
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: string }>();

    if (profileError || !profile) {
      return NextResponse.json({ message: 'Profil negăsit' }, { status: 404 });
    }

    if (profile.role !== 'STUDENT') {
      return NextResponse.json(
        { message: 'Doar studenții pot aplica la activități' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = enrollmentSchema.parse(body);

    // Check if activity exists and is open
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('id, title, created_by, max_participants, current_participants, status')
      .eq('id', activityId)
      .is('deleted_at', null)
      .single<{
        id: string;
        title: string;
        created_by: string;
        max_participants: number;
        current_participants: number;
        status: string;
      }>();

    if (activityError || !activity) {
      return NextResponse.json({ message: 'Activitatea nu a fost găsită' }, { status: 404 });
    }

    if (activity.status !== 'OPEN') {
      return NextResponse.json(
        { message: 'Această activitate nu este deschisă pentru aplicații' },
        { status: 400 }
      );
    }

    // Check if activity is full
    if (activity.current_participants >= activity.max_participants) {
      return NextResponse.json({ message: 'Activitatea este completă' }, { status: 400 });
    }

    // Check if user already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id, status')
      .eq('activity_id', activityId)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .maybeSingle<{ id: string; status: string }>();

    if (existingEnrollment) {
      if (existingEnrollment.status === 'CONFIRMED') {
        return NextResponse.json(
          { message: 'Ești deja înscris la această activitate' },
          { status: 400 }
        );
      }
      if (existingEnrollment.status === 'PENDING') {
        return NextResponse.json(
          { message: 'Ai deja o aplicație în așteptare pentru această activitate' },
          { status: 400 }
        );
      }
    }

    // Create enrollment
    const enrollmentData = {
      activity_id: activityId,
      user_id: user.id,
      status: 'PENDING',
      motivation: validatedData.motivation,
      availability: validatedData.availability,
      experience: validatedData.experience || null,
      attendance_status: 'PENDING',
    };

    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      // @ts-ignore - Database types haven't been regenerated after migration
      .insert(enrollmentData)
      .select()
      .single<{
        id: string;
        activity_id: string;
        user_id: string;
        status: string;
      }>();

    if (enrollmentError) {
      console.error('Enrollment error:', enrollmentError);
      return NextResponse.json(
        { message: 'Eroare la crearea aplicației. Te rugăm să încerci din nou.' },
        { status: 500 }
      );
    }

    // Get professor details for notification
    const { data: professor } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name')
      .eq('id', activity.created_by)
      .single<{ id: string; email: string; first_name: string; last_name: string }>();

    // Get student details for notification
    const { data: student } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('id', user.id)
      .single<{ email: string; first_name: string; last_name: string }>();

    // TODO: Send email notification to professor
    // This will be implemented when we set up email service
    console.log('TODO: Send email notification to professor', {
      professorEmail: professor?.email,
      studentName: `${student?.first_name} ${student?.last_name}`,
      activityTitle: activity.title,
    });

    return NextResponse.json(
      {
        message: 'Aplicația a fost trimisă cu succes',
        enrollment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enroll API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Date invalide',
          errors: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'A apărut o eroare la procesarea aplicației' },
      { status: 500 }
    );
  }
}
