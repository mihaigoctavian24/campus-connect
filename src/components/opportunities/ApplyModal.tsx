'use client';

import { useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { z } from 'zod';

// Zod validation schema
const applicationSchema = z.object({
  motivation: z
    .string()
    .min(50, 'Motivația trebuie să aibă cel puțin 50 de caractere')
    .max(1000, 'Motivația nu poate depăși 1000 de caractere'),
  availability: z
    .string()
    .min(10, 'Disponibilitatea trebuie să aibă cel puțin 10 caractere')
    .max(500, 'Disponibilitatea nu poate depăși 500 de caractere'),
  experience: z
    .string()
    .max(500, 'Experiența nu poate depăși 500 de caractere')
    .optional()
    .or(z.literal('')),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplyModalProps {
  activityId: string;
  opportunityTitle: string;
  onSuccess?: () => void;
  disabled?: boolean;
}

export function ApplyModal({ activityId, opportunityTitle, onSuccess, disabled = false }: ApplyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    motivation: '',
    availability: '',
    experience: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({});

  const validateField = (field: keyof ApplicationFormData, value: string) => {
    try {
      applicationSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate all fields
    try {
      applicationSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ApplicationFormData, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof ApplicationFormData;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Submit application via API
      const response = await fetch(`/api/activities/${activityId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit application');
      }

      // Success! Show confirmation
      setStep('success');
      onSuccess?.();
    } catch (error) {
      console.error('Application submission error:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'A apărut o eroare la trimiterea aplicației. Te rugăm să încerci din nou.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep('form');
      setFormData({ motivation: '', availability: '', experience: '' });
      setErrors({});
    }, 300);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="w-full rounded-lg bg-[#FFD600] px-6 py-3 font-medium text-[#001f3f] shadow-lg transition hover:bg-[#FFD600]/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FFD600]"
      >
        {disabled ? 'Already Applied' : 'Aplică Acum →'}
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          disabled={isSubmitting}
        >
          <X className="size-5" />
        </button>

        {step === 'form' ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-medium text-[#001f3f]">Aplică Acum</h2>
              <p className="text-gray-500">{opportunityTitle}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Motivation */}
              <div>
                <label
                  htmlFor="motivation"
                  className="mb-2 block text-sm font-medium text-[#001f3f]"
                >
                  De ce ești interesat de această oportunitate? *
                </label>
                <textarea
                  id="motivation"
                  required
                  rows={4}
                  value={formData.motivation}
                  onChange={(e) => {
                    setFormData({ ...formData, motivation: e.target.value });
                    validateField('motivation', e.target.value);
                  }}
                  onBlur={(e) => validateField('motivation', e.target.value)}
                  className={`w-full rounded-lg border ${
                    errors.motivation ? 'border-red-500' : 'border-gray-300'
                  } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                  placeholder="Spune-ne ce te motivează să aplici... (minimum 50 caractere)"
                  disabled={isSubmitting}
                />
                {errors.motivation && (
                  <p className="mt-1 text-sm text-red-600">{errors.motivation}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.motivation.length}/1000 caractere (minimum 50)
                </p>
              </div>

              {/* Availability */}
              <div>
                <label
                  htmlFor="availability"
                  className="mb-2 block text-sm font-medium text-[#001f3f]"
                >
                  Care este disponibilitatea ta? *
                </label>
                <textarea
                  id="availability"
                  required
                  rows={3}
                  value={formData.availability}
                  onChange={(e) => {
                    setFormData({ ...formData, availability: e.target.value });
                    validateField('availability', e.target.value);
                  }}
                  onBlur={(e) => validateField('availability', e.target.value)}
                  className={`w-full rounded-lg border ${
                    errors.availability ? 'border-red-500' : 'border-gray-300'
                  } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                  placeholder="ex. Luni-Vineri 14:00-17:00, weekenduri flexibile..."
                  disabled={isSubmitting}
                />
                {errors.availability && (
                  <p className="mt-1 text-sm text-red-600">{errors.availability}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">{formData.availability.length}/500 caractere</p>
              </div>

              {/* Relevant Experience */}
              <div>
                <label
                  htmlFor="experience"
                  className="mb-2 block text-sm font-medium text-[#001f3f]"
                >
                  Experiență relevantă (opțional)
                </label>
                <textarea
                  id="experience"
                  rows={3}
                  value={formData.experience}
                  onChange={(e) => {
                    setFormData({ ...formData, experience: e.target.value });
                    if (e.target.value) {
                      validateField('experience', e.target.value);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      validateField('experience', e.target.value);
                    }
                  }}
                  className={`w-full rounded-lg border ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                  placeholder="Orice abilități relevante, cursuri, sau experiență anterioară de voluntariat..."
                  disabled={isSubmitting}
                />
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                )}
                {formData.experience && (
                  <p className="mt-1 text-xs text-gray-500">{formData.experience.length}/500 caractere</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-[#001f3f] transition hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#FFD600] px-6 py-3 font-medium text-[#001f3f] shadow-lg transition hover:bg-[#FFD600]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Se trimite...
                    </>
                  ) : (
                    'Trimite Aplicația'
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="py-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="size-10 text-green-600" />
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-medium text-[#001f3f]">Aplicație Trimisă!</h2>
              <p className="mb-8 text-gray-600">
                Mulțumim că ai aplicat la {opportunityTitle}. Vom revizui aplicația ta și te vom
                contacta în 5-7 zile lucrătoare.
              </p>
              <button
                onClick={handleClose}
                className="rounded-lg bg-[#FFD600] px-8 py-3 font-medium text-[#001f3f] shadow-lg transition hover:bg-[#FFD600]/90"
              >
                Gata
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
