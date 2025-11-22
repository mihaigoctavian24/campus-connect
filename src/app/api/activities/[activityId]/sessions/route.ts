import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Types for session creation
interface SessionData {
  date: string; // ISO date format YYYY-MM-DD
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  location: string;
  max_participants?: number;
}

interface CreateSessionRequest {
  session: SessionData;
  recurring: {
    pattern: 'NONE' | 'WEEKLY' | 'BIWEEKLY' | 'CUSTOM';
    end_date?: string; // ISO date format - required for recurring patterns
    custom_days?: number[]; // Array of day numbers (0-6, 0=Sunday) for CUSTOM pattern
  };
}

// Generate sessions based on recurring pattern
function generateRecurringSessions(
  baseSession: SessionData,
  pattern: string,
  endDate: string | undefined,
  customDays: number[] | undefined
): SessionData[] {
  const sessions: SessionData[] = [];

  if (pattern === 'NONE') {
    return [baseSession];
  }

  if (!endDate) {
    throw new Error('end_date is required for recurring sessions');
  }

  const startDate = new Date(baseSession.date);
  const finalDate = new Date(endDate);
  // eslint-disable-next-line prefer-const
  let currentDate = new Date(startDate);

  // Limit to prevent infinite loops - max 52 weeks (1 year)
  const maxIterations = 365;
  let iterations = 0;

  while (currentDate <= finalDate && iterations < maxIterations) {
    iterations++;

    if (pattern === 'WEEKLY') {
      sessions.push({
        ...baseSession,
        date: currentDate.toISOString().split('T')[0],
      });
      currentDate.setDate(currentDate.getDate() + 7);
    } else if (pattern === 'BIWEEKLY') {
      sessions.push({
        ...baseSession,
        date: currentDate.toISOString().split('T')[0],
      });
      currentDate.setDate(currentDate.getDate() + 14);
    } else if (pattern === 'CUSTOM' && customDays && customDays.length > 0) {
      const currentDayOfWeek = currentDate.getDay();
      if (customDays.includes(currentDayOfWeek)) {
        sessions.push({
          ...baseSession,
          date: currentDate.toISOString().split('T')[0],
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      break;
    }
  }

  return sessions;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ activityId: string }> }
) {
  try {
    const { activityId } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify professor owns this activity
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('created_by')
      .eq('id', activityId)
      .is('deleted_at', null)
      .single<{ created_by: string }>();

    if (activityError || !activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    if (activity.created_by !== user.id) {
      return NextResponse.json(
        { error: 'Only the activity creator can manage sessions' },
        { status: 403 }
      );
    }

    // Parse request body
    const body: CreateSessionRequest = await request.json();
    const { session, recurring } = body;

    // Validate required fields
    if (!session.date || !session.start_time || !session.end_time || !session.location) {
      return NextResponse.json(
        { error: 'Missing required fields: date, start_time, end_time, location' },
        { status: 400 }
      );
    }

    // Generate sessions based on recurring pattern
    const sessionsToCreate = generateRecurringSessions(
      session,
      recurring.pattern,
      recurring.end_date,
      recurring.custom_days
    );

    // Prepare session records for database insertion
    const sessionRecords = sessionsToCreate.map((sess) => ({
      activity_id: activityId,
      date: sess.date,
      start_time: sess.start_time,
      end_time: sess.end_time,
      location: sess.location,
      max_participants: sess.max_participants || null,
      status: 'SCHEDULED',
      reminder_sent: false,
    }));

    // Insert all sessions into database
    const { data: createdSessions, error: insertError } = await supabase
      .schema('public')
      .from('sessions')
      .insert(sessionRecords)
      .select();

    if (insertError) {
      console.error('Error creating sessions:', insertError);
      return NextResponse.json({ error: 'Failed to create sessions' }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: `Successfully created ${createdSessions.length} session(s)`,
        sessions: createdSessions,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ activityId: string }> }
) {
  try {
    const { activityId } = await params;
    const supabase = await createClient();

    // Get activity title
    const { data: activity } = await supabase
      .from('activities')
      .select('title')
      .eq('id', activityId)
      .single<{ title: string }>();

    // Get sessions for this activity
    const { data: sessions, error } = await supabase
      .schema('public')
      .from('sessions')
      .select('*')
      .eq('activity_id', activityId)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching sessions:', error);
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }

    return NextResponse.json(
      {
        sessions,
        activityTitle: activity?.title || '',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
