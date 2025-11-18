import { Calendar, Clock, MapPin } from 'lucide-react';
import { UpcomingSession } from './UpcomingSessions';
import { Badge } from '@/components/ui/badge';

interface SessionCardProps {
  session: UpcomingSession;
}

export function SessionCard({ session }: SessionCardProps) {
  // Format date
  const sessionDate = new Date(session.date);
  const formattedDate = sessionDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Check if session is today
  const today = new Date();
  const isToday =
    sessionDate.getDate() === today.getDate() &&
    sessionDate.getMonth() === today.getMonth() &&
    sessionDate.getFullYear() === today.getFullYear();

  // Check if session is tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    sessionDate.getDate() === tomorrow.getDate() &&
    sessionDate.getMonth() === tomorrow.getMonth() &&
    sessionDate.getFullYear() === tomorrow.getFullYear();

  // Determine badge text
  let badgeText = '';
  let badgeClass = '';
  if (isToday) {
    badgeText = 'Today';
    badgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
  } else if (isTomorrow) {
    badgeText = 'Tomorrow';
    badgeClass = 'bg-purple-100 text-purple-800 border-purple-200';
  }

  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
      <Calendar className="h-5 w-5 text-primary mt-0.5" />
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium leading-tight">{session.activityTitle}</h4>
            <p className="text-sm text-muted-foreground">{session.activityCategory}</p>
          </div>
          {badgeText && (
            <Badge variant="outline" className={badgeClass}>
              {badgeText}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {session.startTime} - {session.endTime}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{session.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
