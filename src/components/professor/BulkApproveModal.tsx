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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, User } from 'lucide-react';
import { HoursRequest } from './HoursValidation';

interface BulkApproveModalProps {
  requests: HoursRequest[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => Promise<void>;
}

export function BulkApproveModal({ requests, isOpen, onClose, onConfirm }: BulkApproveModalProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total hours
  const totalHours = requests.reduce((sum, request) => sum + request.hours, 0);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(notes.trim() || undefined);
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Bulk approve error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Aprobare în Masă - Confirmare
          </DialogTitle>
          <DialogDescription>
            Ești pe cale să aprobi {requests.length} cerer{requests.length > 1 ? 'i' : 'e'} de ore
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Box */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-700" />
                <span className="font-semibold text-green-900">Total ore aprobate:</span>
              </div>
              <span className="text-2xl font-bold text-green-700">{totalHours} ore</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-green-700 font-medium">Cereri:</span>
                <span className="ml-2 text-green-900">{requests.length}</span>
              </div>
              <div>
                <span className="text-green-700 font-medium">Studenți:</span>
                <span className="ml-2 text-green-900">
                  {new Set(requests.map((r) => r.student.id)).size}
                </span>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Cereri selectate:</Label>
            <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between text-sm p-2 bg-muted rounded hover:bg-muted/80"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {request.student.first_name} {request.student.last_name}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground text-xs">{request.activity.title}</span>
                  </div>
                  <span className="font-medium text-green-600">{request.hours} ore</span>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Notes */}
          <div className="space-y-2">
            <Label htmlFor="bulk-notes">
              Notițe (opțional)
              <span className="text-muted-foreground text-sm ml-2">
                - aceste notițe vor fi adăugate la toate cererile
              </span>
            </Label>
            <Textarea
              id="bulk-notes"
              placeholder="Ex: Aprobat conform participării..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-900">
              ⚠️ <strong>Atenție:</strong> Această acțiune va aproba toate cele {requests.length}{' '}
              cereri selectate și va trimite emailuri de notificare studenților. Această acțiune nu
              poate fi anulată.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Anulează
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Se aprobă...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmă aprobarea ({requests.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
