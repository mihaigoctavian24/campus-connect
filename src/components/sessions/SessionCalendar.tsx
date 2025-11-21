'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Clock, MapPin, Users, Edit2, XCircle } from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';
import { ro } from 'date-fns/locale';

interface Session {
  id: string;
  activity_id: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants: number | null;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface SessionCalendarProps {
  activityId: string;
  onSessionUpdate?: () => void;
}

const statusColors = {
  SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-300',
  IN_PROGRESS: 'bg-green-100 text-green-800 border-green-300',
  COMPLETED: 'bg-gray-100 text-gray-800 border-gray-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
};

const statusLabels = {
  SCHEDULED: 'Programată',
  IN_PROGRESS: 'În Desfășurare',
  COMPLETED: 'Finalizată',
  CANCELLED: 'Anulată',
};

export function SessionCalendar({ activityId, onSessionUpdate }: SessionCalendarProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId]);

  async function loadSessions() {
    try {
      setLoading(true);
      const response = await fetch(`/api/activities/${activityId}/sessions`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  }

  // Get sessions for the selected date
  const selectedDateSessions = sessions.filter((session) => {
    if (!selectedDate) return false;
    const sessionDate = parseISO(session.date);
    return isSameDay(sessionDate, selectedDate);
  });

  // Get all dates that have sessions
  const sessionDates = sessions.map((session) => parseISO(session.date));

  // Custom day renderer to show dots for sessions
  const modifiers = {
    hasSession: sessionDates,
  };

  const modifiersClassNames = {
    hasSession:
      'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full',
  };

  function handleSessionClick(session: Session) {
    setSelectedSession(session);
    setIsDetailsOpen(true);
  }

  async function handleCancelSession(sessionId: string) {
    if (!confirm('Sigur vrei să anulezi această sesiune?')) return;

    try {
      const response = await fetch(`/api/activities/${activityId}/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });

      if (response.ok) {
        await loadSessions();
        onSessionUpdate?.();
        setIsDetailsOpen(false);
      }
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">Se încarcă sesiunile...</div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Nicio sesiune programată</p>
            <p className="text-sm">Programează prima sesiune pentru această activitate</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar Sesiuni</CardTitle>
          <CardDescription>Selectează o dată pentru a vedea sesiunile</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            locale={ro}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Sessions List for Selected Date */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate
              ? format(selectedDate, 'd MMMM yyyy', { locale: ro })
              : 'Selectează o dată'}
          </CardTitle>
          <CardDescription>
            {selectedDateSessions.length > 0
              ? `${selectedDateSessions.length} ${selectedDateSessions.length === 1 ? 'sesiune' : 'sesiuni'}`
              : 'Nicio sesiune'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDateSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nicio sesiune în această zi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateSessions.map((session) => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => handleSessionClick(session)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {session.start_time} - {session.end_time}
                      </span>
                    </div>
                    <Badge className={statusColors[session.status]} variant="outline">
                      {statusLabels[session.status]}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{session.location}</span>
                  </div>

                  {session.max_participants && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Users className="h-4 w-4" />
                      <span>Max. {session.max_participants} participanți</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalii Sesiune</DialogTitle>
            <DialogDescription>
              {selectedSession &&
                format(parseISO(selectedSession.date), 'd MMMM yyyy', { locale: ro })}
            </DialogDescription>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex justify-center">
                <Badge className={statusColors[selectedSession.status]} variant="outline">
                  {statusLabels[selectedSession.status]}
                </Badge>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Interval Orar</div>
                  <div className="font-medium">
                    {selectedSession.start_time} - {selectedSession.end_time}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Locație</div>
                  <div className="font-medium">{selectedSession.location}</div>
                </div>
              </div>

              {/* Max Participants */}
              {selectedSession.max_participants && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Participanți Maxim</div>
                    <div className="font-medium">{selectedSession.max_participants}</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedSession.status === 'SCHEDULED' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" className="flex-1" disabled>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editează
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleCancelSession(selectedSession.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Anulează
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
