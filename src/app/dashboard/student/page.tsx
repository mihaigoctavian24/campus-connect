'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import {
  ActiveOpportunities,
  type ActiveOpportunity,
} from '@/components/dashboard/ActiveOpportunities';
import { getStudentStats, type StudentStats } from '@/lib/services/student-stats.service';
import { getActiveEnrollments } from '@/lib/services/active-enrollments.service';
import { getStudentApplications } from '@/lib/services/applications.service';
import { getUpcomingSessions } from '@/lib/services/upcoming-sessions.service';
import { getSavedOpportunities } from '@/lib/services/saved-opportunities.service';
import { MyApplications, type Application } from '@/components/dashboard/MyApplications';
import { UpcomingSessions, type UpcomingSession } from '@/components/dashboard/UpcomingSessions';
import {
  SavedOpportunities,
  type SavedOpportunity,
} from '@/components/dashboard/SavedOpportunities';
import { createClient } from '@/lib/supabase/client';
import { Bell } from 'lucide-react';

export default function StudentDashboardPage() {
  const [userName, setUserName] = useState('Student');
  const [stats, setStats] = useState<StudentStats>({
    totalHours: 0,
    activeOpportunities: 0,
    completedOpportunities: 0,
  });
  const [activeOpportunities, setActiveOpportunities] = useState<ActiveOpportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserAndStats() {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch user profile and stats in parallel
        try {
          const [profileData, userStats, enrollments, userApplications, sessions, savedOpps] =
            await Promise.all([
              supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', user.id)
                .single<{ first_name: string; last_name: string }>(),
              getStudentStats(user.id),
              getActiveEnrollments(user.id),
              getStudentApplications(user.id),
              getUpcomingSessions(user.id),
              getSavedOpportunities(user.id),
            ]);

          if (profileData.data) {
            setUserName(`${profileData.data.first_name} ${profileData.data.last_name}`);
          }
          setStats(userStats);
          setActiveOpportunities(enrollments);
          setApplications(userApplications);
          setUpcomingSessions(sessions);
          setSavedOpportunities(savedOpps);
        } catch (error) {
          console.error('Failed to load data:', error);
        }
      }

      setLoading(false);
    }

    loadUserAndStats();
  }, []);

  // TODO: Fetch from Supabase in future sprints
  const notifications: any[] = [];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <WelcomeHeader userName={userName} role="student" />

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Active Opportunities */}
      <ActiveOpportunities opportunities={activeOpportunities} loading={loading} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Sessions */}
        <UpcomingSessions sessions={upcomingSessions} loading={loading} />

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Stay updated with your activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
              >
                <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Applications Status */}
      <MyApplications applications={applications} loading={loading} />

      {/* Saved Opportunities */}
      <SavedOpportunities opportunities={savedOpportunities} loading={loading} />
    </div>
  );
}
