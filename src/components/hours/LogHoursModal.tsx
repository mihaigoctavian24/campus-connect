'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Clock,
  Calendar as CalendarIcon,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  isSameDay,
} from 'date-fns';
import { ro } from 'date-fns/locale';
import { EvidenceUpload } from './EvidenceUpload';
import { cn } from '@/components/ui/utils';

// Zod schema for the form (accepts Date object)
const formSchema = z.object({
  hours: z
    .number({
      required_error: 'Numărul de ore este obligatoriu',
      invalid_type_error: 'Introduceți un număr valid',
    })
    .min(0.5, 'Minim 0.5 ore (30 minute)')
    .max(24, 'Maxim 24 ore pe zi'),
  date: z.date({
    required_error: 'Data este obligatorie',
  }),
  description: z
    .string({
      required_error: 'Descrierea este obligatorie',
    })
    .min(20, 'Descrierea trebuie să conțină minim 20 caractere')
    .max(1000, 'Descrierea nu poate depăși 1000 caractere'),
  evidence_urls: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface LogHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollmentId: string;
  activityId: string;
  activityTitle: string;
  onSuccess?: () => void;
}

export function LogHoursModal({
  isOpen,
  onClose,
  enrollmentId,
  activityId,
  activityTitle,
  onSuccess,
}: LogHoursModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      evidence_urls: [],
    },
  });

  const selectedDate = watch('date');
  const description = watch('description') || '';

  const handleClose = () => {
    reset();
    setEvidenceUrls([]);
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Convert Date to ISO string for API
      const payload = {
        enrollment_id: enrollmentId,
        activity_id: activityId,
        hours: data.hours,
        date: data.date.toISOString().split('T')[0], // YYYY-MM-DD format
        description: data.description,
        evidence_urls: evidenceUrls.length > 0 ? evidenceUrls : undefined,
      };

      const response = await fetch('/api/hours/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Eroare la înregistrarea orelor');
      }

      toast.success('Orele au fost trimise pentru validare');
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error logging hours:', error);
      toast.error(error instanceof Error ? error.message : 'Eroare la înregistrarea orelor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Înregistrează Ore
          </DialogTitle>
          <DialogDescription>
            Înregistrează orele lucrate pentru <strong>{activityTitle}</strong>. Profesorul va
            valida cererea ta.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Data lucrului <span className="text-destructive">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, 'PPP', { locale: ro })
                  ) : (
                    <span>Selectează data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <div className="space-y-3">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="h-7 w-7"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium">
                      {format(currentMonth, 'MMMM yyyy', { locale: ro })}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="h-7 w-7"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Calendar Grid */}
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, index) => (
                          <th
                            key={index}
                            className="text-center text-xs font-normal text-muted-foreground p-2"
                          >
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const monthStart = startOfMonth(currentMonth);
                        const monthEnd = endOfMonth(currentMonth);
                        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
                        const firstDayOfWeek = monthStart.getDay();
                        const calendarDays: (Date | null)[] = [
                          ...Array(firstDayOfWeek).fill(null),
                          ...daysInMonth,
                        ];

                        return Array.from({ length: Math.ceil(calendarDays.length / 7) }).map(
                          (_, weekIndex) => (
                            <tr key={weekIndex}>
                              {calendarDays
                                .slice(weekIndex * 7, (weekIndex + 1) * 7)
                                .map((day, dayIndex) => {
                                  if (!day) {
                                    return <td key={dayIndex} className="p-1" />;
                                  }

                                  const isSelected = selectedDate
                                    ? isSameDay(day, selectedDate)
                                    : false;
                                  const isCurrentMonth = isSameMonth(day, currentMonth);
                                  const isTodayDate = isToday(day);
                                  const isFutureDate = day > new Date();

                                  return (
                                    <td key={dayIndex} className="p-0.5 text-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!isFutureDate) {
                                            setValue('date', day);
                                          }
                                        }}
                                        disabled={isFutureDate}
                                        className={cn(
                                          'w-8 h-8 rounded-md text-xs transition-colors',
                                          !isCurrentMonth && 'text-muted-foreground opacity-50',
                                          isFutureDate && 'cursor-not-allowed opacity-30',
                                          isSelected &&
                                            'bg-primary text-primary-foreground font-medium',
                                          !isSelected &&
                                            isTodayDate &&
                                            'bg-accent text-accent-foreground',
                                          !isSelected &&
                                            !isTodayDate &&
                                            !isFutureDate &&
                                            'hover:bg-accent hover:text-accent-foreground'
                                        )}
                                      >
                                        {format(day, 'd')}
                                      </button>
                                    </td>
                                  );
                                })}
                            </tr>
                          )
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
          </div>

          {/* Hours Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Număr de ore <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              step="0.5"
              min="0.5"
              max="24"
              placeholder="Ex: 2.5"
              {...register('hours', { valueAsNumber: true })}
            />
            {errors.hours && <p className="text-sm text-destructive">{errors.hours.message}</p>}
            <p className="text-xs text-muted-foreground">
              Introdu numărul de ore lucrate (minim 0.5, maxim 24)
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Descrierea activității <span className="text-destructive">*</span>
            </label>
            <Textarea
              placeholder="Descrie ce ai făcut în timpul acestor ore (minim 20 caractere)..."
              rows={5}
              className="resize-none"
              {...register('description')}
            />
            <div className="flex justify-between text-xs">
              {errors.description ? (
                <p className="text-destructive">{errors.description.message}</p>
              ) : (
                <p className="text-muted-foreground">Descrie în detaliu activitatea desfășurată</p>
              )}
              <p
                className={cn(
                  'text-muted-foreground',
                  description.length < 20 && 'text-destructive',
                  description.length > 1000 && 'text-destructive'
                )}
              >
                {description.length}/1000
              </p>
            </div>
          </div>

          {/* Evidence Upload (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Dovezi (opțional)
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Încarcă imagini sau documente care demonstrează munca ta (poze, screenshot-uri,
              PDF-uri)
            </p>
            <EvidenceUpload
              onUploadComplete={(urls) => {
                setEvidenceUrls(urls);
                setValue('evidence_urls', urls);
              }}
              maxFiles={5}
              maxSizeMB={5}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Anulează
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se trimite...
                </>
              ) : (
                'Trimite pentru Validare'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
