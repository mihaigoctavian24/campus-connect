'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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

interface AcceptRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'accept' | 'reject';
  activityId: string;
  applicationIds: string[];
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

const ACCEPT_MESSAGE_TEMPLATES = [
  {
    label: 'Standard',
    message: 'Felicitări! Aplicația ta a fost acceptată. Te așteptăm cu drag!',
  },
  {
    label: 'Detaliat',
    message:
      'Felicitări! Am analizat cu atenție aplicația ta și suntem încântați să te avem în echipă. Vom lua legătura în curând cu detalii despre primii pași.',
  },
  {
    label: 'Personalizat',
    message: '',
  },
];

const REJECT_MESSAGE_TEMPLATES = [
  {
    label: 'Standard',
    message:
      'Mulțumim pentru aplicație. Din păcate, nu putem continua cu candidatura ta în acest moment.',
  },
  {
    label: 'Încurajator',
    message:
      'Îți mulțumim pentru interes și pentru timpul dedicat aplicației. Deși nu putem accepta candidatura ta acum, te încurajăm să aplici pentru alte oportunități în viitor.',
  },
  {
    label: 'Personalizat',
    message: '',
  },
];

export function AcceptRejectModal({
  isOpen,
  onClose,
  actionType,
  activityId,
  applicationIds,
  isBulk,
  onComplete,
}: AcceptRejectModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [customMessage, setCustomMessage] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [addToWaitlist, setAddToWaitlist] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const templates =
    actionType === 'accept' ? ACCEPT_MESSAGE_TEMPLATES : REJECT_MESSAGE_TEMPLATES;

  const handleTemplateChange = (value: string) => {
    const index = parseInt(value);
    setSelectedTemplate(index);
    if (index !== templates.length - 1) {
      // Not "Personalizat"
      setCustomMessage(templates[index].message);
    } else {
      setCustomMessage('');
    }
  };

  const handleSubmit = async () => {
    if (actionType === 'reject' && !rejectionReason) {
      toast.error('Selectează un motiv pentru respingere');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isBulk) {
        // Bulk action
        const endpoint =
          actionType === 'accept'
            ? `/api/activities/${activityId}/enrollments/bulk-accept`
            : `/api/activities/${activityId}/enrollments/bulk-reject`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            enrollment_ids: applicationIds,
            custom_message: customMessage || null,
            rejection_reason: actionType === 'reject' ? rejectionReason : undefined,
            add_to_waitlist: actionType === 'reject' ? addToWaitlist : undefined,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Eroare la procesarea aplicațiilor');
        }

        const data = await response.json();
        toast.success(data.message);
      } else {
        // Single action
        const endpoint =
          actionType === 'accept'
            ? `/api/activities/${activityId}/enrollments/${applicationIds[0]}/accept`
            : `/api/activities/${activityId}/enrollments/${applicationIds[0]}/reject`;

        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            custom_message: customMessage || null,
            rejection_reason: actionType === 'reject' ? rejectionReason : undefined,
            add_to_waitlist: actionType === 'reject' ? addToWaitlist : undefined,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Eroare la procesarea aplicației');
        }

        const data = await response.json();
        toast.success(data.message);
      }

      onComplete();
      handleClose();
    } catch (error: any) {
      console.error('Error submitting action:', error);
      toast.error(error.message || 'Eroare la procesare');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedTemplate(0);
    setCustomMessage('');
    setRejectionReason('');
    setAddToWaitlist(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {actionType === 'accept' ? 'Acceptă Aplicația' : 'Respinge Aplicația'}
          </DialogTitle>
          <DialogDescription>
            {isBulk
              ? `Acțiune pentru ${applicationIds.length} aplicații`
              : 'Adaugă un mesaj personalizat (opțional)'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rejection Reason (only for reject) */}
          {actionType === 'reject' && (
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
          )}

          {/* Message Template Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Șablon Mesaj</label>
            <Select
              value={selectedTemplate.toString()}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Message Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Mesaj Personalizat{' '}
              <span className="text-muted-foreground">(opțional)</span>
            </label>
            <Textarea
              placeholder="Adaugă un mesaj personalizat pentru student..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
              disabled={selectedTemplate !== templates.length - 1}
            />
            <p className="text-xs text-muted-foreground">
              {customMessage.length} caractere
            </p>
          </div>

          {/* Add to Waitlist Option (only for reject) */}
          {actionType === 'reject' && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="waitlist"
                checked={addToWaitlist}
                onCheckedChange={(checked) => setAddToWaitlist(checked as boolean)}
              />
              <label htmlFor="waitlist" className="text-sm cursor-pointer">
                Adaugă în lista de așteptare (nu respinge definitiv)
              </label>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Anulează
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={
              actionType === 'accept'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-destructive hover:bg-destructive/90'
            }
          >
            {isSubmitting
              ? 'Se procesează...'
              : actionType === 'accept'
                ? 'Confirmă Acceptare'
                : addToWaitlist
                  ? 'Adaugă în Listă Așteptare'
                  : 'Confirmă Respingere'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
