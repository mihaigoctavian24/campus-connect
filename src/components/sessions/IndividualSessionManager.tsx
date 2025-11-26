'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TimePicker } from '@/components/ui/time-picker';
import { Plus, Trash2, GripVertical, Save, Loader2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface Session {
  id?: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants?: number;
  status?: string;
  isNew?: boolean;
}

interface IndividualSessionManagerProps {
  activityId: string;
  defaultLocation: string;
  defaultMaxParticipants: number;
  onComplete?: () => void;
  onCancel?: () => void;
}

export function IndividualSessionManager({
  activityId,
  defaultLocation,
  defaultMaxParticipants,
  onComplete,
  onCancel,
}: IndividualSessionManagerProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form state for adding/editing
  const [formData, setFormData] = useState<Session>({
    date: '',
    start_time: '',
    end_time: '',
    location: defaultLocation,
    max_participants: defaultMaxParticipants,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing sessions
  useEffect(() => {
    loadSessions();
  }, [activityId]);

  const loadSessions = async () => {
    try {
      const response = await fetch(`/api/activities/${activityId}/sessions`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = 'Selectează data';
    if (!formData.start_time) newErrors.start_time = 'Selectează ora de început';
    if (!formData.end_time) newErrors.end_time = 'Selectează ora de final';
    if (!formData.location) newErrors.location = 'Introdu locația';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSession = () => {
    if (!validateForm()) return;

    const newSession: Session = {
      ...formData,
      isNew: true,
    };

    setSessions([...sessions, newSession]);

    // Reset form
    setFormData({
      date: '',
      start_time: '',
      end_time: '',
      location: defaultLocation,
      max_participants: defaultMaxParticipants,
    });
    setErrors({});
  };

  const handleEditSession = (index: number) => {
    setEditingIndex(index);
    setFormData(sessions[index]);
  };

  const handleUpdateSession = () => {
    if (!validateForm()) return;
    if (editingIndex === null) return;

    const updatedSessions = [...sessions];
    updatedSessions[editingIndex] = { ...formData, isNew: !formData.id };
    setSessions(updatedSessions);

    // Reset
    setEditingIndex(null);
    setFormData({
      date: '',
      start_time: '',
      end_time: '',
      location: defaultLocation,
      max_participants: defaultMaxParticipants,
    });
    setErrors({});
  };

  const handleDeleteSession = (index: number) => {
    if (confirm('Sigur vrei să ștergi această sesiune?')) {
      const updatedSessions = sessions.filter((_, i) => i !== index);
      setSessions(updatedSessions);
    }
  };

  const handleSaveAll = async () => {
    if (sessions.length === 0) {
      alert('Adaugă cel puțin o sesiune');
      return;
    }

    setIsSaving(true);

    try {
      // Separate new sessions from existing
      const newSessions = sessions.filter((s) => s.isNew);
      const existingSessions = sessions.filter((s) => !s.isNew);

      // Create new sessions
      if (newSessions.length > 0) {
        const response = await fetch(`/api/activities/${activityId}/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            newSessions.map((s) => ({
              date: s.date,
              start_time: s.start_time,
              end_time: s.end_time,
              location: s.location,
              max_participants: s.max_participants,
            }))
          ),
        });

        if (!response.ok) {
          throw new Error('Failed to create sessions');
        }
      }

      // Update existing sessions (if any were modified)
      for (const session of existingSessions) {
        if (session.id) {
          await fetch(`/api/activities/${activityId}/sessions/${session.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              date: session.date,
              start_time: session.start_time,
              end_time: session.end_time,
              location: session.location,
              max_participants: session.max_participants,
            }),
          });
        }
      }

      alert('Sesiuni salvate cu succes!');
      onComplete?.();
    } catch (error) {
      console.error('Error saving sessions:', error);
      alert('A apărut o eroare la salvarea sesiunilor');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-[#001f3f]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Session Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-[#001f3f]">
          {editingIndex !== null ? 'Editează Sesiune' : 'Adaugă Sesiune Nouă'}
        </h3>

        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#001f3f]">Dată *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full rounded-lg border ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Ora Început *</label>
              <TimePicker
                value={formData.start_time}
                onChange={(value) => setFormData({ ...formData, start_time: value })}
                placeholder="--:--"
              />
              {errors.start_time && (
                <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Ora Final *</label>
              <TimePicker
                value={formData.end_time}
                onChange={(value) => setFormData({ ...formData, end_time: value })}
                placeholder="--:--"
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
              } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none`}
              placeholder="ex. Sala A101, Corp A"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          {/* Max Participants */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#001f3f]">
              Nr. Max Participanți
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none"
            />
          </div>

          {/* Add/Update Button */}
          {editingIndex !== null ? (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setFormData({
                    date: '',
                    start_time: '',
                    end_time: '',
                    location: defaultLocation,
                    max_participants: defaultMaxParticipants,
                  });
                  setErrors({});
                }}
                variant="outline"
                className="flex-1"
              >
                Anulează
              </Button>
              <Button
                type="button"
                onClick={handleUpdateSession}
                className="flex-1 bg-[#FFD600] text-[#001f3f] hover:bg-[#FFD600]/90"
              >
                Actualizează Sesiune
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={handleAddSession}
              className="w-full bg-[#FFD600] text-[#001f3f] hover:bg-[#FFD600]/90"
            >
              <Plus className="mr-2 size-4" />
              Adaugă Sesiune
            </Button>
          )}
        </div>
      </div>

      {/* Sessions List */}
      {sessions.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-[#001f3f]">Sesiuni ({sessions.length})</h3>
          </div>

          <div className="space-y-2">
            {sessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <GripVertical className="size-5 text-gray-400" />

                <div className="flex-1">
                  <p className="font-medium text-[#001f3f]">
                    {format(new Date(session.date), 'EEEE, dd MMMM yyyy', {
                      locale: ro,
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {session.start_time} - {session.end_time} • {session.location}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditSession(index)}
                  >
                    <Edit2 className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteSession(index)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={isSaving}
          >
            Anulează
          </Button>
        )}
        <Button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving || sessions.length === 0}
          className="flex-1 bg-[#FFD600] text-[#001f3f] hover:bg-[#FFD600]/90"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Se salvează...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              Salvează Toate Sesiunile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
