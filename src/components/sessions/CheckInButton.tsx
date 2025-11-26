'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface CheckInButtonProps {
  activityId: string;
  sessionId: string;
  sessionTitle: string;
  onCheckInSuccess?: () => void;
}

export function CheckInButton({
  activityId,
  sessionId,
  sessionTitle,
  onCheckInSuccess,
}: CheckInButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [gpsCoords, setGpsCoords] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          toast.success('Location obtained');
        },
        (error) => {
          toast.error('Could not get location: ' + error.message);
        }
      );
    } else {
      toast.error('Geolocation not supported by your browser');
    }
  };

  const handleCheckIn = async () => {
    if (!qrCode.trim()) {
      toast.error('Please enter QR code');
      return;
    }

    setIsChecking(true);

    try {
      const body = {
        qr_code: qrCode.trim(),
        gps_latitude: gpsCoords?.latitude,
        gps_longitude: gpsCoords?.longitude,
        gps_accuracy: gpsCoords?.accuracy,
      };

      const response = await fetch(`/api/activities/${activityId}/sessions/${sessionId}/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Check-in failed');
      }

      const hoursText = data.hours_credited.toFixed(2);
      toast.success(`Check-in successful! ${hoursText} hours credited`);
      setIsOpen(false);
      setQrCode('');
      setGpsCoords(null);

      if (onCheckInSuccess) {
        onCheckInSuccess();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Check-in failed');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <QrCode className="h-4 w-4" />
        Check In
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Check In to Session</DialogTitle>
            <DialogDescription>{sessionTitle}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">QR Code</label>
              <Input
                placeholder="Scan or enter QR code"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                disabled={isChecking}
              />
              <p className="text-xs text-muted-foreground">
                Ask your professor to display the session QR code
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location (Optional)</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGetLocation}
                disabled={isChecking}
                className="w-full"
              >
                {gpsCoords ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Location Obtained
                  </>
                ) : (
                  'Get Current Location'
                )}
              </Button>
              {gpsCoords && (
                <p className="text-xs text-muted-foreground">
                  Lat: {gpsCoords.latitude.toFixed(6)}, Lng: {gpsCoords.longitude.toFixed(6)}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isChecking}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCheckIn}
                disabled={isChecking || !qrCode.trim()}
                className="flex-1"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking In...
                  </>
                ) : (
                  'Confirm Check-In'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
