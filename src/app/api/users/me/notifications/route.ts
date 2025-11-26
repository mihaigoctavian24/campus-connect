import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for notification preferences
const notificationPreferencesSchema = z.object({
  email_applications: z.boolean(),
  email_hours: z.boolean(),
  email_activity_updates: z.boolean(),
  email_reminders: z.boolean(),
  email_general: z.boolean(),
  in_app_applications: z.boolean(),
  in_app_hours: z.boolean(),
  in_app_activity_updates: z.boolean(),
  in_app_reminders: z.boolean(),
  in_app_general: z.boolean(),
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

    // Get notification preferences from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('notification_preferences')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching notification preferences:', profileError);
      return NextResponse.json(
        { error: 'Eroare la preluarea preferințelor' },
        { status: 500 }
      );
    }

    // Return preferences or defaults if not set
    const defaultPreferences = {
      email_applications: true,
      email_hours: true,
      email_activity_updates: true,
      email_reminders: true,
      email_general: false,
      in_app_applications: true,
      in_app_hours: true,
      in_app_activity_updates: true,
      in_app_reminders: true,
      in_app_general: true,
    };

    return NextResponse.json(profile?.notification_preferences || defaultPreferences);
  } catch (error) {
    console.error('Error in GET /api/users/me/notifications:', error);
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
    const validationResult = notificationPreferencesSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Date invalide',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const preferences = validationResult.data;

    // Update notification preferences in profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        notification_preferences: preferences,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating notification preferences:', updateError);
      return NextResponse.json(
        { error: 'Eroare la actualizarea preferințelor' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Preferințele au fost actualizate cu succes',
      preferences,
    });
  } catch (error) {
    console.error('Error in PUT /api/users/me/notifications:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
