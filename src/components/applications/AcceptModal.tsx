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
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import { MessageTemplateSelector, MessageTemplate } from './MessageTemplateSelector';

interface AcceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: string;
  applicationIds: string[];
  studentNames?: string[];
  isBulk: boolean;
  onComplete: () => void;
}

const ACCEPT_MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'standard',
    label: 'Standard',
    category: 'professional',
    message: 'Felicitări! Aplicația ta a fost acceptată. Te așteptăm cu drag!',
  },
  {
    id: 'detailed',
    label: 'Detaliat',
    category: 'friendly',
    message:
      'Felicitări! Am analizat cu atenție aplicația ta și suntem încântați să te avem în echipă. Vom lua legătura în curând cu detalii despre primii pași.',
  },
  {
    id: 'enthusiastic',
    label: 'Entuziast',
    category: 'encouraging',
    message:
      'Excelente vești! Aplicația ta a fost acceptată și suntem foarte entuziasm ați să colaborăm cu tine. Abia așteptăm să începem această experiență împreună!',
  },
  {
    id: 'custom',
    label: 'Personalizat',
    message: '',
  },
];

export function AcceptModal({
  isOpen,
  onClose,
  activityId,
  applicationIds,
  studentNames = [],
  isBulk,
  onComplete,
}: AcceptModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('standard');
  const [customMessage, setCustomMessage] = useState('');
  const [confirmBulkAction, setConfirmBulkAction] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId !== 'custom') {
      const template = ACCEPT_MESSAGE_TEMPLATES.find((t) => t.id === templateId);
      if (template) {
        setCustomMessage(template.message);
      }
    } else {
      setCustomMessage('');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (isBulk) {
        // Bulk accept
        const response = await fetch(`/api/activities/${activityId}/enrollments/bulk-accept`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            enrollment_ids: applicationIds,
            custom_message: customMessage || null,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Eroare la procesarea aplicațiilor');
        }

        const data = await response.json();
        toast.success(data.message);
      } else {
        // Single accept
        const response = await fetch(
          `/api/activities/${activityId}/enrollments/${applicationIds[0]}/accept`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              custom_message: customMessage || null,
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
      console.error('Error accepting application:', error);
      toast.error(error instanceof Error ? error.message : 'Eroare la procesare');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedTemplateId('standard');
    setCustomMessage('');
    setConfirmBulkAction(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Acceptă Aplicația
          </DialogTitle>
          <DialogDescription>
            {isBulk
              ? `Acțiune pentru ${applicationIds.length} aplicații. Adaugă un mesaj de bun venit personalizat (opțional).`
              : 'Adaugă un mesaj de bun venit personalizat pentru student (opțional).'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview Section for Bulk Operations */}
          {isBulk && studentNames.length > 0 && (
            <Card className="p-4 bg-green-50 border-green-200">
              <h4 className="font-medium text-sm text-green-900 mb-2">
                Aplicații Selectate ({applicationIds.length})
              </h4>
              <p className="text-xs text-green-700 mb-3">
                Vei accepta următorii {applicationIds.length} studenți în această activitate:
              </p>
              <div className="text-xs text-green-800 space-y-1">
                <ul className="list-disc list-inside space-y-1">
                  {studentNames.slice(0, 5).map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                  {applicationIds.length > 5 && (
                    <li className="font-medium">... și încă {applicationIds.length - 5} studenți</li>
                  )}
                </ul>
              </div>
            </Card>
          )}

          {/* Confirmation Checkbox for Bulk > 5 */}
          {isBulk && applicationIds.length > 5 && (
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={confirmBulkAction}
                  onCheckedChange={(checked) => setConfirmBulkAction(checked as boolean)}
                  className="mt-1"
                />
                <label className="text-sm text-amber-900 cursor-pointer">
                  Confirm că vreau să accept aceste <strong>{applicationIds.length} aplicații</strong>
                  . Toți studenții vor primi email de acceptare și vor fi adăugați la activitate.
                </label>
              </div>
            </Card>
          )}

          {/* Template Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Alege un șablon de mesaj</label>
            <MessageTemplateSelector
              templates={ACCEPT_MESSAGE_TEMPLATES}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={handleTemplateSelect}
              type="accept"
            />
          </div>

          {/* Custom Message Field (only for custom template) */}
          {selectedTemplateId === 'custom' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Mesaj Personalizat <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Scrie un mesaj de bun venit personalizat pentru student..."
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
              (selectedTemplateId === 'custom' && !customMessage.trim()) ||
              (isBulk && applicationIds.length > 5 && !confirmBulkAction)
            }
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Se procesează...' : 'Confirmă Acceptare'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
