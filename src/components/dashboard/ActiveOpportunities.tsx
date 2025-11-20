'use client';

import { cn } from '@/components/ui/utils';
import { ActiveOpportunityCard } from './ActiveOpportunityCard';

export interface ActiveOpportunity {
  id: string;
  activityId: string;
  title: string;
  department: string;
  progress: number;
  hoursCompleted: number;
  totalHours: number;
  nextSession: {
    date: string;
    time: string;
    location: string;
  };
}

interface ActiveOpportunitiesProps {
  opportunities: ActiveOpportunity[];
  loading?: boolean;
  className?: string;
  onCheckInSuccess?: () => void;
}

export function ActiveOpportunities({
  opportunities,
  loading = false,
  className,
  onCheckInSuccess,
}: ActiveOpportunitiesProps) {
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <h2 className="text-2xl font-semibold">My Active Opportunities</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <h2 className="text-2xl font-semibold">My Active Opportunities</h2>
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No active opportunities yet.</p>
          <p className="text-sm mt-2">
            Browse opportunities and start volunteering to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-2xl font-semibold">My Active Opportunities</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {opportunities.map((opportunity) => (
          <ActiveOpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            onCheckInSuccess={onCheckInSuccess}
          />
        ))}
      </div>
    </div>
  );
}
