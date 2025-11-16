'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, CheckCircle2, GraduationCap, LucideIcon } from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface StatCardData {
  label: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  iconColor?: string;
}

interface StatsCardsProps {
  stats: {
    totalHours: number;
    activeOpportunities: number;
    completedOpportunities: number;
  };
  className?: string;
}

export function StatsCards({ stats, className }: StatsCardsProps) {
  const statCards: StatCardData[] = [
    {
      label: 'Total Hours',
      value: `${stats.totalHours} hrs`,
      subtitle: 'Across all activities',
      icon: TrendingUp,
      iconColor: 'text-blue-600',
    },
    {
      label: 'Active Opportunities',
      value: stats.activeOpportunities,
      subtitle: 'Currently enrolled',
      icon: CheckCircle2,
      iconColor: 'text-green-600',
    },
    {
      label: 'Completed',
      value: stats.completedOpportunities,
      subtitle: 'Opportunities finished',
      icon: GraduationCap,
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className={cn('grid gap-4 md:grid-cols-3', className)}>
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <Icon className={cn('h-4 w-4', stat.iconColor || 'text-muted-foreground')} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
