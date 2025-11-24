import { Calendar, Clock, MapPin, ClipboardCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { ro } from 'date-fns/locale';

interface ManualCheckInNoticeProps {
  session: {
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    activity_title?: string;
  };
}

export function ManualCheckInNotice({ session }: ManualCheckInNoticeProps) {
  const sessionDate = parseISO(session.date);
  const formattedDate = format(sessionDate, 'EEEE, d MMMM yyyy', { locale: ro });

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with Icon */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">Check-in Manual</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Profesorul va marca prezența manual la această sesiune.
                <br />
                Nu este necesar să scanezi un cod QR.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-blue-200" />

          {/* Session Details */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm text-blue-900">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="capitalize font-medium">{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2.5 text-sm text-blue-900">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium">
                {session.start_time.substring(0, 5)} - {session.end_time.substring(0, 5)}
              </span>
            </div>

            <div className="flex items-start gap-2.5 text-sm text-blue-900">
              <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
              <span className="font-medium">{session.location}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-2 border-t border-blue-200">
            <p className="text-xs text-blue-700 leading-relaxed">
              💡 <strong>Asigură-te că ești prezent la sesiune</strong> pentru a fi bifat de către
              profesor.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
