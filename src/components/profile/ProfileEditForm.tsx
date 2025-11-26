'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

// Validation schema
const profileEditSchema = z.object({
  first_name: z.string().min(2, 'Prenumele trebuie să aibă minim 2 caractere'),
  last_name: z.string().min(2, 'Numele trebuie să aibă minim 2 caractere'),
  phone: z.string().optional(),
  // Academic fields (required for students)
  faculty: z.string().optional(),
  specialization: z.string().optional(),
  year: z.number().min(1).max(6).optional(),
  program_type: z.enum(['LICENSE', 'MASTER', 'DOCTORAT']).optional(),
});

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

interface ProfileEditFormProps {
  profile: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    faculty: string | null;
    specialization: string | null;
    year: number | null;
    program_type: string | null;
    role: string;
  };
  onSave: (data: ProfileEditFormData) => Promise<void>;
  onCancel: () => void;
}

const FACULTIES = [
  'Facultatea de Științe Economice',
  'Facultatea de Drept',
  'Facultatea de Comunicare și Relații Publice',
  'Facultatea de Management',
  'Facultatea de Informatică',
];

export function ProfileEditForm({ profile, onSave, onCancel }: ProfileEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      phone: profile.phone || '',
      faculty: profile.faculty || '',
      specialization: profile.specialization || '',
      year: profile.year || undefined,
      program_type: (profile.program_type as 'LICENSE' | 'MASTER' | 'DOCTORAT') || undefined,
    },
  });

  const isStudent = profile.role === 'STUDENT';
  const selectedYear = watch('year');
  const selectedProgramType = watch('program_type');
  const selectedFaculty = watch('faculty');

  const onSubmit = async (data: ProfileEditFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSave(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">{error}</div>
      )}

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#001f3f]">Informații Personale</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="first_name">
              Prenume <span className="text-red-500">*</span>
            </Label>
            <Input
              id="first_name"
              {...register('first_name')}
              placeholder="Ion"
              className={errors.first_name ? 'border-red-500' : ''}
            />
            {errors.first_name && (
              <p className="text-sm text-red-500">{errors.first_name.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="last_name">
              Nume <span className="text-red-500">*</span>
            </Label>
            <Input
              id="last_name"
              {...register('last_name')}
              placeholder="Popescu"
              className={errors.last_name ? 'border-red-500' : ''}
            />
            {errors.last_name && <p className="text-sm text-red-500">{errors.last_name.message}</p>}
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon (opțional)</Label>
          <Input id="phone" {...register('phone')} placeholder="+40 712 345 678" type="tel" />
        </div>
      </div>

      {/* Academic Information - Only for Students */}
      {isStudent && (
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-[#001f3f]">Informații Academice</h3>

          {/* Faculty */}
          <div className="space-y-2">
            <Label htmlFor="faculty">Facultatea</Label>
            <Select
              value={selectedFaculty || ''}
              onValueChange={(value) => setValue('faculty', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectează facultatea" />
              </SelectTrigger>
              <SelectContent>
                {FACULTIES.map((faculty) => (
                  <SelectItem key={faculty} value={faculty}>
                    {faculty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Specialization */}
          <div className="space-y-2">
            <Label htmlFor="specialization">Specializarea</Label>
            <Input
              id="specialization"
              {...register('specialization')}
              placeholder="ex: Informatică Economică"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Year */}
            <div className="space-y-2">
              <Label htmlFor="year">Anul de studiu</Label>
              <Select
                value={selectedYear?.toString() || ''}
                onValueChange={(value) => setValue('year', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectează anul" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      Anul {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Program Type */}
            <div className="space-y-2">
              <Label htmlFor="program_type">Tip program</Label>
              <Select
                value={selectedProgramType || ''}
                onValueChange={(value) =>
                  setValue('program_type', value as 'LICENSE' | 'MASTER' | 'DOCTORAT')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectează programul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LICENSE">Licență</SelectItem>
                  <SelectItem value="MASTER">Master</SelectItem>
                  <SelectItem value="DOCTORAT">Doctorat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#001f3f] hover:bg-[#003366] text-white"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvează Modificările
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Anulează
        </Button>
      </div>
    </form>
  );
}
