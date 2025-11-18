import { MapPin, Clock, Users, Calendar, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Opportunity } from '@/lib/services/opportunities.service';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  // Format dates
  const startDate = new Date(opportunity.startDate);
  const endDate = new Date(opportunity.endDate);

  const formattedStartDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const formattedEndDate = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate spots remaining
  const spotsRemaining = opportunity.maxParticipants - opportunity.currentParticipants;
  const isFull = spotsRemaining <= 0;
  const isLimitedSpots = spotsRemaining > 0 && spotsRemaining <= 5;

  // Status badge
  const getStatusBadge = () => {
    if (isFull) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          Full
        </Badge>
      );
    }
    if (isLimitedSpots) {
      return (
        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
          {spotsRemaining} spots left
        </Badge>
      );
    }
    if (opportunity.status === 'OPEN') {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          Open
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight mb-1">
              <Link
                href={`/opportunities/${opportunity.slug}`}
                className="hover:text-primary transition-colors"
              >
                {opportunity.title}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-medium">
                {opportunity.departmentCode}
              </span>
              <span className="ml-1">{opportunity.departmentName}</span>
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {opportunity.description}
        </p>

        {/* Category */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{opportunity.categoryName}</Badge>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{opportunity.requiredHours}h required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span className="truncate">
              {formattedStartDate} - {formattedEndDate}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>
              {opportunity.currentParticipants}/{opportunity.maxParticipants}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button asChild className="flex-1" disabled={isFull}>
            <Link href={`/opportunities/${opportunity.slug}`}>
              {isFull ? 'Full' : 'View Details'}
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
