'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Eye, FileText } from 'lucide-react';
import { CheckInButton } from '@/components/attendance/CheckInButton';
import { LogHoursModal } from '@/components/hours/LogHoursModal';
import type { ActiveOpportunity } from './ActiveOpportunities';

interface ActiveOpportunityCardProps {
  opportunity: ActiveOpportunity;
  onCheckInSuccess?: () => void;
}

export function ActiveOpportunityCard({
  opportunity,
  onCheckInSuccess,
}: ActiveOpportunityCardProps) {
  const [isLogHoursModalOpen, setIsLogHoursModalOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{opportunity.title}</CardTitle>
          <Badge variant="secondary">{opportunity.department}</Badge>
        </div>
        <CardDescription>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={opportunity.progress} className="h-2 flex-1" />
            <span className="text-sm font-medium">
              {opportunity.hoursCompleted}/{opportunity.totalHours} hrs ({opportunity.progress}%)
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Next Session:</span>
            <span className="ml-2 text-muted-foreground">
              {opportunity.nextSession.date} • {opportunity.nextSession.time}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{opportunity.nextSession.location}</span>
          </div>
        </div>

        <Separator />

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsLogHoursModalOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Log Hours
          </Button>
          <CheckInButton
            activityId={opportunity.activityId}
            activityTitle={opportunity.title}
            size="sm"
            onSuccess={onCheckInSuccess}
          />
        </div>

        {/* Log Hours Modal */}
        <LogHoursModal
          isOpen={isLogHoursModalOpen}
          onClose={() => setIsLogHoursModalOpen(false)}
          enrollmentId={opportunity.id}
          activityId={opportunity.activityId}
          activityTitle={opportunity.title}
          onSuccess={() => {
            setIsLogHoursModalOpen(false);
            onCheckInSuccess?.();
          }}
        />
      </CardContent>
    </Card>
  );
}
