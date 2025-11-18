'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns';
import { Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Session {
  date: Date;
  title: string;
  time?: string;
  location?: string;
}

interface MiniCalendarProps {
  sessions?: Session[];
  onDateSelect?: (date: Date | undefined) => void;
}

export function MiniCalendar({ sessions = [], onDateSelect }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = monthStart.getDay();

  // Create array for calendar grid
  const calendarDays: (Date | null)[] = [...Array(firstDayOfWeek).fill(null), ...daysInMonth];

  const sessionDates = sessions.map((session) => session.date);
  const selectedDateSessions = selected
    ? sessions.filter((session) => isSameDay(session.date, selected))
    : [];

  const handleSelect = (date: Date) => {
    setSelected(date);
    onDateSelect?.(date);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const hasSession = (date: Date) => {
    return sessionDates.some((sessionDate) => isSameDay(sessionDate, date));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="icon" onClick={handlePrevMonth} className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">{format(currentMonth, 'MMMM yyyy')}</div>
          <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-7 w-7">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <th key={day} className="text-center text-xs font-normal text-muted-foreground p-2">
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

                  const isSelected = selected && isSameDay(day, selected);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isTodayDate = isToday(day);
                  const hasSessionDate = hasSession(day);

                  return (
                    <td key={dayIndex} className="p-1 text-center">
                      <button
                        onClick={() => handleSelect(day)}
                        className={`
                          w-8 h-8 rounded-md text-sm transition-colors
                          ${!isCurrentMonth ? 'text-muted-foreground opacity-50' : ''}
                          ${isSelected ? 'bg-primary text-primary-foreground font-medium' : ''}
                          ${!isSelected && isTodayDate ? 'bg-accent text-accent-foreground' : ''}
                          ${!isSelected && !isTodayDate && hasSessionDate ? 'bg-primary/10 font-medium' : ''}
                          ${!isSelected && !isTodayDate && !hasSessionDate ? 'hover:bg-accent' : ''}
                        `}
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

        {/* Selected Date Sessions */}
        {selected && selectedDateSessions.length > 0 && (
          <div className="pt-4 border-t mt-4 space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">
              {format(selected, 'EEEE, MMMM d')}
            </p>
            {selectedDateSessions.map((session, index) => (
              <div key={index} className="text-sm space-y-2 p-3 rounded-lg bg-gray-100 border">
                <p className="font-semibold">{session.title}</p>
                {session.time && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{session.time}</span>
                  </div>
                )}
                {session.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{session.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selected && selectedDateSessions.length === 0 && (
          <div className="pt-4 border-t mt-4">
            <p className="text-sm text-muted-foreground text-center">
              No sessions on {format(selected, 'MMMM d')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
