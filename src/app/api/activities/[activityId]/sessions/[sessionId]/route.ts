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
    const updateData: Partial<UpdateSessionRequest> & { updated_at?: string } = {
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
      .select('id, status')
      .eq('id', sessionId)
      .eq('activity_id', activityId)
      .is('deleted_at', null)
      .single();

    if (sessionCheckError || !existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Prevent cancelling already completed sessions
    if (existingSession.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Cannot cancel a completed session' }, { status: 400 });
    }

    // Get enrolled students for this session (for notifications)
    const { data: enrolledStudents } = await supabase
      .from('enrollments')
      .select('user_id, profiles(email, first_name, last_name)')
      .eq('activity_id', activityId)
      .eq('status', 'ACTIVE');

    // Cancel the session (set status to CANCELLED instead of soft delete)
    const cancelData: { status: string; updated_at: string } = {
      status: 'CANCELLED',
      updated_at: new Date().toISOString(),
    };

    const { error: cancelError } = await supabase
      .schema('public')
      .from('sessions')
      .update(cancelData)
      .eq('id', sessionId);

    if (cancelError) {
      console.error('Error cancelling session:', cancelError);
      return NextResponse.json({ error: 'Failed to cancel session' }, { status: 500 });
    }

    // TODO: Send notifications to enrolled students
    // This will be implemented in Week 21-22 (Platform Configuration)
    // For now, we just log the students who should be notified
    if (enrolledStudents && enrolledStudents.length > 0) {
      console.log(
        `Session ${sessionId} cancelled. ${enrolledStudents.length} students should be notified:`,
        enrolledStudents.map((e: any) => e.profiles?.email)
      );
    }

    return NextResponse.json(
      {
        message: 'Session cancelled successfully',
        notified_students: enrolledStudents?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
