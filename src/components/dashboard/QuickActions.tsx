'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, QrCode, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CheckInModal } from './CheckInModal';
import { LogHoursModal } from './LogHoursModal';

interface QuickActionsProps {
  activeActivities?: Array<{
    id: string;
    title: string;
  }>;
}

export function QuickActions({ activeActivities = [] }: QuickActionsProps) {
  const router = useRouter();
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [logHoursModalOpen, setLogHoursModalOpen] = useState(false);

  const handleExploreClick = () => {
    router.push('/explore');
  };

  const handleCheckInClick = () => {
    setCheckInModalOpen(true);
  };

  const handleLogHoursClick = () => {
    setLogHoursModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button onClick={handleExploreClick}>
            <Eye className="mr-2 h-4 w-4" />
            Explore New Opportunities
          </Button>
          <Button variant="outline" onClick={handleCheckInClick}>
            <QrCode className="mr-2 h-4 w-4" />
            Check-in Now
          </Button>
          <Button variant="outline" onClick={handleLogHoursClick}>
            <Clock className="mr-2 h-4 w-4" />
            Log Hours
          </Button>
        </CardContent>
      </Card>

      {/* Modals */}
      <CheckInModal open={checkInModalOpen} onOpenChange={setCheckInModalOpen} />
      <LogHoursModal
        open={logHoursModalOpen}
        onOpenChange={setLogHoursModalOpen}
        activities={activeActivities}
      />
    </>
  );
}
