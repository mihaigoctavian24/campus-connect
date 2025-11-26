'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TimePicker } from '@/components/ui/time-picker';
import { X, Loader2, Save } from 'lucide-react';

interface EditSessionDialogProps {
  session: {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    max_participants?: number;
  };
  activityId: string;
  onClose: () => void;
  onSave: (sessionId: string, data: any) => Promise<void>;
}

export function EditSessionDialog({
  session,
  activityId: _activityId,
  onClose,
  onSave,
}: EditSessionDialogProps) {
  const [formData, setFormData] = useState({
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    max_participants: undefined as number | undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      setFormData({
        date: session.date,
        start_time: session.start_time,
        end_time: session.end_time,
        location: session.location,
        max_participants: session.max_participants,
      });
    }
  }, [session]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = 'Selectează data';
    if (!formData.start_time) newErrors.start_time = 'Selectează ora de început';
    if (!formData.end_time) newErrors.end_time = 'Selectează ora de final';
    if (!formData.location) newErrors.location = 'Introdu locația';

    // Validate that end time is after start time
    if (formData.start_time && formData.end_time) {
      const [startHour, startMin] = formData.start_time.split(':').map(Number);
      const [endHour, endMin] = formData.end_time.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (endMinutes <= startMinutes) {
        newErrors.end_time = 'Ora de final trebuie să fie după ora de început';
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
      await onSave(session.id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating session:', error);
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
          <h2 className="text-2xl font-medium text-[#001f3f]">Editează Sesiune</h2>
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
            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Dată *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full rounded-lg border ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                disabled={isSubmitting}
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                  Ora de Început *
                </label>
                <TimePicker
                  value={formData.start_time}
                  onChange={(value) => setFormData({ ...formData, start_time: value })}
                  placeholder="--:--"
                  disabled={isSubmitting}
                />
                {errors.start_time && (
                  <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                  Ora de Final *
                </label>
                <TimePicker
                  value={formData.end_time}
                  onChange={(value) => setFormData({ ...formData, end_time: value })}
                  placeholder="--:--"
                  disabled={isSubmitting}
                />
                {errors.end_time && <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Locație *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={`w-full rounded-lg border ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                placeholder="ex. Sala A101, Corp A"
                disabled={isSubmitting}
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            {/* Max Participants */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                Număr Maxim de Participanți (opțional)
              </label>
              <input
                type="number"
                min="1"
                value={formData.max_participants || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_participants: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20"
                disabled={isSubmitting}
              />
            </div>

            {/* Warning */}
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-sm text-amber-800">
                <strong>Notă:</strong> Modificările vor fi salvate imediat. Studenții înrolați vor
                vedea actualizările în secțiunea lor &quot;Activitățile Mele&quot;.
              </p>
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
                  Se salvează...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Salvează Modificările
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
