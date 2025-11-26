'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TimePicker } from '@/components/ui/time-picker';
import { X, Loader2, Calendar, AlertCircle } from 'lucide-react';

interface RescheduleSessionDialogProps {
  session: {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
  };
  activityId: string;
  onClose: () => void;
  onSave: (sessionId: string, data: any) => Promise<void>;
}

export function RescheduleSessionDialog({
  session,
  activityId,
  onClose,
  onSave,
}: RescheduleSessionDialogProps) {
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      // Start with empty values for reschedule - force user to pick new date/time
      setNewDate('');
      setNewStartTime('');
      setNewEndTime('');
      setReason('');
    }
  }, [session]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newDate) newErrors.newDate = 'Selectează noua dată';
    if (!newStartTime) newErrors.newStartTime = 'Selectează noua oră de început';
    if (!newEndTime) newErrors.newEndTime = 'Selectează noua oră de final';
    if (!reason.trim()) newErrors.reason = 'Introdu un motiv pentru reprogramare';

    // Validate that new date is in the future
    if (newDate) {
      const selectedDate = new Date(newDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.newDate = 'Data trebuie să fie în viitor';
      }
    }

    // Validate that end time is after start time
    if (newStartTime && newEndTime) {
      const [startHour, startMin] = newStartTime.split(':').map(Number);
      const [endHour, endMin] = newEndTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (endMinutes <= startMinutes) {
        newErrors.newEndTime = 'Ora de final trebuie să fie după ora de început';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onSave(session.id, {
        date: newDate,
        start_time: newStartTime,
        end_time: newEndTime,
        // TODO: Send notification to enrolled students with reason
        // This will be implemented in the notification system (Week 21-22)
      });
      onClose();
    } catch (error) {
      console.error('Error rescheduling session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Calendar className="size-6 text-[#001f3f]" />
            <h2 className="text-2xl font-medium text-[#001f3f]">Reprogramează Sesiune</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Current Session Info */}
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="mb-2 text-sm font-medium text-blue-900">Sesiune Curentă:</p>
              <p className="text-sm text-blue-800">
                <strong>Dată:</strong> {session.date}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Orar:</strong> {session.start_time} - {session.end_time}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Locație:</strong> {session.location}
              </p>
            </div>

            {/* New Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                Noua Dată *
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className={`w-full rounded-lg border ${
                  errors.newDate ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                disabled={isSubmitting}
              />
              {errors.newDate && <p className="mt-1 text-sm text-red-600">{errors.newDate}</p>}
            </div>

            {/* New Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                  Noua Oră de Început *
                </label>
                <TimePicker
                  value={newStartTime}
                  onChange={setNewStartTime}
                  placeholder="--:--"
                  disabled={isSubmitting}
                />
                {errors.newStartTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.newStartTime}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                  Noua Oră de Final *
                </label>
                <TimePicker
                  value={newEndTime}
                  onChange={setNewEndTime}
                  placeholder="--:--"
                  disabled={isSubmitting}
                />
                {errors.newEndTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.newEndTime}</p>
                )}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                Motiv Reprogramare *
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={`w-full rounded-lg border ${
                  errors.reason ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                placeholder="ex. Conflicte de program, locație indisponibilă, profesor indisponibil..."
                disabled={isSubmitting}
              />
              {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Acest motiv va fi inclus în notificarea trimisă către studenții înrolați
              </p>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4">
              <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">Atenție!</p>
                <p className="mt-1 text-sm text-amber-800">
                  Reprogramarea acestei sesiuni va notifica automat toți studenții înrolați. Asigură-te că noua dată și oră sunt definitive înainte de confirmare.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              Anulează
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#FFD600] text-[#001f3f] hover:bg-[#FFD600]/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Se reprogramează...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 size-4" />
                  Confirmă Reprogramarea
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
