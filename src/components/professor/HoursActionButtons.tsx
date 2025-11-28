'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, MessageSquare, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface HoursActionButtonsProps {
  requestId: string;
  onApprove: (requestId: string, notes?: string) => Promise<void>;
  onReject: (requestId: string, reason: string) => Promise<void>;
  onRequestInfo: (requestId: string, message: string) => Promise<void>;
}

type ActionType = 'approve' | 'reject' | 'request-info' | null;

export function HoursActionButtons({
  requestId,
  onApprove,
  onReject,
  onRequestInfo,
}: HoursActionButtonsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openDialog = (type: Exclude<ActionType, null>) => {
    setActionType(type);
    setInputText('');
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setActionType(null);
    setInputText('');
  };

  const handleSubmit = async () => {
    if (actionType === 'reject' || actionType === 'request-info') {
      if (!inputText.trim()) {
        toast.error(
          actionType === 'reject'
            ? 'Te rugăm să introduci un motiv pentru respingere'
            : 'Te rugăm să introduci un mesaj pentru student'
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      switch (actionType) {
        case 'approve':
          await onApprove(requestId, inputText.trim() || undefined);
          toast.success('Cerere aprobată cu succes');
          break;
        case 'reject':
          await onReject(requestId, inputText.trim());
          toast.success('Cerere respinsă');
          break;
        case 'request-info':
          await onRequestInfo(requestId, inputText.trim());
          toast.success('Mesaj trimis studentului');
          break;
      }
      closeDialog();
    } catch (error) {
      console.error('Action error:', error);
      toast.error(error instanceof Error ? error.message : 'Eroare la procesarea acțiunii');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDialogConfig = () => {
    switch (actionType) {
      case 'approve':
        return {
          title: 'Aprobă Cerere',
          description: 'Confirmi aprobarea acestor ore? Poți adăuga notițe opționale.',
          placeholder: 'Notițe opționale pentru student...',
          submitText: 'Aprobă',
          submitVariant: 'default' as const,
        };
      case 'reject':
        return {
          title: 'Respinge Cerere',
          description: 'Te rugăm să specifici motivul respingerii (obligatoriu).',
          placeholder: 'Motivul respingerii (va fi trimis studentului)...',
          submitText: 'Respinge',
          submitVariant: 'destructive' as const,
        };
      case 'request-info':
        return {
          title: 'Solicită Informații Suplimentare',
          description: 'Trimite un mesaj studentului pentru a solicita clarificări.',
          placeholder: 'Ce informații suplimentare ai nevoie?',
          submitText: 'Trimite Mesaj',
          submitVariant: 'default' as const,
        };
      default:
        return null;
    }
  };

  const dialogConfig = getDialogConfig();

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="default"
          className="bg-green-500 hover:bg-green-600"
          onClick={() => openDialog('approve')}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Aprobă
        </Button>
        <Button size="sm" variant="destructive" onClick={() => openDialog('reject')}>
          <XCircle className="h-4 w-4 mr-1" />
          Respinge
        </Button>
        <Button size="sm" variant="outline" onClick={() => openDialog('request-info')}>
          <MessageSquare className="h-4 w-4 mr-1" />
          Cere Info
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {dialogConfig && (
        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{dialogConfig.title}</DialogTitle>
              <DialogDescription>{dialogConfig.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="action-text">
                  {actionType === 'approve'
                    ? 'Notițe (opțional)'
                    : actionType === 'reject'
                      ? 'Motiv (obligatoriu)'
                      : 'Mesaj (obligatoriu)'}
                </Label>
                <Textarea
                  id="action-text"
                  placeholder={dialogConfig.placeholder}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                {actionType !== 'approve' && (
                  <p className="text-xs text-muted-foreground">
                    Mesajul va fi trimis prin email studentului
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeDialog} disabled={isSubmitting}>
                Anulează
              </Button>
              <Button
                variant={dialogConfig.submitVariant}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Se procesează...
                  </>
                ) : (
                  dialogConfig.submitText
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
