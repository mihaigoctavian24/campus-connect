import { Calendar, MapPin, Users, Bookmark } from 'lucide-react';
import { SavedOpportunity } from './SavedOpportunities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SavedOpportunityCardProps {
  opportunity: SavedOpportunity;
}

export function SavedOpportunityCard({ opportunity }: SavedOpportunityCardProps) {
  // Format activity date
  const activityDate = new Date(opportunity.activityDate);
  const formattedDate = activityDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Calculate spots remaining
  const spotsRemaining = opportunity.maxParticipants - opportunity.currentParticipants;
  const isFull = spotsRemaining <= 0;
  const isLimitedSpots = spotsRemaining > 0 && spotsRemaining <= 5;

  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
      <Bookmark className="h-5 w-5 text-primary mt-0.5 fill-primary" />
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium leading-tight">{opportunity.activityTitle}</h4>
            <p className="text-sm text-muted-foreground">{opportunity.activityCategory}</p>
          </div>
          {isFull && (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
              Full
            </Badge>
          )}
          {isLimitedSpots && (
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
              {spotsRemaining} left
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{opportunity.activityLocation}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>
              {opportunity.currentParticipants}/{opportunity.maxParticipants}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" disabled={isFull}>
            {isFull ? 'Full' : 'Apply Now'}
          </Button>
          <Button size="sm" variant="outline">
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
