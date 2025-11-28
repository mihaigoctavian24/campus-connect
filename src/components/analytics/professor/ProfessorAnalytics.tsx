'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, BarChart3, Users, Clock, TrendingUp } from 'lucide-react';
import { AttendanceTrendsChart } from './AttendanceTrendsChart';
import { StudentPerformanceTable } from './StudentPerformanceTable';
import { AtRiskStudentAlert } from './AtRiskStudentAlert';
import { ExportAnalytics, generateCSV, downloadFile } from './ExportAnalytics';

interface ProfessorAnalyticsData {
  summary: {
    totalStudents: number;
    totalHoursValidated: number;
    averageAttendance: number;
    completionRate: number;
    totalActivities: number;
    totalSessions: number;
  };
  attendanceTrends: Array<{
    date: string;
    present: number;
    absent: number;
    total: number;
  }>;
  students: Array<{
    id: string;
    name: string;
    email: string;
    totalHours: number;
    approvedHours: number;
    sessionsAttended: number;
    totalSessions: number;
    attendanceRate: number;
    lastActivity: string | null;
  }>;
  atRiskStudents: Array<{
    id: string;
    name: string;
    email: string;
    attendanceRate: number;
    missedSessions: number;
    lastActivity: string | null;
    activityTitle: string;
    trend: 'declining' | 'stable' | 'improving';
  }>;
}

export function ProfessorAnalytics() {
  const [data, setData] = useState<ProfessorAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/professor/analytics');

        if (!response.ok) {
          throw new Error('Eroare la încărcarea datelor');
        }

        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        console.error('Error fetching professor analytics:', err);
        setError(err instanceof Error ? err.message : 'Eroare necunoscută');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const handleExportCSV = async (columns: string[]) => {
    if (!data) return;

    const columnLabels: Record<string, string> = {
      name: 'Nume Student',
      email: 'Email',
      totalHours: 'Ore Totale',
      approvedHours: 'Ore Aprobate',
      sessionsAttended: 'Sesiuni Prezent',
      totalSessions: 'Total Sesiuni',
      attendanceRate: 'Rata Prezență (%)',
      lastActivity: 'Ultima Activitate',
      status: 'Status',
    };

    const exportData = data.students.map((student) => ({
      ...student,
      status:
        student.attendanceRate >= 80
          ? 'Excelent'
          : student.attendanceRate >= 60
            ? 'Bun'
            : student.attendanceRate >= 40
              ? 'Moderat'
              : 'La risc',
    }));

    const csv = generateCSV(exportData, columns, columnLabels);
    const date = new Date().toISOString().split('T')[0];
    downloadFile(csv, `analytics-studenti-${date}.csv`, 'text/csv;charset=utf-8;');
  };

  const handleExportJSON = async (columns: string[]) => {
    if (!data) return;

    const exportData = data.students.map((student) => {
      const filtered: Record<string, unknown> = {};
      columns.forEach((col) => {
        if (col in student) {
          filtered[col] = student[col as keyof typeof student];
        }
      });
      return filtered;
    });

    const json = JSON.stringify(exportData, null, 2);
    const date = new Date().toISOString().split('T')[0];
    downloadFile(json, `analytics-studenti-${date}.json`, 'application/json');
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Statistici și rapoarte despre activitățile tale</p>
        </div>
        <ExportAnalytics
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
          disabled={!data || data.students.length === 0}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Studenți</p>
                <p className="text-3xl font-bold text-[#001f3f]">{data.summary.totalStudents}</p>
              </div>
              <div className="rounded-full bg-[#001f3f]/10 p-3">
                <Users className="h-6 w-6 text-[#001f3f]" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              în {data.summary.totalActivities} activități
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ore Validate</p>
                <p className="text-3xl font-bold text-[#001f3f]">
                  {data.summary.totalHoursValidated}h
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">acest semestru</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prezență Medie</p>
                <p className="text-3xl font-bold text-[#001f3f]">
                  {data.summary.averageAttendance}%
                </p>
              </div>
              <div className="rounded-full bg-amber-100 p-3">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              din {data.summary.totalSessions} sesiuni
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rata Finalizare</p>
                <p className="text-3xl font-bold text-[#001f3f]">{data.summary.completionRate}%</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">studenți care finalizează</p>
          </CardContent>
        </Card>
      </div>

      {/* At Risk Students Alert */}
      <AtRiskStudentAlert students={data.atRiskStudents} />

      {/* Attendance Trends Chart */}
      <AttendanceTrendsChart data={data.attendanceTrends} />

      {/* Student Performance Table */}
      <StudentPerformanceTable students={data.students} />
    </div>
  );
}
