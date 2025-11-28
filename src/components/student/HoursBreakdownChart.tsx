'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentHoursRequest } from './HoursHistoryPanel';
import { BarChart3, PieChart } from 'lucide-react';

interface HoursBreakdownChartProps {
  requests: StudentHoursRequest[];
}

export function HoursBreakdownChart({ requests }: HoursBreakdownChartProps) {
  // Group hours by activity
  const hoursByActivity = requests
    .filter((r) => r.status === 'APPROVED')
    .reduce(
      (acc, request) => {
        const activityTitle = request.activity.title;
        if (!acc[activityTitle]) {
          acc[activityTitle] = 0;
        }
        acc[activityTitle] += request.hours;
        return acc;
      },
      {} as Record<string, number>
    );

  // Sort activities by hours (descending)
  const sortedActivities = Object.entries(hoursByActivity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // Top 5 activities

  const totalHours = Object.values(hoursByActivity).reduce((sum, hours) => sum + hours, 0);

  // Calculate percentages for pie chart visualization
  const activitiesWithPercentage = sortedActivities.map(([activity, hours]) => ({
    activity,
    hours,
    percentage: totalHours > 0 ? Math.round((hours / totalHours) * 100) : 0,
  }));

  // Colors for different activities
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

  if (totalHours === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Distribuție Ore pe Activități
          </CardTitle>
          <CardDescription>Top 5 activități cu cele mai multe ore aprobate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <PieChart className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-4">Nu ai ore aprobate încă</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Distribuție Ore pe Activități
        </CardTitle>
        <CardDescription>Top 5 activități cu cele mai multe ore aprobate</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bar Chart */}
        <div className="space-y-4">
          {activitiesWithPercentage.map(({ activity, hours, percentage }, index) => (
            <div key={activity} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium truncate flex-1 mr-2">{activity}</span>
                <span className="text-muted-foreground whitespace-nowrap">
                  {hours} ore ({percentage}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors[index]} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Ore Aprobate:</span>
            <span className="text-2xl font-bold text-primary">{totalHours} ore</span>
          </div>
        </div>

        {/* Legend */}
        {sortedActivities.length > 0 && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Afișate primele {sortedActivities.length} activități din{' '}
              {Object.keys(hoursByActivity).length} total
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
