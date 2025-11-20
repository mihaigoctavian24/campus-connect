'use client';

import { useState, useEffect } from 'react';
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
import { MiniCalendar } from '@/components/dashboard/MiniCalendar';
import { createClient } from '@/lib/supabase/client';

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

  const loadUserAndStats = async () => {
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
  };

  useEffect(() => {
    loadUserAndStats();
  }, []);

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
      <QuickActions
        activeActivities={activeOpportunities.map((opp) => ({
          id: opp.id,
          title: opp.title,
        }))}
      />

      {/* Active Opportunities */}
      <ActiveOpportunities
        opportunities={activeOpportunities}
        loading={loading}
        onCheckInSuccess={loadUserAndStats}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Sessions */}
        <UpcomingSessions sessions={upcomingSessions} loading={loading} />

        {/* Mini Calendar */}
        <MiniCalendar
          sessions={upcomingSessions.map((session) => ({
            date: new Date(session.date),
            title: session.activityTitle,
            time: `${session.startTime} - ${session.endTime}`,
            location: session.location,
          }))}
        />
      </div>

      {/* Applications Status */}
      <MyApplications applications={applications} loading={loading} />

      {/* Saved Opportunities */}
      <SavedOpportunities opportunities={savedOpportunities} loading={loading} />
    </div>
  );
}
