'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  isBefore,
  startOfDay,
} from 'date-fns';
import { CalendarIcon, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { TimePicker } from '@/components/ui/time-picker';

interface SessionData {
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants?: number;
}

interface SessionSchedulerProps {
  activityId: string;
  onSessionsCreated?: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Duminică' },
  { value: 1, label: 'Luni' },
  { value: 2, label: 'Marți' },
  { value: 3, label: 'Miercuri' },
  { value: 4, label: 'Joi' },
  { value: 5, label: 'Vineri' },
  { value: 6, label: 'Sâmbătă' },
];

export function SessionScheduler({ activityId, onSessionsCreated }: SessionSchedulerProps) {
  // Calendar state for start date
  const [startCalendarMonth, setStartCalendarMonth] = useState(new Date());
  const [sessionDate, setSessionDate] = useState<Date>();

  // Calendar state for end date
  const [endCalendarMonth, setEndCalendarMonth] = useState(new Date());
  const [recurringEndDate, setRecurringEndDate] = useState<Date>();

  // Form state
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>();

  // Recurring pattern state
  const [recurringPattern, setRecurringPattern] = useState<
    'NONE' | 'WEEKLY' | 'BIWEEKLY' | 'CUSTOM'
  >('NONE');
  const [customDays, setCustomDays] = useState<number[]>([]);

  // Preview and submission state
  const [previewSessions, setPreviewSessions] = useState<SessionData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate preview sessions
  const handleGeneratePreview = () => {
    if (!sessionDate || !startTime || !endTime || !location) {
      setError('Vă rugăm completați toate câmpurile obligatorii');
      return;
    }

    setError(null);
    const sessions: SessionData[] = [];
    const baseDate = new Date(sessionDate);
    const endDate =
      recurringPattern !== 'NONE' && recurringEndDate ? new Date(recurringEndDate) : baseDate;

    // eslint-disable-next-line prefer-const
    let currentDate = new Date(baseDate);

    if (recurringPattern === 'NONE') {
      sessions.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        start_time: startTime,
        end_time: endTime,
        location,
        max_participants: maxParticipants,
      });
    } else if (recurringPattern === 'WEEKLY') {
      while (currentDate <= endDate) {
        sessions.push({
          date: format(currentDate, 'yyyy-MM-dd'),
          start_time: startTime,
          end_time: endTime,
          location,
          max_participants: maxParticipants,
        });
        currentDate.setDate(currentDate.getDate() + 7);
      }
    } else if (recurringPattern === 'BIWEEKLY') {
      while (currentDate <= endDate) {
        sessions.push({
          date: format(currentDate, 'yyyy-MM-dd'),
          start_time: startTime,
          end_time: endTime,
          location,
          max_participants: maxParticipants,
        });
        currentDate.setDate(currentDate.getDate() + 14);
      }
    } else if (recurringPattern === 'CUSTOM' && customDays.length > 0) {
      const maxIterations = 365;
      let iterations = 0;

      while (currentDate <= endDate && iterations < maxIterations) {
        iterations++;
        const dayOfWeek = currentDate.getDay();

        if (customDays.includes(dayOfWeek)) {
          sessions.push({
            date: format(currentDate, 'yyyy-MM-dd'),
            start_time: startTime,
            end_time: endTime,
            location,
            max_participants: maxParticipants,
          });
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    setPreviewSessions(sessions);
  };

  // Handle custom days toggle
  const toggleCustomDay = (dayValue: number) => {
    setCustomDays((prev) =>
      prev.includes(dayValue) ? prev.filter((d) => d !== dayValue) : [...prev, dayValue].sort()
    );
  };

  // Submit sessions to API
  const handleSubmit = async () => {
    if (previewSessions.length === 0) {
      setError('Generați mai întâi previzualizarea sesiunilor');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/activities/${activityId}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: previewSessions[0],
          recurring: {
            pattern: recurringPattern,
            end_date: recurringEndDate ? format(recurringEndDate, 'yyyy-MM-dd') : undefined,
            custom_days: recurringPattern === 'CUSTOM' ? customDays : undefined,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create sessions');
      }

      await response.json();

      // Reset form
      setSessionDate(undefined);
      setStartTime('');
      setEndTime('');
      setLocation('');
      setMaxParticipants(undefined);
      setRecurringPattern('NONE');
      setRecurringEndDate(undefined);
      setCustomDays([]);
      setPreviewSessions([]);

      onSessionsCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la crearea sesiunilor');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render calendar function (reusable for both start and end date)
  const renderCalendar = (
    currentMonth: Date,
    selectedDate: Date | undefined,
    onMonthChange: (date: Date) => void,
    onDateSelect: (date: Date) => void,
    minDate?: Date
  ) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const firstDayOfWeek = monthStart.getDay();
    const calendarDays: (Date | null)[] = [...Array(firstDayOfWeek).fill(null), ...daysInMonth];
    const today = startOfDay(new Date());

    return (
      <div className="space-y-3">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onMonthChange(subMonths(currentMonth, 1))}
            className="h-7 w-7"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">{format(currentMonth, 'MMMM yyyy')}</div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onMonthChange(addMonths(currentMonth, 1))}
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

                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isTodayDate = isToday(day);
                  const isPast = minDate ? isBefore(day, minDate) : isBefore(day, today);

                  return (
                    <td key={dayIndex} className="p-0.5 text-center">
                      <button
                        type="button"
                        onClick={() => !isPast && onDateSelect(day)}
                        disabled={isPast}
                        className={cn(
                          'w-8 h-8 rounded-md text-xs transition-colors',
                          !isCurrentMonth && 'text-muted-foreground opacity-50',
                          isSelected && 'bg-primary text-primary-foreground font-medium',
                          !isSelected && isTodayDate && 'bg-accent text-accent-foreground',
                          !isSelected &&
                            !isTodayDate &&
                            !isPast &&
                            'hover:bg-accent hover:text-accent-foreground',
                          isPast && 'opacity-30 cursor-not-allowed'
                        )}
                      >
                        {format(day, 'd')}
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

  return (
    <div className="space-y-6">
      {/* Session Form */}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left Column - Form Fields */}
        <div className="space-y-6">
          {/* Date & Time Card */}
          <Card>
            <CardHeader>
              <CardTitle>Data și Ora</CardTitle>
              <CardDescription>Selectează data și intervalul orar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Start Date Calendar */}
              <div className="space-y-2">
                <Label>Data Primei Sesiuni *</Label>
                <div className="border rounded-lg p-3">
                  {renderCalendar(
                    startCalendarMonth,
                    sessionDate,
                    setStartCalendarMonth,
                    setSessionDate
                  )}
                </div>
              </div>

              {/* Time Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Ora Început *</Label>
                  <TimePicker value={startTime} onChange={setStartTime} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">Ora Sfârșit *</Label>
                  <TimePicker value={endTime} onChange={setEndTime} />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Locație *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="ex. Sala A101, Corp C"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Max Participants */}
              <div className="space-y-2">
                <Label htmlFor="max-participants">Nr. Maxim Participanți (opțional)</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="max-participants"
                    type="number"
                    min="1"
                    placeholder="Fără limită"
                    value={maxParticipants ?? ''}
                    onChange={(e) =>
                      setMaxParticipants(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Pattern Recurent, Preview & Actions */}
        <div className="space-y-6">
          {/* Recurring Pattern Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pattern Recurent</CardTitle>
              <CardDescription>Configurează repetarea sesiunilor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recurring Pattern Selector */}
              <div className="space-y-2">
                <Label>Tip Recurență</Label>
                <Select
                  value={recurringPattern}
                  onValueChange={(value) => setRecurringPattern(value as typeof recurringPattern)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Fără repetare</SelectItem>
                    <SelectItem value="WEEKLY">Săptămânal</SelectItem>
                    <SelectItem value="BIWEEKLY">Bi-săptămânal</SelectItem>
                    <SelectItem value="CUSTOM">Zile personalizate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Recurring End Date Calendar */}
              {recurringPattern !== 'NONE' && (
                <div className="space-y-2">
                  <Label>Data Sfârșit Recurență *</Label>
                  <div className="border rounded-lg p-3">
                    {renderCalendar(
                      endCalendarMonth,
                      recurringEndDate,
                      setEndCalendarMonth,
                      setRecurringEndDate,
                      sessionDate
                    )}
                  </div>
                </div>
              )}

              {/* Custom Days Selector */}
              {recurringPattern === 'CUSTOM' && (
                <div className="space-y-2">
                  <Label>Selectați zilele săptămânii</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={customDays.includes(day.value)}
                          onCheckedChange={() => toggleCustomDay(day.value)}
                        />
                        <label
                          htmlFor={`day-${day.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button onClick={handleGeneratePreview} variant="outline" size="lg">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Generează Previzualizare
            </Button>
            {previewSessions.length > 0 && (
              <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Se salvează...' : `Salvează ${previewSessions.length} Sesiuni`}
              </Button>
            )}
          </div>

          {/* Preview Sessions */}
          {previewSessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Previzualizare Sesiuni ({previewSessions.length})</CardTitle>
                <CardDescription>Verificați sesiunile generate înainte de salvare</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 space-y-2 overflow-y-auto pr-2">
                  {previewSessions.map((session, index) => (
                    <div
                      key={index}
                      className="rounded-lg border p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-lg mb-1">
                        {format(new Date(session.date), 'EEEE, dd MMMM yyyy')}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {session.start_time} - {session.end_time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {session.location}
                        </div>
                        {session.max_participants && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Max {session.max_participants} participanți
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
