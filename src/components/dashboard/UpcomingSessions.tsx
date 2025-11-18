'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionCard } from './SessionCard';

export interface UpcomingSession {
  id: string;
  activityTitle: string;
  activityCategory: string;
  date: string; // ISO date string
  startTime: string;
  endTime: string;
  location: string;
  enrollmentStatus: string;
}

interface UpcomingSessionsProps {
  sessions: UpcomingSession[];
  loading?: boolean;
}

export function UpcomingSessions({ sessions, loading = false }: UpcomingSessionsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Your next scheduled activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading sessions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort sessions by date (earliest first)
  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });

  // Show only next 5 upcoming sessions
  const upcomingSessions = sortedSessions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
        <CardDescription>Your next scheduled activities</CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingSessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No upcoming sessions. Check out new opportunities to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
