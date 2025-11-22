'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2,
  Calendar,
  MapPin,
  Settings,
  Eye,
} from 'lucide-react';
import { TimePicker } from '@/components/ui/time-picker';

// Validation schemas for each step
const step1Schema = z.object({
  title: z.string().min(10, 'Titlul trebuie să aibă cel puțin 10 caractere').max(100),
  description: z.string().min(50, 'Descrierea trebuie să aibă cel puțin 50 de caractere').max(2000),
  category_id: z.string().min(1, 'Selectează o categorie'),
  department_id: z.string().min(1, 'Selectează un departament'),
});

const step2Schema = z.object({
  location: z.string().min(5, 'Locația trebuie să aibă cel puțin 5 caractere'),
  max_participants: z.number().min(1, 'Trebuie să fie cel puțin 1 participant').max(500),
  eligibility_criteria: z.string().max(500).optional().or(z.literal('')),
});

const step3Schema = z.object({
  date: z.string().min(1, 'Selectează o dată'),
  start_time: z.string().min(1, 'Selectează ora de început'),
  end_time: z.string().min(1, 'Selectează ora de final'),
  // Sessions will be added later in Week 7
});

const step4Schema = z.object({
  auto_accept: z.boolean(),
  require_confirmation: z.boolean(),
  required_hours: z.number().min(0).max(500).optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type Step4Data = z.infer<typeof step4Schema>;

interface CreateOpportunityWizardProps {
  onSuccess?: (activityId: string) => void;
}

export function CreateOpportunityWizard({ onSuccess }: CreateOpportunityWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Categories and departments from database
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);

  // Form data for each step
  const [step1Data, setStep1Data] = useState<Step1Data>({
    title: '',
    description: '',
    category_id: '',
    department_id: '',
  });

  const [step2Data, setStep2Data] = useState<Step2Data>({
    location: '',
    max_participants: 20,
    eligibility_criteria: '',
  });

  const [step3Data, setStep3Data] = useState<Step3Data>({
    date: '',
    start_time: '',
    end_time: '',
  });

  const [step4Data, setStep4Data] = useState<Step4Data>({
    auto_accept: false,
    require_confirmation: true,
    required_hours: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories and departments on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesRes, departmentsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/departments'),
        ]);

        if (categoriesRes.ok && departmentsRes.ok) {
          const categoriesData = await categoriesRes.json();
          const departmentsData = await departmentsRes.json();
          setCategories(categoriesData);
          setDepartments(departmentsData);
        }
      } catch (error) {
        console.error('Error loading categories and departments:', error);
      }
    }
    loadData();
  }, []);

  const validateStep = (step: number): boolean => {
    setErrors({});
    try {
      if (step === 1) {
        step1Schema.parse(step1Data);
      } else if (step === 2) {
        step2Schema.parse(step2Data);
      } else if (step === 3) {
        step3Schema.parse(step3Data);
      } else if (step === 4) {
        step4Schema.parse(step4Data);
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    try {
      const activityData = {
        ...step1Data,
        ...step2Data,
        ...step3Data,
        status: 'OPEN',
      };

      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create opportunity');
      }

      const result = await response.json();
      setShowSuccess(true);
      onSuccess?.(result.id);

      setTimeout(() => {
        router.push('/dashboard/professor/opportunities');
      }, 2000);
    } catch (error) {
      console.error('Error creating opportunity:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'A apărut o eroare la crearea oportunității. Te rugăm să încerci din nou.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Informații de Bază', icon: Calendar },
    { number: 2, title: 'Logistică', icon: MapPin },
    { number: 3, title: 'Program', icon: Calendar },
    { number: 4, title: 'Setări', icon: Settings },
    { number: 5, title: 'Previzualizare', icon: Eye },
  ];

  if (showSuccess) {
    return (
      <div className="py-16 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="size-10 text-green-600" />
          </div>
        </div>
        <h2 className="mb-4 text-2xl font-medium text-[#001f3f]">Oportunitate Creată!</h2>
        <p className="mb-8 text-gray-600">
          Oportunitatea ta a fost creată cu succes și este acum disponibilă pentru studenți.
        </p>
        <p className="text-sm text-gray-500">Redirecționare...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex size-10 items-center justify-center rounded-full ${
                  currentStep >= step.number
                    ? 'bg-[#FFD600] text-[#001f3f]'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <step.icon className="size-5" />
              </div>
              <span
                className={`mt-2 text-xs ${
                  currentStep >= step.number ? 'font-medium text-[#001f3f]' : 'text-gray-400'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${
                  currentStep > step.number ? 'bg-[#FFD600]' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-2xl font-medium text-[#001f3f]">Informații de Bază</h2>
              <p className="text-gray-500">Introdu detaliile principale ale oportunității</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                Titlu Oportunitate *
              </label>
              <input
                type="text"
                value={step1Data.title}
                onChange={(e) => setStep1Data({ ...step1Data, title: e.target.value })}
                className={`w-full rounded-lg border ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                placeholder="ex. Voluntariat la campania de alfabetizare digitală"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              <p className="mt-1 text-xs text-gray-500">{step1Data.title.length}/100 caractere</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Descriere *</label>
              <textarea
                rows={6}
                value={step1Data.description}
                onChange={(e) => setStep1Data({ ...step1Data, description: e.target.value })}
                className={`w-full rounded-lg border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                placeholder="Descrie oportunitatea în detaliu..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {step1Data.description.length}/2000 caractere (minimum 50)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#001f3f]">Categorie *</label>
                <select
                  value={step1Data.category_id}
                  onChange={(e) => setStep1Data({ ...step1Data, category_id: e.target.value })}
                  className={`w-full rounded-lg border ${
                    errors.category_id ? 'border-red-500' : 'border-gray-300'
                  } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                >
                  <option value="">Selectează categoria</option>
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
                  value={step1Data.department_id}
                  onChange={(e) => setStep1Data({ ...step1Data, department_id: e.target.value })}
                  className={`w-full rounded-lg border ${
                    errors.department_id ? 'border-red-500' : 'border-gray-300'
                  } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                >
                  <option value="">Selectează departamentul</option>
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
          </div>
        )}

        {/* Step 2: Logistics */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-2xl font-medium text-[#001f3f]">Logistică</h2>
              <p className="text-gray-500">Detalii despre locație și participanți</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Locație *</label>
              <input
                type="text"
                value={step2Data.location}
                onChange={(e) => setStep2Data({ ...step2Data, location: e.target.value })}
                className={`w-full rounded-lg border ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                placeholder="ex. Sala A101, Corp A, Universitatea București"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                Număr Maxim de Participanți *
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={step2Data.max_participants}
                onChange={(e) =>
                  setStep2Data({ ...step2Data, max_participants: parseInt(e.target.value) || 0 })
                }
                className={`w-full rounded-lg border ${
                  errors.max_participants ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
              />
              {errors.max_participants && (
                <p className="mt-1 text-sm text-red-600">{errors.max_participants}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                Criterii de Eligibilitate (opțional)
              </label>
              <textarea
                rows={4}
                value={step2Data.eligibility_criteria}
                onChange={(e) =>
                  setStep2Data({ ...step2Data, eligibility_criteria: e.target.value })
                }
                className={`w-full rounded-lg border ${
                  errors.eligibility_criteria ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
                placeholder="ex. Studenți din anul 2-4, experiență anterioară de voluntariat apreciată..."
              />
              {errors.eligibility_criteria && (
                <p className="mt-1 text-sm text-red-600">{errors.eligibility_criteria}</p>
              )}
              {step2Data.eligibility_criteria && (
                <p className="mt-1 text-xs text-gray-500">
                  {step2Data.eligibility_criteria.length}/500 caractere
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-2xl font-medium text-[#001f3f]">Program</h2>
              <p className="text-gray-500">Setează data și orele activității</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Dată *</label>
              <input
                type="date"
                value={step3Data.date}
                onChange={(e) => setStep3Data({ ...step3Data, date: e.target.value })}
                className={`w-full rounded-lg border ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20`}
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                  Ora de Început *
                </label>
                <TimePicker
                  value={step3Data.start_time}
                  onChange={(value) => setStep3Data({ ...step3Data, start_time: value })}
                  placeholder="--:--"
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
                  value={step3Data.end_time}
                  onChange={(value) => setStep3Data({ ...step3Data, end_time: value })}
                  placeholder="--:--"
                />
                {errors.end_time && <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>}
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Notă:</strong> În Week 7 vei putea adăuga sesiuni multiple pentru activități
                recurente. Pentru moment, setează data și ora primei activități.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Settings */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-2xl font-medium text-[#001f3f]">Setări Avansate</h2>
              <p className="text-gray-500">Configurează opțiunile oportunității</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="auto_accept"
                  checked={step4Data.auto_accept}
                  onChange={(e) => setStep4Data({ ...step4Data, auto_accept: e.target.checked })}
                  className="mt-1 size-4 rounded border-gray-300 text-[#FFD600] focus:ring-[#FFD600]"
                />
                <div>
                  <label htmlFor="auto_accept" className="font-medium text-[#001f3f]">
                    Acceptare Automată
                  </label>
                  <p className="text-sm text-gray-500">
                    Aplicațiile vor fi acceptate automat fără necesitatea aprobării manuale
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="require_confirmation"
                  checked={step4Data.require_confirmation}
                  onChange={(e) =>
                    setStep4Data({ ...step4Data, require_confirmation: e.target.checked })
                  }
                  className="mt-1 size-4 rounded border-gray-300 text-[#FFD600] focus:ring-[#FFD600]"
                />
                <div>
                  <label htmlFor="require_confirmation" className="font-medium text-[#001f3f]">
                    Necesită Confirmare
                  </label>
                  <p className="text-sm text-gray-500">
                    Studenții acceptați trebuie să confirme participarea înainte de activitate
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">
                Ore Necesare (opțional)
              </label>
              <input
                type="number"
                min="0"
                max="500"
                value={step4Data.required_hours || ''}
                onChange={(e) =>
                  setStep4Data({
                    ...step4Data,
                    required_hours: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20"
                placeholder="ex. 10"
              />
              <p className="mt-1 text-xs text-gray-500">
                Numărul de ore de voluntariat pe care studentul trebuie să le îndeplinească
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Preview */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-2xl font-medium text-[#001f3f]">Previzualizare</h2>
              <p className="text-gray-500">Verifică toate detaliile înainte de publicare</p>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-medium text-[#001f3f]">Informații de Bază</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <strong>Titlu:</strong> {step1Data.title}
                  </p>
                  <p>
                    <strong>Descriere:</strong> {step1Data.description}
                  </p>
                  <p>
                    <strong>Categorie:</strong>{' '}
                    {categories.find((c) => c.id === step1Data.category_id)?.name}
                  </p>
                  <p>
                    <strong>Departament:</strong>{' '}
                    {departments.find((d) => d.id === step1Data.department_id)?.name}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-medium text-[#001f3f]">Logistică</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <strong>Locație:</strong> {step2Data.location}
                  </p>
                  <p>
                    <strong>Participanți:</strong> Max {step2Data.max_participants}
                  </p>
                  {step2Data.eligibility_criteria && (
                    <p>
                      <strong>Criterii:</strong> {step2Data.eligibility_criteria}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-medium text-[#001f3f]">Program</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <strong>Dată:</strong> {step3Data.date}
                  </p>
                  <p>
                    <strong>Interval:</strong> {step3Data.start_time} - {step3Data.end_time}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-medium text-[#001f3f]">Setări</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>Acceptare automată: {step4Data.auto_accept ? 'Da' : 'Nu'}</p>
                  <p>Necesită confirmare: {step4Data.require_confirmation ? 'Da' : 'Nu'}</p>
                  {step4Data.required_hours && <p>Ore necesare: {step4Data.required_hours} ore</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4">
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={handleBack}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-[#001f3f] transition hover:bg-gray-50"
              disabled={isSubmitting}
            >
              <ChevronLeft className="mr-2 size-4" />
              Înapoi
            </Button>
          )}

          {currentStep < 5 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 rounded-lg bg-[#FFD600] px-6 py-3 font-medium text-[#001f3f] shadow-lg transition hover:bg-[#FFD600]/90"
            >
              Următorul Pas
              <ChevronRight className="ml-2 size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-[#FFD600] px-6 py-3 font-medium text-[#001f3f] shadow-lg transition hover:bg-[#FFD600]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Se publică...
                </>
              ) : (
                'Publică Oportunitatea'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
