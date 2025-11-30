'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Save, X } from 'lucide-react';
import { TimePicker } from '@/components/ui/time-picker';
import { OpportunityImageUpload } from '@/components/opportunities/OpportunityImageUpload';

// Validation schema
const editSchema = z.object({
  title: z.string().min(10, 'Titlul trebuie să aibă cel puțin 10 caractere').max(100),
  description: z.string().min(50, 'Descrierea trebuie să aibă cel puțin 50 de caractere').max(2000),
  category_id: z.string().min(1, 'Selectează o categorie'),
  department_id: z.string().min(1, 'Selectează un departament'),
  location: z.string().min(5, 'Locația trebuie să aibă cel puțin 5 caractere'),
  max_participants: z.number().min(1, 'Trebuie să fie cel puțin 1 participant').max(500),
  date: z.string().min(1, 'Selectează o dată'),
  start_time: z.string().min(1, 'Selectează ora de început'),
  end_time: z.string().min(1, 'Selectează ora de final'),
  status: z.enum(['OPEN', 'CLOSED', 'DRAFT']),
});

type EditFormData = z.infer<typeof editSchema>;

interface EditOpportunityModalProps {
  opportunityId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditOpportunityModal({
  opportunityId,
  isOpen,
  onClose,
  onSuccess,
}: EditOpportunityModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const [formData, setFormData] = useState<EditFormData>({
    title: '',
    description: '',
    category_id: '',
    department_id: '',
    location: '',
    max_participants: 20,
    date: '',
    start_time: '',
    end_time: '',
    status: 'OPEN',
  });

  // Load categories and departments
  useEffect(() => {
    async function loadOptions() {
      try {
        const [categoriesRes, departmentsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/departments'),
        ]);

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data);
        }
        if (departmentsRes.ok) {
          const data = await departmentsRes.json();
          setDepartments(data);
        }
      } catch (error) {
        console.error('Error loading options:', error);
      }
    }
    loadOptions();
  }, []);

  // Load opportunity data when modal opens
  useEffect(() => {
    async function loadOpportunity() {
      if (!opportunityId || !isOpen) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/activities/${opportunityId}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            title: data.title || '',
            description: data.description || '',
            category_id: data.category_id || '',
            department_id: data.department_id || '',
            location: data.location || '',
            max_participants: data.max_participants || 20,
            date: data.date || '',
            start_time: data.start_time?.substring(0, 5) || '',
            end_time: data.end_time?.substring(0, 5) || '',
            status: data.status || 'OPEN',
          });
          setImageUrl(data.image_url || undefined);
        }
      } catch (error) {
        console.error('Error loading opportunity:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadOpportunity();
  }, [opportunityId, isOpen]);

  const handleSubmit = async () => {
    setErrors({});

    try {
      editSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/activities/${opportunityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Eroare la salvare');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving opportunity:', error);
      alert(error instanceof Error ? error.message : 'Eroare la salvare');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = <K extends keyof EditFormData>(field: K, value: EditFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#001f3f]">
            Editează Oportunitatea
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#001f3f]" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Titlu *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className={`w-full rounded-lg border ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Descriere *</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className={`w-full rounded-lg border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Image Upload */}
            <OpportunityImageUpload value={imageUrl} onChange={setImageUrl} />

            {/* Category & Department */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#001f3f]">Categorie *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => updateField('category_id', e.target.value)}
                  className={`w-full rounded-lg border ${
                    errors.category_id ? 'border-red-500' : 'border-gray-300'
                  } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                >
                  <option value="">Selectează</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                  Departament *
                </label>
                <select
                  value={formData.department_id}
                  onChange={(e) => updateField('department_id', e.target.value)}
                  className={`w-full rounded-lg border ${
                    errors.department_id ? 'border-red-500' : 'border-gray-300'
                  } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                >
                  <option value="">Selectează</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>
                )}
              </div>
            </div>

            {/* Location & Max Participants */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#001f3f]">Locație *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className={`w-full rounded-lg border ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                  Nr. Max Participanți *
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={formData.max_participants}
                  onChange={(e) => updateField('max_participants', parseInt(e.target.value) || 1)}
                  className={`w-full rounded-lg border ${
                    errors.max_participants ? 'border-red-500' : 'border-gray-300'
                  } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                />
                {errors.max_participants && (
                  <p className="mt-1 text-sm text-red-600">{errors.max_participants}</p>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#001f3f]">Dată *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className={`w-full rounded-lg border ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                  Ora Început *
                </label>
                <TimePicker
                  value={formData.start_time}
                  onChange={(value) => updateField('start_time', value)}
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
                  onChange={(value) => updateField('end_time', value)}
                  placeholder="--:--"
                />
                {errors.end_time && <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  updateField('status', e.target.value as 'OPEN' | 'CLOSED' | 'DRAFT')
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20"
              >
                <option value="OPEN">Activ</option>
                <option value="CLOSED">Închis</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose} className="flex-1" disabled={isSaving}>
                <X className="h-4 w-4 mr-2" />
                Anulează
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-[#001f3f] hover:bg-[#001f3f]/90"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Se salvează...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvează
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
