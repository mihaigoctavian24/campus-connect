'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ApplicationReview } from '@/components/applications/ApplicationReview';

interface Activity {
  id: string;
  title: string;
  description: string;
  category_id: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  max_participants: number;
  current_participants: number;
  department_id: string;
  created_at: string;
  updated_at: string;
}

interface OpportunityDetailPageProps {
  activityId: string;
}

export function OpportunityDetailPage({ activityId }: OpportunityDetailPageProps) {
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, [activityId]);

  async function fetchActivity() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/activities/${activityId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch activity');
      }

      const data = await response.json();
      setActivity(data);
    } catch (error) {
      console.error('Error fetching activity:', error);
      toast.error('Eroare la încărcarea activității');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Se încarcă...</p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-muted-foreground">Activitatea nu a fost găsită</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la Oportunități
        </Button>
        <Button onClick={() => router.push(`/dashboard/professor/opportunities/${activityId}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Editează
        </Button>
      </div>

      {/* Activity Overview Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{activity.title}</h1>
              <div className="flex gap-2 flex-wrap">
                <Badge className={getStatusBadgeClass(activity.status)}>
                  {getStatusLabel(activity.status)}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Participanți</p>
              <p className="text-2xl font-bold text-primary">
                {activity.current_participants} / {activity.max_participants}
              </p>
            </div>
          </div>

          <p className="text-muted-foreground whitespace-pre-wrap">{activity.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Dată</p>
                <p className="font-medium">
                  {new Date(activity.date).toLocaleDateString('ro-RO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Interval Orar</p>
                <p className="font-medium">
                  {activity.start_time} - {activity.end_time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Locație</p>
                <p className="font-medium">{activity.location}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="applications" className="gap-2">
            <Users className="h-4 w-4" />
            Aplicații
          </TabsTrigger>
          <TabsTrigger value="sessions">Sesiuni</TabsTrigger>
          <TabsTrigger value="participants">Participanți</TabsTrigger>
          <TabsTrigger value="statistics">Statistici</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-6">
          <ApplicationReview activityId={activityId} />
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          <Card className="p-6">
            <p className="text-muted-foreground text-center">
              Secțiunea Sesiuni va fi implementată în viitor
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="mt-6">
          <Card className="p-6">
            <p className="text-muted-foreground text-center">
              Secțiunea Participanți va fi implementată în viitor
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <Card className="p-6">
            <p className="text-muted-foreground text-center">
              Secțiunea Statistici va fi implementată în viitor
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'DRAFT':
      return 'bg-gray-600 text-white';
    case 'OPEN':
      return 'bg-green-600 text-white';
    case 'IN_PROGRESS':
      return 'bg-blue-600 text-white';
    case 'COMPLETED':
      return 'bg-purple-600 text-white';
    case 'CANCELLED':
      return 'bg-red-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'DRAFT':
      return 'Ciornă';
    case 'OPEN':
      return 'Deschis';
    case 'IN_PROGRESS':
      return 'În Desfășurare';
    case 'COMPLETED':
      return 'Finalizat';
    case 'CANCELLED':
      return 'Anulat';
    default:
      return status;
  }
}
