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
import { SessionManagementTable } from '@/components/sessions/SessionManagementTable';
import { EditSessionDialog } from '@/components/sessions/EditSessionDialog';
import { RescheduleSessionDialog } from '@/components/sessions/RescheduleSessionDialog';

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

interface Session {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants?: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  qr_code_data?: string;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

export function OpportunityDetailPage({ activityId }: OpportunityDetailPageProps) {
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [reschedulingSession, setReschedulingSession] = useState<Session | null>(null);

  useEffect(() => {
    fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function fetchSessions() {
    try {
      setIsLoadingSessions(true);
      const response = await fetch(`/api/activities/${activityId}/sessions`);

      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Eroare la încărcarea sesiunilor');
    } finally {
      setIsLoadingSessions(false);
    }
  }

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel session');
      }

      toast.success('Sesiune anulată cu succes');
      fetchSessions(); // Reload sessions
    } catch (error) {
      console.error('Error canceling session:', error);
      toast.error('Eroare la anularea sesiunii');
    }
  };

  const handleRescheduleSession = (session: Session) => {
    setReschedulingSession(session);
  };

  const handleEditSessionSave = async (sessionId: string, data: any) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update session');
      }

      toast.success('Sesiune actualizată cu succes');
      setEditingSession(null);
      fetchSessions(); // Reload sessions
    } catch (error) {
      console.error('Error updating session:', error);
      toast.error('Eroare la actualizarea sesiunii');
      throw error;
    }
  };

  const handleRescheduleSave = async (sessionId: string, data: any) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to reschedule session');
      }

      toast.success('Sesiune reprogramată cu succes');
      setReschedulingSession(null);
      fetchSessions(); // Reload sessions
    } catch (error) {
      console.error('Error rescheduling session:', error);
      toast.error('Eroare la reprogramarea sesiunii');
      throw error;
    }
  };

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
        <Button
          onClick={() => router.push(`/dashboard/professor/opportunities/${activityId}/edit`)}
        >
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
      <Tabs
        defaultValue="applications"
        className="w-full"
        onValueChange={(value) => {
          if (value === 'sessions' && sessions.length === 0) {
            fetchSessions();
          }
        }}
      >
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
            <SessionManagementTable
              sessions={sessions}
              activityTitle={activity?.title || 'Activitate'}
              onEdit={handleEditSession}
              onCancel={handleCancelSession}
              onReschedule={handleRescheduleSession}
              isLoading={isLoadingSessions}
            />
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

      {/* Edit Session Dialog */}
      {editingSession && (
        <EditSessionDialog
          session={editingSession}
          activityId={activityId}
          onClose={() => setEditingSession(null)}
          onSave={handleEditSessionSave}
        />
      )}

      {/* Reschedule Session Dialog */}
      {reschedulingSession && (
        <RescheduleSessionDialog
          session={reschedulingSession}
          activityId={activityId}
          onClose={() => setReschedulingSession(null)}
          onSave={handleRescheduleSave}
        />
      )}
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
