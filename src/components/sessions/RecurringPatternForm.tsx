'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TimePicker } from '@/components/ui/time-picker';
import { Loader2, Eye, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface Session {
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants?: number;
}

interface RecurringPatternFormProps {
  activityId: string;
  defaultLocation: string;
  defaultMaxParticipants: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const DAYS_OF_WEEK = [
  { value: 1, label: 'Luni' },
  { value: 2, label: 'Marți' },
  { value: 3, label: 'Miercuri' },
  { value: 4, label: 'Joi' },
  { value: 5, label: 'Vineri' },
  { value: 6, label: 'Sâmbătă' },
  { value: 0, label: 'Duminică' },
];

export function RecurringPatternForm({
  activityId,
  defaultLocation,
  defaultMaxParticipants,
  onSuccess,
  onCancel,
}: RecurringPatternFormProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState(defaultLocation);
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>(
    defaultMaxParticipants
  );

  const [frequency, setFrequency] = useState<'WEEKLY' | 'BIWEEKLY' | 'CUSTOM'>('WEEKLY');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);

  const [showPreview, setShowPreview] = useState(false);
  const [previewSessions, setPreviewSessions] = useState<Session[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const generatePreview = () => {
    setErrors({});

    // Validation
    if (!startDate) {
      setErrors((e) => ({ ...e, startDate: 'Selectează data de început' }));
      return;
    }
    if (!endDate) {
      setErrors((e) => ({ ...e, endDate: 'Selectează data de final' }));
      return;
    }
    if (!startTime) {
      setErrors((e) => ({ ...e, startTime: 'Selectează ora de început' }));
      return;
    }
    if (!endTime) {
      setErrors((e) => ({ ...e, endTime: 'Selectează ora de final' }));
      return;
    }
    if (!location) {
      setErrors((e) => ({ ...e, location: 'Introdu locația' }));
      return;
    }
    if (frequency === 'CUSTOM' && selectedDays.length === 0) {
      setErrors((e) => ({ ...e, days: 'Selectează cel puțin o zi' }));
      return;
    }

    setIsGenerating(true);

    // Generate sessions preview
    const sessions: Session[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(start);

    while (current <= end) {
      let shouldAdd = false;

      if (frequency === 'WEEKLY') {
        shouldAdd = true;
        current.setDate(current.getDate() + 7);
      } else if (frequency === 'BIWEEKLY') {
        shouldAdd = true;
        current.setDate(current.getDate() + 14);
      } else if (frequency === 'CUSTOM') {
        const dayOfWeek = current.getDay() as DayOfWeek;
        if (selectedDays.includes(dayOfWeek)) {
          shouldAdd = true;
        }
        current.setDate(current.getDate() + 1);
      }

      if (shouldAdd && current <= end) {
        sessions.push({
          date: format(new Date(current), 'yyyy-MM-dd'),
          start_time: startTime,
          end_time: endTime,
          location,
          max_participants: maxParticipants,
        });
      }

      // Safety limit
      if (sessions.length > 365) break;
    }

    setPreviewSessions(sessions);
    setShowPreview(true);
    setIsGenerating(false);
  };

  const handleSubmit = async () => {
    if (previewSessions.length === 0) {
      alert('Generează preview-ul mai întâi');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/activities/${activityId}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session: {
            date: startDate,
            start_time: startTime,
            end_time: endTime,
            location,
            max_participants: maxParticipants,
          },
          recurring: {
            pattern: frequency,
            end_date: endDate,
            custom_days: frequency === 'CUSTOM' ? selectedDays : undefined,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create sessions');
      }

      const result = await response.json();
      alert(`${result.sessions.length} sesiuni create cu succes!`);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating sessions:', error);
      alert(error instanceof Error ? error.message : 'A apărut o eroare');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!showPreview ? (
        <>
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                Data de Început *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full rounded-lg border ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                Data de Final *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full rounded-lg border ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                Ora de Început *
              </label>
              <TimePicker value={startTime} onChange={setStartTime} placeholder="--:--" />
              {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                Ora de Final *
              </label>
              <TimePicker value={endTime} onChange={setEndTime} placeholder="--:--" />
              {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#001f3f]">Locație *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full rounded-lg border ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
              placeholder="ex. Sala A101, Corp A"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          {/* Frequency */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#001f3f]">Frecvență *</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as 'WEEKLY' | 'BIWEEKLY' | 'CUSTOM')}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20"
            >
              <option value="WEEKLY">Săptămânal</option>
              <option value="BIWEEKLY">Bisăptămânal</option>
              <option value="CUSTOM">Personalizat (selectează zilele)</option>
            </select>
          </div>

          {/* Day Selector for CUSTOM */}
          {frequency === 'CUSTOM' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                Selectează Zilele *
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value as DayOfWeek)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      selectedDays.includes(day.value as DayOfWeek)
                        ? 'bg-[#FFD600] text-[#001f3f]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              {errors.days && <p className="mt-1 text-sm text-red-600">{errors.days}</p>}
            </div>
          )}

          {/* Max Participants */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#001f3f]">
              Număr Maxim de Participanți (opțional)
            </label>
            <input
              type="number"
              min="1"
              value={maxParticipants || ''}
              onChange={(e) =>
                setMaxParticipants(e.target.value ? parseInt(e.target.value) : undefined)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20"
              placeholder={`Implicit: ${defaultMaxParticipants}`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="flex-1"
                disabled={isGenerating}
              >
                Anulează
              </Button>
            )}
            <Button
              type="button"
              onClick={generatePreview}
              disabled={isGenerating}
              className="flex-1 bg-[#FFD600] text-[#001f3f] hover:bg-[#FFD600]/90"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Generare...
                </>
              ) : (
                <>
                  <Eye className="mr-2 size-4" />
                  Previzualizează Sesiuni
                </>
              )}
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Preview Sessions */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-[#001f3f]">
                <Calendar className="mr-2 inline size-5" />
                Preview Sesiuni Generate
              </h3>
              <span className="rounded-full bg-[#FFD600] px-3 py-1 text-sm font-medium text-[#001f3f]">
                {previewSessions.length} sesiuni
              </span>
            </div>

            <div className="max-h-96 space-y-2 overflow-y-auto">
              {previewSessions.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                >
                  <div>
                    <p className="font-medium text-[#001f3f]">
                      {format(new Date(session.date), 'EEEE, dd MMMM yyyy', { locale: ro })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {session.start_time} - {session.end_time} • {session.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => setShowPreview(false)}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              Înapoi
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-[#FFD600] text-[#001f3f] hover:bg-[#FFD600]/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Se creează...
                </>
              ) : (
                `Creează ${previewSessions.length} Sesiuni`
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
