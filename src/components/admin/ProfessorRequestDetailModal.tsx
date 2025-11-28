'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Building,
  Calendar,
  FileText,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { toast } from 'sonner';

interface ProfessorRequest {
  id: string;
  user_id: string;
  department: string | null;
  reason: string;
  supporting_documents: string[] | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  admin_notes: string | null;
  created_at: string;
  user: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    faculty: string | null;
  };
  reviewer?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface ProfessorRequestDetailModalProps {
  request: ProfessorRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestUpdated: () => void;
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'PENDING':
      return (
        <Badge className="bg-amber-100 text-amber-800">
          <Clock className="h-3 w-3 mr-1" />
          În așteptare
        </Badge>
      );
    case 'APPROVED':
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Aprobat
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Respins
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function ProfessorRequestDetailModal({
  request,
  isOpen,
  onClose,
  onRequestUpdated,
}: ProfessorRequestDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  if (!request) return null;

  const handleApprove = async () => {
    setIsLoading(true);
    setAction('approve');

    try {
      const response = await fetch(`/api/admin/professor-requests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'APPROVED',
          admin_notes: adminNotes || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Eroare la aprobare');
      }

      toast.success('Cererea a fost aprobată cu succes');
      onRequestUpdated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Eroare la aprobare');
    } finally {
      setIsLoading(false);
      setAction(null);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Te rugăm să specifici motivul respingerii');
      return;
    }

    setIsLoading(true);
    setAction('reject');

    try {
      const response = await fetch(`/api/admin/professor-requests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          rejection_reason: rejectionReason,
          admin_notes: adminNotes || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Eroare la respingere');
      }

      toast.success('Cererea a fost respinsă');
      onRequestUpdated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Eroare la respingere');
    } finally {
      setIsLoading(false);
      setAction(null);
    }
  };

  const userName =
    request.user.first_name || request.user.last_name
      ? `${request.user.first_name || ''} ${request.user.last_name || ''}`.trim()
      : 'Necompletat';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Cerere Rol Profesor
          </DialogTitle>
          <DialogDescription>Detaliile cererii de acces pentru rolul de profesor</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status curent:</span>
            {getStatusBadge(request.status)}
          </div>

          <Separator />

          {/* User Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Informații Solicitant</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Nume complet</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{userName}</span>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{request.user.email}</span>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Departament</Label>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {request.department || request.user.faculty || '-'}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Data cererii</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(request.created_at), 'd MMMM yyyy, HH:mm', {
                      locale: ro,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Request Reason */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Motivul cererii
            </h4>
            <div className="rounded-md border bg-muted/30 p-4">
              <p className="text-sm whitespace-pre-wrap">{request.reason}</p>
            </div>
          </div>

          {/* Supporting Documents */}
          {request.supporting_documents && request.supporting_documents.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Documente suport</h4>
                <div className="space-y-2">
                  {request.supporting_documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      Document {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Review Information (if already reviewed) */}
          {request.status !== 'PENDING' && request.reviewed_at && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium">Informații revizie</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Revizuit de</Label>
                    <span className="text-sm">
                      {request.reviewer
                        ? `${request.reviewer.first_name || ''} ${request.reviewer.last_name || ''}`.trim() ||
                          '-'
                        : '-'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Data reviziei</Label>
                    <span className="text-sm">
                      {format(new Date(request.reviewed_at), 'd MMMM yyyy, HH:mm', {
                        locale: ro,
                      })}
                    </span>
                  </div>
                </div>

                {request.rejection_reason && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">Motiv respingere</Label>
                    <div className="rounded-md border border-red-200 bg-red-50 p-3">
                      <p className="text-sm text-red-800">{request.rejection_reason}</p>
                    </div>
                  </div>
                )}

                {request.admin_notes && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">Note administrator</Label>
                    <p className="text-sm text-muted-foreground">{request.admin_notes}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Form (only for pending requests) */}
          {request.status === 'PENDING' && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium">Acțiune</h4>

                <div className="space-y-2">
                  <Label htmlFor="adminNotes">Note administrator (opțional)</Label>
                  <Textarea
                    id="adminNotes"
                    placeholder="Adaugă note interne despre această cerere..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rejectionReason">
                    Motiv respingere{' '}
                    <span className="text-muted-foreground">(necesar pentru respingere)</span>
                  </Label>
                  <Textarea
                    id="rejectionReason"
                    placeholder="Explică de ce cererea a fost respinsă..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium">Atenție</p>
                      <p>
                        Aprobarea va schimba automat rolul utilizatorului în &quot;profesor&quot;,
                        oferindu-i acces la funcționalitățile specifice profesorilor.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Închide
          </Button>

          {request.status === 'PENDING' && (
            <>
              <Button variant="destructive" onClick={handleReject} disabled={isLoading}>
                {isLoading && action === 'reject' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Respinge
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading && action === 'approve' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Aprobă
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
