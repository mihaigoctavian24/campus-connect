import { Calendar, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Application } from './MyApplications';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ApplicationStatusCardProps {
  application: Application;
}

export function ApplicationStatusCard({ application }: ApplicationStatusCardProps) {
  const statusConfig: Record<
    string,
    {
      label: string;
      color: string;
      icon: typeof Clock;
      iconColor: string;
    }
  > = {
    PENDING: {
      label: 'Pending Review',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
      iconColor: 'text-yellow-600',
    },
    CONFIRMED: {
      label: 'Accepted',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
    },
    APPROVED: {
      label: 'Approved',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
    },
    REJECTED: {
      label: 'Rejected',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle,
      iconColor: 'text-red-600',
    },
    CANCELLED: {
      label: 'Cancelled',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: XCircle,
      iconColor: 'text-gray-600',
    },
    WAITLISTED: {
      label: 'Waitlisted',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Clock,
      iconColor: 'text-blue-600',
    },
  };

  const config = statusConfig[application.status] || {
    label: application.status,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Clock,
    iconColor: 'text-gray-600',
  };
  const StatusIcon = config.icon;

  // Format dates
  const appliedDate = new Date(application.appliedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const respondedDate = application.respondedAt
    ? new Date(application.respondedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const activityDate = new Date(application.activityDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Activity Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-3">
              <StatusIcon className={`h-5 w-5 mt-0.5 ${config.iconColor}`} />
              <div className="flex-1">
                <h4 className="font-medium">{application.activityTitle}</h4>
                <p className="text-sm text-muted-foreground">{application.activityCategory}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground ml-8">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{activityDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{application.activityLocation}</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground ml-8">
              <p>Applied on {appliedDate}</p>
              {respondedDate && <p>Responded on {respondedDate}</p>}
            </div>
          </div>

          {/* Right: Status Badge */}
          <div>
            <Badge variant="outline" className={config.color}>
              {config.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
