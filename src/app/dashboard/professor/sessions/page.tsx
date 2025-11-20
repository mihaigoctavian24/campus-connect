'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Clock, Plus } from 'lucide-react';
import { SessionScheduler } from '@/components/sessions/SessionScheduler';
import { createClient } from '@/lib/supabase/client';

export default function ProfessorSessionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activities, setActivities] = useState<Array<{ id: string; title: string }>>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('activities')
          .select('id, title')
          .eq('created_by', user.id)
          .eq('status', 'OPEN')
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .returns<Array<{ id: string; title: string }>>();

        if (data) {
          setActivities(data);
          if (data.length > 0) {
            setSelectedActivityId(data[0].id);
          }
        }
      }
      setLoading(false);
    }

    loadActivities();
  }, []);

  const handleSessionsCreated = () => {
    setIsDialogOpen(false);
    // Refresh sessions list here if needed
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

      {/* Sessions Calendar/List - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Sesiuni Viitoare</CardTitle>
          <CardDescription>Sesiunile tale programate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Nu ai sesiuni programate</p>
            <p className="text-sm mb-4">Programează o sesiune pentru studenții tăi</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              disabled={loading || activities.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Programează Sesiune
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
