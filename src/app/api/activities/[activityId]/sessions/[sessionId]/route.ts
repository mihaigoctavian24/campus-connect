import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface UpdateSessionRequest {
  date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  max_participants?: number;
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ activityId: string; sessionId: string }> }
) {
  try {
    const { activityId, sessionId } = await params;
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
        { error: 'Only the activity creator can update sessions' },
        { status: 403 }
      );
    }

    // Verify session exists and belongs to this activity
    const { data: existingSession, error: sessionCheckError } = await supabase
      .schema('public')
      .from('sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('activity_id', activityId)
      .is('deleted_at', null)
      .single();

    if (sessionCheckError || !existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Parse update data
    const updates: UpdateSessionRequest = await request.json();

    // Update session with provided fields
    const updateData: any = {
      ...(updates.date && { date: updates.date }),
      ...(updates.start_time && { start_time: updates.start_time }),
      ...(updates.end_time && { end_time: updates.end_time }),
      ...(updates.location && { location: updates.location }),
      ...(updates.max_participants !== undefined && {
        max_participants: updates.max_participants,
      }),
      ...(updates.status && { status: updates.status }),
      updated_at: new Date().toISOString(),
    };

    const { data: updatedSession, error: updateError } = await supabase
      .schema('public')
      .from('sessions')
      // @ts-expect-error - Supabase type inference issue with activity_sessions table
      .update(updateData)
      .eq('id', sessionId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating session:', updateError);
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: 'Session updated successfully',
        session: updatedSession,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ activityId: string; sessionId: string }> }
) {
  try {
    const { activityId, sessionId } = await params;
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
        { error: 'Only the activity creator can delete sessions' },
        { status: 403 }
      );
    }

    // Verify session exists and belongs to this activity
    const { data: existingSession, error: sessionCheckError } = await supabase
      .schema('public')
      .from('sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('activity_id', activityId)
      .is('deleted_at', null)
      .single();

    if (sessionCheckError || !existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Soft delete the session
    const deleteData: any = {
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: deleteError } = await supabase
      .schema('public')
      .from('sessions')
      // @ts-expect-error - Supabase type inference issue with activity_sessions table
      .update(deleteData)
      .eq('id', sessionId);

    if (deleteError) {
      console.error('Error deleting session:', deleteError);
      return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: 'Session deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
