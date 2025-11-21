import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import type { Database } from '@/types/database.types';

// Validation schema for activity creation
const activitySchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(50).max(2000),
  category_id: z.string().min(1),
  department_id: z.string().min(1),
  location: z.string().min(5),
  max_participants: z.number().min(1).max(500),
  eligibility_criteria: z.string().max(500).optional().or(z.literal('')),
  date: z.string().min(1),
  start_time: z.string().min(1),
  end_time: z.string().min(1),
  status: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Nu ești autentificat' }, { status: 401 });
    }

    // Verify user is a professor
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: string }>();

    if (profileError || !profile) {
      return NextResponse.json({ message: 'Profil negăsit' }, { status: 404 });
    }

    if (profile.role !== 'PROFESSOR') {
      return NextResponse.json(
        { message: 'Doar profesorii pot crea activități' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = activitySchema.parse(body);

    // Create the activity
    const activityData: Database['public']['Tables']['activities']['Insert'] = {
      title: validatedData.title,
      description: validatedData.description,
      category_id: validatedData.category_id,
      department_id: validatedData.department_id,
      location: validatedData.location,
      max_participants: validatedData.max_participants,
      eligibility_criteria: validatedData.eligibility_criteria || null,
      date: validatedData.date,
      start_time: validatedData.start_time,
      end_time: validatedData.end_time,
      status: validatedData.status || 'OPEN',
      created_by: user.id,
      current_participants: 0,
    };

    const { data: activity, error: createError } = await supabase
      .from('activities')
      .insert(activityData as any) // TypeScript issue with Supabase generated types
      .select('id, title')
      .single<{ id: string; title: string }>();

    if (createError) {
      console.error('Error creating activity:', createError);
      return NextResponse.json(
        { message: 'Eroare la crearea activității', error: createError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Activitate creată cu succes',
        id: activity.id,
        title: activity.title,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Activity creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Date invalide', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Eroare internă la crearea activității' },
      { status: 500 }
    );
  }
}
