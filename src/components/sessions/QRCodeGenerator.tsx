'use client';

import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface QRCodeGeneratorProps {
  sessionId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  location: string;
  activityTitle: string;
}

export function QRCodeGenerator({
  sessionId,
  sessionDate,
  startTime,
  endTime,
  location,
  activityTitle,
}: QRCodeGeneratorProps) {
  const [qrData, setQrData] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to fetch new QR code
  const fetchQRCode = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/qr`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const data = await response.json();
      setQrData(data.qr_code_data);
      setExpiresAt(new Date(data.qr_expires_at));
      setSecondsRemaining(30);
    } catch (error) {
      console.error('Error fetching QR code:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchQRCode();
  }, [sessionId]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchQRCode();
    }, 30000);

    return () => clearInterval(interval);
  }, [sessionId]);

  // Countdown timer
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
      setSecondsRemaining(diff);

      if (diff === 0) {
        fetchQRCode();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // Fullscreen handlers
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formattedDate = format(new Date(sessionDate), 'EEEE, d MMMM yyyy', { locale: ro });
  const qrSize = isFullscreen ? 400 : 256;

  return (
    <div
      ref={containerRef}
      className={`${
        isFullscreen
          ? 'fixed inset-0 z-50 flex items-center justify-center bg-white p-8'
          : 'w-full'
      }`}
    >
      <Card className={isFullscreen ? 'w-full max-w-3xl' : 'w-full'}>
        <CardContent className="pt-6">
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 mb-6">
            <Button
              variant="outline"
              size={isFullscreen ? 'lg' : 'sm'}
              onClick={fetchQRCode}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {!isFullscreen && <span className="ml-2">Reîmprospătează</span>}
            </Button>
            <Button
              variant="outline"
              size={isFullscreen ? 'lg' : 'sm'}
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-4 w-4" />
                  {isFullscreen && <span className="ml-2">Ieșire Fullscreen</span>}
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4" />
                  <span className="ml-2">Fullscreen</span>
                </>
              )}
            </Button>
          </div>
          <div className={`flex ${isFullscreen ? 'flex-row gap-12' : 'flex-col gap-6'}`}>
            {/* QR Code */}
            <div className="flex flex-col items-center gap-4">
              {qrData ? (
                <>
                  <div className="rounded-lg border-4 border-primary p-4 bg-white">
                    <QRCodeSVG value={qrData} size={qrSize} level="H" />
                  </div>
                  <div className="text-center">
                    <p className={`font-medium ${isFullscreen ? 'text-xl' : 'text-sm'}`}>
                      Expiră în:{' '}
                      <span
                        className={`font-bold ${secondsRemaining <= 10 ? 'text-destructive' : 'text-primary'}`}
                      >
                        {secondsRemaining}s
                      </span>
                    </p>
                    <p className={`text-muted-foreground ${isFullscreen ? 'text-lg' : 'text-xs'}`}>
                      Se reîmprospătează automat
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Session Info */}
            <div className={`flex-1 space-y-4 ${isFullscreen ? 'text-lg' : 'text-sm'}`}>
              <div>
                <h3
                  className={`font-semibold ${isFullscreen ? 'text-2xl mb-6' : 'text-base mb-2'}`}
                >
                  Informații Sesiune
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground">Activitate:</p>
                  <p className={`font-medium ${isFullscreen ? 'text-xl' : ''}`}>
                    {activityTitle}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Data:</p>
                  <p className={`font-medium ${isFullscreen ? 'text-xl' : ''}`}>{formattedDate}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Ora:</p>
                  <p className={`font-medium ${isFullscreen ? 'text-xl' : ''}`}>
                    {startTime} - {endTime}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Locație:</p>
                  <p className={`font-medium ${isFullscreen ? 'text-xl' : ''}`}>{location}</p>
                </div>
              </div>

              {isFullscreen && (
                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <p className="text-center text-muted-foreground">
                    Studenții pot scana acest cod QR pentru a-și marca prezența
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
