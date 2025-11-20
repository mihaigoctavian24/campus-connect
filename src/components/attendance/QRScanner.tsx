'use client';

import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Camera, X, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface QRScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityId: string;
  activityTitle: string;
  onSuccess?: () => void;
}

interface ScanResult {
  status: 'success' | 'error';
  message: string;
}

export function QRScanner({
  open,
  onOpenChange,
  activityId,
  activityTitle,
  onSuccess,
}: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleScan = async (detectedCodes: { rawValue: string }[]) => {
    if (processing || result) return; // Prevent duplicate scans

    const qrData = detectedCodes[0]?.rawValue;
    if (!qrData) return;

    setProcessing(true);
    setScanning(false);

    try {
      // Parse QR code data
      const parsedData = JSON.parse(qrData);

      // Validate required fields
      if (!parsedData.session_id || !parsedData.activity_id || !parsedData.timestamp) {
        setResult({
          status: 'error',
          message: 'Invalid QR code format. Please scan the QR code displayed by your professor.',
        });
        setProcessing(false);
        return;
      }

      // Verify activity ID matches
      if (parsedData.activity_id !== activityId) {
        setResult({
          status: 'error',
          message: 'This QR code is for a different activity. Please scan the correct QR code.',
        });
        setProcessing(false);
        return;
      }

      // Check if QR code is expired (older than 30 seconds)
      const qrTimestamp = new Date(parsedData.timestamp).getTime();
      const now = Date.now();
      const ageInSeconds = (now - qrTimestamp) / 1000;

      if (ageInSeconds > 30) {
        setResult({
          status: 'error',
          message: 'QR code has expired. Please ask your professor to refresh the QR code.',
        });
        setProcessing(false);
        return;
      }

      // Call check-in API
      const response = await fetch(
        `/api/activities/${parsedData.activity_id}/sessions/${parsedData.session_id}/check-in`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            qr_data: parsedData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setResult({
          status: 'error',
          message: data.message || 'Failed to check in. Please try again.',
        });
        setProcessing(false);
        return;
      }

      // Success!
      setResult({
        status: 'success',
        message: `Attendance marked successfully for ${activityTitle}!`,
      });

      // Call onSuccess callback after a delay
      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
        // Reset states
        setResult(null);
        setScanning(false);
        setProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('QR scan error:', error);
      setResult({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Invalid QR code. Please scan a valid attendance QR code.',
      });
      setProcessing(false);
    }
  };

  const handleError = (error: unknown) => {
    console.error('Camera error:', error);

    // Determine error message based on error type
    let errorMessage = 'Camera error. Please check permissions and try again.';

    const err = error as Error;
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      errorMessage =
        'Camera permission denied. Please allow camera access in your browser settings.';
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      errorMessage = 'No camera found. Please ensure your device has a camera.';
    } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      errorMessage = 'Camera is in use by another application. Please close it and try again.';
    }

    setCameraError(errorMessage);
    setScanning(false);
  };

  const handleClose = () => {
    setResult(null);
    setScanning(false);
    setProcessing(false);
    setCameraError(null);
    onOpenChange(false);
  };

  const startScanning = () => {
    setCameraError(null);
    setResult(null);
    setScanning(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Scan QR Code
          </DialogTitle>
          <DialogDescription>
            Point your camera at the QR code displayed by your professor to mark attendance.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Camera Error */}
          {cameraError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">Camera Access Error</p>
                  <p className="text-sm text-red-700 mt-1">{cameraError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Scan Result */}
          {result && (
            <div
              className={`p-4 rounded-lg border ${
                result.status === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.status === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p
                    className={`text-sm font-medium ${
                      result.status === 'success' ? 'text-green-900' : 'text-red-900'
                    }`}
                  >
                    {result.status === 'success' ? 'Success!' : 'Error'}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      result.status === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {result.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Scanner Area */}
          {!result && !cameraError && (
            <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
              {scanning ? (
                <>
                  <Scanner
                    onScan={handleScan}
                    onError={handleError}
                    components={{
                      finder: true,
                    }}
                    styles={{
                      container: {
                        width: '100%',
                        height: '100%',
                      },
                    }}
                  />
                  {processing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-[#001f3f]" />
                        <span className="text-sm font-medium">Processing...</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">Camera is not active</p>
                    <Button onClick={startScanning} className="bg-[#001f3f] hover:bg-[#001f3f]/90">
                      Start Scanning
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            {cameraError && (
              <Button onClick={startScanning} variant="outline">
                Try Again
              </Button>
            )}
            <Button onClick={handleClose} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
