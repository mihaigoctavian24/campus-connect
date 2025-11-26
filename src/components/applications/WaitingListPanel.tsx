'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Eye, ArrowUpCircle, Clock } from 'lucide-react';
import { Application } from '@/types/applications';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface WaitingListPanelProps {
  applications: Application[];
  activityId: string;
  onViewProfile: (app: Application) => void;
  onViewDetails: (app: Application) => void;
  onPromote: (app: Application) => void;
  availableSlots: number;
}

export function WaitingListPanel({
  applications,
  activityId: _activityId,
  onViewProfile,
  onViewDetails,
  onPromote,
  availableSlots,
}: WaitingListPanelProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Niciun student în lista de așteptare</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Available Slots */}
      {availableSlots > 0 && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <ArrowUpCircle className="h-5 w-5" />
            <p className="font-medium">
              {availableSlots} {availableSlots === 1 ? 'loc disponibil' : 'locuri disponibile'}
            </p>
            <span className="text-sm text-blue-600 dark:text-blue-400">
              - Promovează studenții din lista de așteptare
            </span>
          </div>
        </Card>
      )}

      {/* Waiting List Items */}
      <div className="space-y-3">
        {applications.map((app, index) => (
          <Card key={app.id} className="p-4">
            <div className="flex gap-4">
              {/* Avatar with Position Badge */}
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={app.student.profile_picture_url || undefined} />
                  <AvatarFallback>
                    {getInitials(app.student.first_name, app.student.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  #{index + 1}
                </div>
              </div>

              {/* Student Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">
                    {app.student.first_name} {app.student.last_name}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    Anul {app.student.year}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  >
                    Listă Așteptare
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  {app.student.specialization} • {app.student.email}
                </p>

                <p className="text-sm mb-2 line-clamp-2">{app.motivation}</p>

                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>Activități: {app.student.completed_activities}</span>
                  <span>Certificate: {app.student.certificates_earned}</span>
                  <span>
                    În listă din:{' '}
                    {format(new Date(app.reviewed_at || app.applied_at), 'dd MMM yyyy', {
                      locale: ro,
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onViewProfile(app)}
                    variant="outline"
                    className="gap-2"
                  >
                    <User className="h-4 w-4" />
                    Profil
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onViewDetails(app)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Detalii
                  </Button>
                </div>
                {availableSlots > 0 && (
                  <Button
                    size="sm"
                    onClick={() => onPromote(app)}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 w-full"
                  >
                    <ArrowUpCircle className="h-4 w-4" />
                    Promovează
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
