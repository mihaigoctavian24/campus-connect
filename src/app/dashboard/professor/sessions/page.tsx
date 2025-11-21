'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { SessionScheduler } from '@/components/sessions/SessionScheduler';
import { SessionCalendar } from '@/components/sessions/SessionCalendar';
import { createClient } from '@/lib/supabase/client';

interface Session {
  id: string;
  activity_id: string;
  activity_title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants: number | null;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export default function ProfessorSessionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activities, setActivities] = useState<Array<{ id: string; title: string }>>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [allSessions, setAllSessions] = useState<Session[]>([]);

  useEffect(() => {
    loadActivitiesAndSessions();
  }, []);

  async function loadActivitiesAndSessions() {
    try {
      setLoading(true);
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Load activities
      const { data: activitiesData } = await supabase
        .from('activities')
        .select('id, title')
        .eq('created_by', user.id)
        .eq('status', 'OPEN')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .returns<Array<{ id: string; title: string }>>();

      if (activitiesData) {
        setActivities(activitiesData);
        if (activitiesData.length > 0) {
          setSelectedActivityId(activitiesData[0].id);
        }

        // Load all sessions for all activities
        const activityIds = activitiesData.map((a) => a.id);

        if (activityIds.length > 0) {
          const { data: sessionsData } = await supabase
            .schema('public')
            .from('sessions')
            .select('*')
            .in('activity_id', activityIds)
            .order('date', { ascending: true })
            .order('start_time', { ascending: true });

          if (sessionsData) {
            // Enrich sessions with activity titles
            const sessionsWithTitles: Session[] = sessionsData.map((session) => {
              const activity = activitiesData.find((a) => a.id === session.activity_id);
              return {
                ...session,
                activity_title: activity?.title || 'Activitate',
              };
            });

            setAllSessions(sessionsWithTitles);
          }
        }
      }
    } catch (error) {
      console.error('Error loading activities and sessions:', error);
    } finally {
      setLoading(false);
    }
  }

  const [refreshKey, setRefreshKey] = useState(0);

  const handleSessionsCreated = () => {
    setIsDialogOpen(false);
    loadActivitiesAndSessions(); // Reload all sessions
    setRefreshKey((prev) => prev + 1);
  };

  const handleSessionUpdate = () => {
    loadActivitiesAndSessions(); // Reload all sessions
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sesiuni</h1>
        <p className="text-muted-foreground">Programează și urmărește sesiunile de voluntariat</p>
      </div>

      {/* Create Session Button */}
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" disabled={loading || activities.length === 0}>
              <Plus className="h-5 w-5 mr-2" />
              Programează Sesiune Nouă
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[85vw] max-w-[900px] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Programează Sesiuni</DialogTitle>
              <DialogDescription>
                Creează sesiuni pentru activitățile tale de voluntariat
              </DialogDescription>
            </DialogHeader>

            {activities.length > 0 && (
              <div className="space-y-4">
                {/* Activity Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Selectează Activitatea</label>
                  <Select value={selectedActivityId} onValueChange={setSelectedActivityId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alege o activitate" />
                    </SelectTrigger>
                    <SelectContent>
                      {activities.map((activity) => (
                        <SelectItem key={activity.id} value={activity.id}>
                          {activity.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Session Scheduler */}
                {selectedActivityId && (
                  <SessionScheduler
                    activityId={selectedActivityId}
                    onSessionsCreated={handleSessionsCreated}
                  />
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions Calendar - Show ALL sessions from ALL activities */}
      <SessionCalendar
        key={refreshKey}
        sessions={allSessions}
        onSessionUpdate={handleSessionUpdate}
      />
    </div>
  );
}
