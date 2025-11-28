'use client';

import { formatDistanceToNow, format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Circle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ActivityTimelineItem {
  id: string;
  activityId: string;
  activityTitle: string;
  activitySlug: string;
  date: string;
  hours: number;
  status: 'completed' | 'attended' | 'missed' | 'upcoming';
  location?: string;
  category?: string;
}

interface ActivityTimelineCardProps {
  activities: ActivityTimelineItem[];
  title?: string;
  description?: string;
  maxHeight?: number;
  showViewAll?: boolean;
  viewAllUrl?: string;
}

export function ActivityTimelineCard({
  activities,
  title = 'Activitățile tale recente',
  description = 'Istoricul participării la activitățile de voluntariat',
  maxHeight = 400,
  showViewAll = true,
  viewAllUrl = '/dashboard/student/my-activities',
}: ActivityTimelineCardProps) {
  const getStatusIcon = (status: ActivityTimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'attended':
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
      case 'missed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'upcoming':
        return <Circle className="h-5 w-5 text-amber-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ActivityTimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Finalizat
          </Badge>
        );
      case 'attended':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Participat
          </Badge>
        );
      case 'missed':
        return <Badge variant="destructive">Absent</Badge>;
      case 'upcoming':
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            În curând
          </Badge>
        );
      default:
        return null;
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Nu ai participat la nicio activitate încă</p>
            <Link
              href="/opportunities"
              className="mt-4 text-sm font-medium text-[#001f3f] hover:underline"
            >
              Explorează oportunități de voluntariat →
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {showViewAll && (
            <Link
              href={viewAllUrl}
              className="flex items-center gap-1 text-sm font-medium text-[#001f3f] hover:underline"
            >
              Vezi toate
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ height: maxHeight }}>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-gray-200" />

            <div className="space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="relative pl-8">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1">{getStatusIcon(activity.status)}</div>

                  <div className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/opportunities/${activity.activitySlug}`}
                          className="font-medium text-[#001f3f] hover:underline line-clamp-1"
                        >
                          {activity.activityTitle}
                        </Link>

                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(activity.date), 'd MMMM yyyy', { locale: ro })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {activity.hours}h
                          </span>
                          {activity.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {activity.location}
                            </span>
                          )}
                        </div>

                        {activity.category && (
                          <Badge variant="outline" className="mt-2">
                            {activity.category}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(activity.status)}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.date), {
                            addSuffix: true,
                            locale: ro,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
