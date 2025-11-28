'use client';

import { useState, useEffect } from 'react';
import { Loader2, BarChart3, Calendar, Clock, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { HoursByMonthChart } from './HoursByMonthChart';
import { CategoryBreakdownPie } from './CategoryBreakdownPie';
import { ProgressGoalBar } from './ProgressGoalBar';
import { ActivityTimelineCard } from './ActivityTimelineCard';

interface StudentAnalyticsData {
  totalHours: number;
  approvedHours: number;
  pendingHours: number;
  totalActivities: number;
  completedActivities: number;
  goalHours: number;
  monthlyData: Array<{
    month: string;
    hours: number;
    approved: number;
    pending: number;
  }>;
  categoryData: Array<{
    category: string;
    hours: number;
  }>;
  recentActivities: Array<{
    id: string;
    activityId: string;
    activityTitle: string;
    activitySlug: string;
    date: string;
    hours: number;
    status: 'completed' | 'attended' | 'missed' | 'upcoming';
    location?: string;
    category?: string;
  }>;
}

export function StudentAnalytics() {
  const [data, setData] = useState<StudentAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/users/me/analytics');

        if (!response.ok) {
          throw new Error('Eroare la încărcarea datelor');
        }

        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err instanceof Error ? err.message : 'Eroare necunoscută');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">Nu există date de analiză disponibile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Statistici & Progres</h1>
        <p className="text-muted-foreground">
          Vizualizează progresul tău în activitățile de voluntariat
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total ore</p>
                <p className="text-3xl font-bold text-[#001f3f]">{data.totalHours}h</p>
              </div>
              <div className="rounded-full bg-[#001f3f]/10 p-3">
                <Clock className="h-6 w-6 text-[#001f3f]" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {data.approvedHours}h aprobate • {data.pendingHours}h în așteptare
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Activități</p>
                <p className="text-3xl font-bold text-[#001f3f]">{data.completedActivities}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              din {data.totalActivities} înscrise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Progres</p>
                <p className="text-3xl font-bold text-[#001f3f]">
                  {data.goalHours > 0 ? Math.round((data.approvedHours / data.goalHours) * 100) : 0}
                  %
                </p>
              </div>
              <div className="rounded-full bg-amber-100 p-3">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              din obiectivul de {data.goalHours}h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Medie/lună</p>
                <p className="text-3xl font-bold text-[#001f3f]">
                  {data.monthlyData.length > 0
                    ? Math.round(data.totalHours / data.monthlyData.length)
                    : 0}
                  h
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              în ultimele {data.monthlyData.length} luni
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Goal */}
      <ProgressGoalBar
        currentHours={data.approvedHours}
        goalHours={data.goalHours}
        semesterName="Semestrul 1 • 2024-2025"
      />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <HoursByMonthChart data={data.monthlyData} />
        <CategoryBreakdownPie data={data.categoryData} />
      </div>

      {/* Activity Timeline */}
      <ActivityTimelineCard activities={data.recentActivities} maxHeight={400} />
    </div>
  );
}
