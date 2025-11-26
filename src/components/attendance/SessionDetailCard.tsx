import { format, parseISO } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, HourglassIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SessionDetailCardProps {
  attendance: {
    id: string;
    status: string;
    check_in_method: string | null;
    checked_in_at: string | null;
    hours_credited: number;
    session: {
      date: string;
      start_time: string;
      end_time: string;
      location: string;
      activity_title: string;
      activity_category: string;
    };
  };
}

const statusConfig: Record<
  string,
  {
    label: string;
    color: string;
    icon: typeof CheckCircle;
  }
> = {
  PRESENT: {
    label: 'Prezent',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
  },
  ABSENT: {
    label: 'Absent',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
  },
  PENDING: {
    label: 'În Așteptare',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: HourglassIcon,
  },
};

export function SessionDetailCard({ attendance }: SessionDetailCardProps) {
  const config = statusConfig[attendance.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  const sessionDate = parseISO(attendance.session.date);
  const formattedDate = format(sessionDate, 'EEEE, d MMMM yyyy', { locale: ro });
  const checkedInDate = attendance.checked_in_at
    ? format(parseISO(attendance.checked_in_at), 'HH:mm', { locale: ro })
    : null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Session Info */}
          <div className="flex-1 space-y-3">
            {/* Activity Title + Status */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <StatusIcon
                  className={`h-5 w-5 mt-0.5 ${config.color.includes('green') ? 'text-green-600' : config.color.includes('red') ? 'text-red-600' : 'text-yellow-600'}`}
                />
                <div>
                  <h4 className="font-semibold text-base">{attendance.session.activity_title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {attendance.session.activity_category}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={config.color}>
                {config.label}
              </Badge>
            </div>

            {/* Date, Time, Location */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground ml-8">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span className="capitalize">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>
                  {attendance.session.start_time.substring(0, 5)} -{' '}
                  {attendance.session.end_time.substring(0, 5)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{attendance.session.location}</span>
              </div>
            </div>

            {/* Check-in Details */}
            {attendance.status === 'PRESENT' && (
              <div className="text-xs text-muted-foreground ml-8 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Ore acreditate:</span>
                  <span className="font-semibold text-green-700">
                    {attendance.hours_credited.toFixed(2)} ore
                  </span>
                </div>
                {checkedInDate && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Check-in:</span>
                    <span>{checkedInDate}</span>
                    {attendance.check_in_method === 'QR_CODE' && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        QR Code
                      </span>
                    )}
                    {attendance.check_in_method === 'MANUAL' && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        Manual
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
