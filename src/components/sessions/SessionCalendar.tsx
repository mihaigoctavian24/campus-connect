'use client';

import { useState, useEffect } from 'react';
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
import { Clock, MapPin, Users, Edit2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { CheckInButton } from './CheckInButton';
import { ManualCheckInNotice } from './ManualCheckInNotice';
import {
  format,
  parseISO,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
} from 'date-fns';
import { ro } from 'date-fns/locale';
import { cn } from '@/components/ui/utils';

interface Session {
  id: string;
  activity_id: string;
  activity_title?: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants: number | null;
  status: string | null;
  qr_code_data?: string | null;
  reminder_sent: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface SessionCalendarProps {
  activityId?: string | null;
  sessions?: Session[];
  onSessionUpdate?: () => void;
  viewMode?: 'professor' | 'student';
}

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-300',
  IN_PROGRESS: 'bg-green-100 text-green-800 border-green-300',
  COMPLETED: 'bg-gray-100 text-gray-800 border-gray-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
};

const statusLabels: Record<string, string> = {
  SCHEDULED: 'Programată',
  IN_PROGRESS: 'În Desfășurare',
  COMPLETED: 'Finalizată',
  CANCELLED: 'Anulată',
};

export function SessionCalendar({
  activityId,
  sessions: propSessions,
  onSessionUpdate,
  viewMode = 'professor',
}: SessionCalendarProps) {
  const [sessions, setSessions] = useState<Session[]>(propSessions || []);
  const [loading, setLoading] = useState(!propSessions);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (propSessions) {
      setSessions(propSessions);
      setLoading(false);
    } else if (activityId) {
      loadActivityAndSessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId, propSessions]);

  async function loadActivityAndSessions() {
    if (!activityId) return;

    try {
      setLoading(true);

      // Load sessions for specific activity
      const response = await fetch(`/api/activities/${activityId}/sessions`);
      if (response.ok) {
        const data = await response.json();
        const sessionsWithTitle = data.sessions.map((s: Session) => ({
          ...s,
          activity_title: data.activityTitle,
        }));
        setSessions(sessionsWithTitle || []);
      }
    } catch (error) {
      console.error('Error loading activity and sessions:', error);
    } finally {
      setLoading(false);
    }
  }

  // Get sessions for the selected date
  const selectedDateSessions = sessions.filter((session) => {
    const sessionDate = parseISO(session.date);
    return isSameDay(sessionDate, selectedDate);
  });

  // Check if a date has sessions
  const hasSessionsOnDate = (date: Date) => {
    return sessions.some((session) => {
      const sessionDate = parseISO(session.date);
      return isSameDay(sessionDate, date);
    });
  };

  function handleSessionClick(session: Session) {
    setSelectedSession(session);
    setIsDetailsOpen(true);
  }

  async function handleCancelSession(session: Session) {
    if (!confirm('Sigur vrei să anulezi această sesiune?')) return;

    try {
      const response = await fetch(
        `/api/activities/${session.activity_id}/sessions/${session.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'CANCELLED' }),
        }
      );

      if (response.ok) {
        if (propSessions) {
          // If using propSessions, notify parent to refresh
          onSessionUpdate?.();
        } else {
          // If using activityId, reload locally
          await loadActivityAndSessions();
        }
        setIsDetailsOpen(false);
      }
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  }

  // Render custom calendar
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const firstDayOfWeek = monthStart.getDay();
    const calendarDays: (Date | null)[] = [...Array(firstDayOfWeek).fill(null), ...daysInMonth];

    return (
      <div className="space-y-3">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="h-7 w-7"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {format(currentMonth, 'MMMM yyyy', { locale: ro })}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="h-7 w-7"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, index) => (
                <th
                  key={index}
                  className="text-center text-xs font-normal text-muted-foreground p-2"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => (
              <tr key={weekIndex}>
                {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                  if (!day) {
                    return <td key={dayIndex} className="p-1" />;
                  }

                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isTodayDate = isToday(day);
                  const hasSessions = hasSessionsOnDate(day);

                  return (
                    <td key={dayIndex} className="p-0.5 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          'w-8 h-8 rounded-md text-xs transition-colors relative',
                          !isCurrentMonth && 'text-muted-foreground opacity-50',
                          isSelected && 'bg-primary text-primary-foreground font-medium',
                          !isSelected && isTodayDate && 'bg-accent text-accent-foreground',
                          !isSelected &&
                            !isTodayDate &&
                            'hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        {format(day, 'd')}
                        {hasSessions && (
                          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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
        <CardContent>{renderCalendar()}</CardContent>
      </Card>

      {/* Sessions List for Selected Date */}
      <Card>
        <CardHeader>
          <CardTitle>{format(selectedDate, 'd MMMM yyyy', { locale: ro })}</CardTitle>
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
                  className="border rounded-lg p-3 hover:bg-accent cursor-pointer transition-colors group"
                  onClick={() => handleSessionClick(session)}
                >
                  {/* Activity Title + Status Badge */}
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm group-hover:text-white line-clamp-1">
                      {session.activity_title || 'Activitate'}
                    </h4>
                    <Badge
                      className={`${session.status ? statusColors[session.status] || 'bg-gray-100 text-gray-800 border-gray-300' : 'bg-gray-100 text-gray-800 border-gray-300'} ml-2 shrink-0`}
                      variant="outline"
                    >
                      {session.status ? statusLabels[session.status] || 'Unknown' : 'Unknown'}
                    </Badge>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-white mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {session.start_time} - {session.end_time}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-white">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="line-clamp-1">{session.location}</span>
                    {session.max_participants && (
                      <>
                        <span className="mx-1">•</span>
                        <Users className="h-3.5 w-3.5" />
                        <span>Max. {session.max_participants}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl">
              {selectedSession?.activity_title || 'Activitate'}
            </DialogTitle>
            <div className="flex items-center justify-between">
              <DialogDescription className="text-base">
                {selectedSession &&
                  format(parseISO(selectedSession.date), 'EEEE, d MMMM yyyy', { locale: ro })}
              </DialogDescription>
              {selectedSession && selectedSession.status && (
                <Badge
                  className={
                    statusColors[selectedSession.status] ||
                    'bg-gray-100 text-gray-800 border-gray-300'
                  }
                  variant="outline"
                >
                  {statusLabels[selectedSession.status] || 'Unknown'}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-6 py-4">
              {/* Time */}
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border border-border/50">
                <div className="mt-0.5 p-2 bg-background rounded-md">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Interval Orar
                  </div>
                  <div className="text-lg font-semibold">
                    {selectedSession.start_time} - {selectedSession.end_time}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border border-border/50">
                <div className="mt-0.5 p-2 bg-background rounded-md">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Locație</div>
                  <div className="text-lg font-semibold">{selectedSession.location}</div>
                </div>
              </div>

              {/* Max Participants */}
              {selectedSession.max_participants && (
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border border-border/50">
                  <div className="mt-0.5 p-2 bg-background rounded-md">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Participanți Maxim
                    </div>
                    <div className="text-lg font-semibold">{selectedSession.max_participants}</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {viewMode === 'professor' && selectedSession.status === 'SCHEDULED' && (
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" disabled>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editează
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleCancelSession(selectedSession)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Anulează
                  </Button>
                </div>
              )}

              {viewMode === 'student' && selectedSession.status === 'SCHEDULED' && (
                <div className="pt-2">
                  {selectedSession.qr_code_data ? (
                    <div className="flex justify-center">
                      <CheckInButton
                        activityId={selectedSession.activity_id}
                        sessionId={selectedSession.id}
                        sessionTitle={selectedSession.activity_title || 'Activitate'}
                        onCheckInSuccess={() => {
                          setIsDetailsOpen(false);
                          onSessionUpdate?.();
                        }}
                      />
                    </div>
                  ) : (
                    <ManualCheckInNotice
                      session={{
                        date: selectedSession.date,
                        start_time: selectedSession.start_time,
                        end_time: selectedSession.end_time,
                        location: selectedSession.location,
                        activity_title: selectedSession.activity_title,
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
