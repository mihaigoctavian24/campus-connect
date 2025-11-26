'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, Lock } from 'lucide-react';

// Validation schema
const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Parola curentă este obligatorie'),
    newPassword: z
      .string()
      .min(8, 'Parola nouă trebuie să aibă minim 8 caractere')
      .regex(/[A-Z]/, 'Parola trebuie să conțină cel puțin o literă mare')
      .regex(/[a-z]/, 'Parola trebuie să conțină cel puțin o literă mică')
      .regex(/[0-9]/, 'Parola trebuie să conțină cel puțin o cifră'),
    confirmPassword: z.string().min(1, 'Confirmarea parolei este obligatorie'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Parolele nu coincid',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Parola nouă trebuie să fie diferită de cea curentă',
    path: ['newPassword'],
  });

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

interface AccountSettingsProps {
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export function AccountSettings({ onChangePassword }: AccountSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordChangeFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);
      await onChangePassword(data.currentPassword, data.newPassword);
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la schimbarea parolei');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#001f3f] mb-2">Schimbă Parola</h3>
        <p className="text-sm text-gray-600">
          Asigură-te că parola nouă este puternică și sigură
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 text-sm">
          Parola a fost schimbată cu succes!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="currentPassword">
            Parola Curentă <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              {...register('currentPassword')}
              placeholder="Introdu parola curentă"
              className={`pl-10 pr-10 ${errors.currentPassword ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">
            Parola Nouă <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword')}
              placeholder="Introdu parola nouă"
              className={`pl-10 pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-500">{errors.newPassword.message}</p>
          )}
          <p className="text-xs text-gray-500">
            Minim 8 caractere, cu literă mare, literă mică și cifră
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirmă Parola Nouă <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="Confirmă parola nouă"
              className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Security Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="font-medium text-blue-900 mb-2">💡 Sfaturi pentru o parolă sigură:</p>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Folosește minimum 8 caractere</li>
            <li>Combină litere mari și mici</li>
            <li>Adaugă cifre și simboluri speciale</li>
            <li>Evită cuvinte comune sau date personale</li>
            <li>Nu folosi aceeași parolă pe mai multe site-uri</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end border-t border-gray-200 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#001f3f] hover:bg-[#003366] text-white"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Schimbă Parola
          </Button>
        </div>
      </form>
    </div>
  );
}
