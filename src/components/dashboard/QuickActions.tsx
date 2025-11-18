'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuickActions() {
  const router = useRouter();

  const handleExploreClick = () => {
    router.push('/explore');
  };

  const handleCheckInClick = () => {
    // TODO: Implement check-in functionality
    console.log('Check-in clicked');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Button onClick={handleExploreClick}>
          <Eye className="mr-2 h-4 w-4" />
          Explore New Opportunities
        </Button>
        <Button variant="outline" onClick={handleCheckInClick}>
          <QrCode className="mr-2 h-4 w-4" />
          Check-in Now
        </Button>
      </CardContent>
    </Card>
  );
}
