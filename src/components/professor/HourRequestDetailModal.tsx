'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Mail, FileText, Image as ImageIcon, File } from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { HoursActionButtons } from './HoursActionButtons';
import type { HoursRequest } from './HoursValidation';

interface HourRequestDetailModalProps {
  request: HoursRequest;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (requestId: string, notes?: string) => Promise<void>;
  onReject: (requestId: string, reason: string) => Promise<void>;
  onRequestInfo: (requestId: string, message: string) => Promise<void>;
}

export function HourRequestDetailModal({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestInfo,
}: HourRequestDetailModalProps) {
  const getStatusBadge = (status: HoursRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="secondary" className="text-base">
            ⏳ În așteptare
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge variant="default" className="bg-green-500 text-base">
            ✅ Aprobat
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive" className="text-base">
            ❌ Respins
          </Badge>
        );
    }
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const isPDF = (url: string) => {
    return url.toLowerCase().endsWith('.pdf');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl">Detalii Cerere Ore</DialogTitle>
            {getStatusBadge(request.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Student Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Informații Student
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Nume</p>
                <p className="font-medium">
                  {request.student.first_name} {request.student.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {request.student.email}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity & Time Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Detalii Activitate</h3>
            <div className="space-y-3 bg-muted p-4 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Activitate</p>
                <p className="font-medium">{request.activity.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data
                  </p>
                  <p className="font-medium">
                    {format(new Date(request.date), 'PPP', { locale: ro })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Ore Solicitate
                  </p>
                  <p className="font-medium text-lg">{request.hours} ore</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Descrierea Activității
            </h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{request.description}</p>
            </div>
          </div>

          {/* Evidence Files */}
          {request.evidence_urls && request.evidence_urls.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Dovezi ({request.evidence_urls.length})
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {request.evidence_urls.map((url, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      {isImage(url) ? (
                        <div className="space-y-2">
                          <img
                            src={url}
                            alt={`Evidence ${index + 1}`}
                            className="w-full h-40 object-cover rounded-md"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => window.open(url, '_blank')}
                          >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Vezi Imagine
                          </Button>
                        </div>
                      ) : isPDF(url) ? (
                        <div className="flex flex-col items-center justify-center h-40 space-y-2">
                          <File className="h-12 w-12 text-red-500" />
                          <p className="text-sm font-medium">Document PDF</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(url, '_blank')}
                          >
                            Deschide PDF
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-40 space-y-2">
                          <FileText className="h-12 w-12 text-blue-500" />
                          <p className="text-sm font-medium">Fișier atașat</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(url, '_blank')}
                          >
                            Deschide Fișier
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Professor Notes (if any) */}
          {request.professor_notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Notițe Profesor</h3>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                  <p className="text-sm">{request.professor_notes}</p>
                </div>
              </div>
            </>
          )}

          {/* Review Information */}
          {request.reviewed_at && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Informații Verificare</h3>
                <div className="bg-muted p-3 rounded-md text-sm space-y-1">
                  <p>
                    <span className="font-medium">Revizuit la:</span>{' '}
                    {format(new Date(request.reviewed_at), 'PPP p', { locale: ro })}
                  </p>
                  {request.reviewed_by && (
                    <p>
                      <span className="font-medium">Revizuit de:</span> {request.reviewed_by}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons (only for pending requests) */}
        {request.status === 'PENDING' && (
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Închide
            </Button>
            <HoursActionButtons
              requestId={request.id}
              onApprove={async (id, notes) => {
                await onApprove(id, notes);
                onClose();
              }}
              onReject={async (id, reason) => {
                await onReject(id, reason);
                onClose();
              }}
              onRequestInfo={async (id, message) => {
                await onRequestInfo(id, message);
                onClose();
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
