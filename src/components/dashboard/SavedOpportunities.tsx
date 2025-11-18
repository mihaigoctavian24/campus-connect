'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SavedOpportunityCard } from './SavedOpportunityCard';

export interface SavedOpportunity {
  id: string;
  activityId: string;
  activityTitle: string;
  activityCategory: string;
  activityDate: string;
  activityLocation: string;
  maxParticipants: number;
  currentParticipants: number;
  savedAt: string;
}

interface SavedOpportunitiesProps {
  opportunities: SavedOpportunity[];
  loading?: boolean;
}

export function SavedOpportunities({ opportunities, loading = false }: SavedOpportunitiesProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Opportunities</CardTitle>
          <CardDescription>Activities you&apos;ve bookmarked for later</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading saved opportunities...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by saved date (most recent first)
  const sortedOpportunities = [...opportunities].sort((a, b) => {
    const dateA = new Date(a.savedAt).getTime();
    const dateB = new Date(b.savedAt).getTime();
    return dateB - dateA;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Opportunities</CardTitle>
        <CardDescription>Activities you&apos;ve bookmarked for later</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedOpportunities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No saved opportunities yet. Browse activities and save them for later!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedOpportunities.map((opportunity) => (
              <SavedOpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
