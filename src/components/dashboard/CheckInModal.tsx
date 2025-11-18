'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface CheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckInModal({ open, onOpenChange }: CheckInModalProps) {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleStartScan = () => {
    setScanning(true);
    setStatus('idle');

    // Simulate QR code scanning
    setTimeout(() => {
      // Simulate successful check-in
      setScanning(false);
      setStatus('success');
      setMessage('Attendance marked successfully for STEM Mentorship Program!');

      // Close modal after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
        // Reset state when closing
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 300);
      }, 2000);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Check-in with QR Code</DialogTitle>
          <DialogDescription>
            Scan the QR code displayed at the activity location to mark your attendance
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          {status === 'idle' && !scanning && (
            <>
              <div className="w-48 h-48 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <QrCode className="w-24 h-24 text-gray-400" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Position the QR code within the frame to scan
              </p>
              <Button onClick={handleStartScan} size="lg">
                <Camera className="mr-2 h-5 w-5" />
                Start Camera
              </Button>
            </>
          )}

          {scanning && (
            <>
              <div className="w-48 h-48 border-4 border-[#001f3f] rounded-lg flex items-center justify-center animate-pulse">
                <Loader2 className="w-24 h-24 text-[#001f3f] animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">Scanning QR code...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-48 h-48 flex items-center justify-center">
                <CheckCircle className="w-24 h-24 text-green-500" />
              </div>
              <p className="text-sm font-medium text-green-600 text-center">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-48 h-48 flex items-center justify-center">
                <XCircle className="w-24 h-24 text-red-500" />
              </div>
              <p className="text-sm font-medium text-red-600 text-center">{message}</p>
              <Button onClick={handleStartScan} variant="outline">
                Try Again
              </Button>
            </>
          )}
        </div>

        <div className="text-xs text-center text-muted-foreground space-y-1">
          <p>💡 Make sure you&apos;re at the activity location</p>
          <p>⏰ Check-in is available ±15 minutes from session start time</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
