'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { XCircle } from 'lucide-react';
import { MessageTemplateSelector, MessageTemplate } from './MessageTemplateSelector';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: string;
  applicationIds: string[];
  studentNames?: string[];
  isBulk: boolean;
  onComplete: () => void;
}

const REJECTION_REASONS = [
  'Poziția a fost ocupată',
  'Profilul nu se potrivește cerințelor',
  'Insuficientă experiență',
  'Conflict de program',
  'Altul',
];

const REJECT_MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'standard',
    label: 'Standard',
    category: 'professional',
    message:
      'Mulțumim pentru aplicație. Din păcate, nu putem continua cu candidatura ta în acest moment.',
  },
  {
    id: 'encouraging',
    label: 'Încurajator',
    category: 'encouraging',
    message:
      'Îți mulțumim pentru interes și pentru timpul dedicat aplicației. Deși nu putem accepta candidatura ta acum, te încurajăm să aplici pentru alte oportunități în viitor.',
  },
  {
    id: 'detailed',
    label: 'Detaliat',
    category: 'friendly',
    message:
      'Îți mulțumim sincer pentru interesul manifestat față de această activitate. După o analiză atentă a tuturor aplicațiilor primite, am decis să mergem înainte cu alți candidați. Te rugăm să nu te descurajezi - competiția a fost strânsă și apreciem foarte mult timpul pe care l-ai dedicat aplicației tale. Rămânem deschiși la colaborări viitoare!',
  },
  {
    id: 'custom',
    label: 'Personalizat',
    message: '',
  },
];

export function RejectModal({
  isOpen,
  onClose,
  activityId,
  applicationIds,
  studentNames = [],
  isBulk,
  onComplete,
}: RejectModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('encouraging');
  const [customMessage, setCustomMessage] = useState(
    REJECT_MESSAGE_TEMPLATES[1].message // Default to encouraging
  );
  const [rejectionReason, setRejectionReason] = useState('');
  const [addToWaitlist, setAddToWaitlist] = useState(false);
  const [confirmBulkAction, setConfirmBulkAction] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId !== 'custom') {
      const template = REJECT_MESSAGE_TEMPLATES.find((t) => t.id === templateId);
      if (template) {
        setCustomMessage(template.message);
      }
    } else {
      setCustomMessage('');
    }
  };

  const handleSubmit = async () => {
    if (!rejectionReason) {
      toast.error('Selectează un motiv pentru respingere');
      return;
    }

    if (selectedTemplateId === 'custom' && !customMessage.trim()) {
      toast.error('Introdu un mesaj personalizat');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isBulk) {
        // Bulk reject
        const response = await fetch(`/api/activities/${activityId}/enrollments/bulk-reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            enrollment_ids: applicationIds,
            custom_message: customMessage || null,
            rejection_reason: rejectionReason,
            add_to_waitlist: addToWaitlist,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Eroare la procesarea aplicațiilor');
        }

        const data = await response.json();
        toast.success(data.message);
      } else {
        // Single reject
        const response = await fetch(
          `/api/activities/${activityId}/enrollments/${applicationIds[0]}/reject`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              custom_message: customMessage || null,
              rejection_reason: rejectionReason,
              add_to_waitlist: addToWaitlist,
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Eroare la procesarea aplicației');
        }

        const data = await response.json();
        toast.success(data.message);
      }

      onComplete();
      handleClose();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error(error instanceof Error ? error.message : 'Eroare la procesare');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedTemplateId('encouraging');
    setCustomMessage(REJECT_MESSAGE_TEMPLATES[1].message);
    setRejectionReason('');
    setAddToWaitlist(false);
    setConfirmBulkAction(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Respinge Aplicația
          </DialogTitle>
          <DialogDescription>
            {isBulk
              ? `Acțiune pentru ${applicationIds.length} aplicații. Selectează un motiv și adaugă un mesaj pentru student.`
              : 'Selectează un motiv și adaugă un mesaj empatic pentru student.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview Section for Bulk Operations */}
          {isBulk && studentNames.length > 0 && (
            <Card className="p-4 bg-amber-50 border-amber-200">
              <h4 className="font-medium text-sm text-amber-900 mb-2">
                Aplicații Selectate ({applicationIds.length})
              </h4>
              <p className="text-xs text-amber-700 mb-3">
                Vei {addToWaitlist ? 'adăuga în lista de așteptare' : 'respinge'} următorii{' '}
                {applicationIds.length} studenți:
              </p>
              <div className="text-xs text-amber-800 space-y-1">
                <ul className="list-disc list-inside space-y-1">
                  {studentNames.slice(0, 5).map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                  {applicationIds.length > 5 && (
                    <li className="font-medium">
                      ... și încă {applicationIds.length - 5} studenți
                    </li>
                  )}
                </ul>
              </div>
            </Card>
          )}

          {/* Warning Banner for Bulk Reject */}
          {isBulk && !addToWaitlist && (
            <Card className="p-3 bg-red-50 border-red-200">
              <p className="text-xs text-red-700">
                ⚠️ <strong>Atenție:</strong> Toți studenții selectați vor primi email de respingere
                și nu vor mai putea participa la această activitate.
              </p>
            </Card>
          )}

          {/* Confirmation Checkbox for Bulk > 5 */}
          {isBulk && applicationIds.length > 5 && (
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={confirmBulkAction}
                  onCheckedChange={(checked) => setConfirmBulkAction(checked as boolean)}
                  className="mt-1"
                />
                <label className="text-sm text-red-900 cursor-pointer">
                  Confirm că vreau să{' '}
                  <strong>
                    {addToWaitlist ? 'adaug în lista de așteptare' : 'resping'} aceste{' '}
                    {applicationIds.length} aplicații
                  </strong>
                  . Toți studenții vor primi email cu decizia.
                </label>
              </div>
            </Card>
          )}

          {/* Rejection Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Motiv Respingere <span className="text-destructive">*</span>
            </label>
            <Select value={rejectionReason} onValueChange={setRejectionReason}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează un motiv..." />
              </SelectTrigger>
              <SelectContent>
                {REJECTION_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Alege un șablon de mesaj</label>
            <MessageTemplateSelector
              templates={REJECT_MESSAGE_TEMPLATES}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={handleTemplateSelect}
              type="reject"
            />
          </div>

          {/* Custom Message Field (only for custom template) */}
          {selectedTemplateId === 'custom' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Mesaj Personalizat <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Scrie un mesaj empatic și încurajator pentru student..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">{customMessage.length} caractere</p>
            </div>
          )}

          {/* Edit pre-selected template message */}
          {selectedTemplateId !== 'custom' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Editează mesajul <span className="text-muted-foreground">(opțional)</span>
              </label>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Poți edita șablonul selectat sau îl poți folosi așa cum este.
              </p>
            </div>
          )}

          {/* Add to Waitlist Option */}
          <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50 border border-amber-200">
            <Checkbox
              id="waitlist"
              checked={addToWaitlist}
              onCheckedChange={(checked) => setAddToWaitlist(checked as boolean)}
            />
            <label htmlFor="waitlist" className="text-sm cursor-pointer flex-1">
              Adaugă în lista de așteptare (nu respinge definitiv)
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Anulează
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !rejectionReason ||
              (selectedTemplateId === 'custom' && !customMessage.trim()) ||
              (isBulk && applicationIds.length > 5 && !confirmBulkAction)
            }
            className="bg-destructive hover:bg-destructive/90"
          >
            {isSubmitting
              ? 'Se procesează...'
              : addToWaitlist
                ? 'Adaugă în Listă Așteptare'
                : 'Confirmă Respingere'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
