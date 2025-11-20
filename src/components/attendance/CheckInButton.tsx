'use client';

import { useState } from 'react';
import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QRScanner } from '@/components/attendance/QRScanner';

interface CheckInButtonProps {
  activityId: string;
  activityTitle: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  onSuccess?: () => void;
}

export function CheckInButton({
  activityId,
  activityTitle,
  variant = 'default',
  size = 'default',
  className,
  onSuccess,
}: CheckInButtonProps) {
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleSuccess = () => {
    // Close scanner
    setScannerOpen(false);

    // Call parent callback if provided
    onSuccess?.();
  };

  return (
    <>
      <Button
        onClick={() => setScannerOpen(true)}
        variant={variant}
        size={size}
        className={className}
      >
        <QrCode className="mr-2 h-4 w-4" />
        Check-in
      </Button>

      <QRScanner
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        activityId={activityId}
        activityTitle={activityTitle}
        onSuccess={handleSuccess}
      />
    </>
  );
}
