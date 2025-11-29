'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  BookOpen,
  Loader2,
} from 'lucide-react';

type UserRole = 'STUDENT' | 'PROFESSOR';

interface Department {
  id: string;
  name: string;
}

export function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' as UserRole,
    department: '',
    professorReason: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Load departments when professor role is selected
  useEffect(() => {
    if (formData.role === 'PROFESSOR' && departments.length === 0) {
      loadDepartments();
    }
  }, [formData.role, departments.length]);

  const loadDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const response = await fetch('/api/departments');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data || []);
      }
    } catch (error) {
      console.error('Error loading departments:', error);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const validateEmail = (email: string, role: UserRole) => {
    if (role === 'STUDENT') {
      return email.endsWith('@stud.rau.ro');
    } else {
      // Professors can use any valid email (external universities, organizations, etc.)
      return email.includes('@') && email.includes('.');
    }
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear errors when user starts typing
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!validateEmail(formData.email, formData.role)) {
      if (formData.role === 'STUDENT') {
        setError('Studenții trebuie să folosească adresa @stud.rau.ro');
      } else {
        setError('Vă rugăm să introduceți o adresă de email validă');
      }
      setLoading(false);
      return;
    }

    // Professor-specific validation
    if (formData.role === 'PROFESSOR') {
      if (!formData.department.trim()) {
        setError('Vă rugăm să selectați departamentul');
        setLoading(false);
        return;
      }
      if (!formData.professorReason.trim() || formData.professorReason.length < 20) {
        setError('Vă rugăm să descrieți motivul solicitării (minim 20 caractere)');
        setLoading(false);
        return;
      }
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // For professors, we create them as STUDENT first, then create a professor request
      // They will be upgraded to PROFESSOR when admin approves
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: 'STUDENT', // Always start as STUDENT
            requested_role: formData.role, // Track what they requested
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // If professor registration, create a professor role request
      if (formData.role === 'PROFESSOR' && signUpData.user) {
        const { error: requestError } = await supabase.from('professor_role_requests').insert({
          user_id: signUpData.user.id,
          department: formData.department,
          reason: formData.professorReason,
          status: 'PENDING',
        });

        if (requestError) {
          console.error('Error creating professor request:', requestError);
          // Don't throw - user is created, just the request failed
        }
      }

      setSuccess(true);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'A apărut o eroare la înregistrare');
    } finally {
      setLoading(false);
    }
  };

  // Success State
  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="size-6 shrink-0 text-green-600" />
          <div>
            <h3 className="font-medium text-green-900">Verifică-ți email-ul</h3>
            <p className="mt-2 text-sm text-green-700">
              Am trimis un link de confirmare la <strong>{formData.email}</strong>. Te rugăm să
              verifici inbox-ul și să dai click pe link pentru a-ți activa contul.
            </p>
            {formData.role === 'PROFESSOR' && (
              <div className="mt-3 rounded-md bg-blue-50 border border-blue-200 p-3">
                <p className="text-sm text-blue-800">
                  <strong>Notă pentru profesori:</strong> După verificarea email-ului, cererea ta de
                  rol de profesor va fi revizuită de un administrator. Vei primi o notificare când
                  cererea este aprobată.
                </p>
              </div>
            )}
            <p className="mt-4 text-xs text-green-600">
              Nu vezi email-ul? Verifică folderul spam sau{' '}
              <button
                onClick={() => setSuccess(false)}
                className="font-medium underline hover:no-underline"
              >
                încearcă din nou
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="size-5 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Sunt...</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                role: 'STUDENT',
                department: '',
                professorReason: '',
              }))
            }
            className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
              formData.role === 'STUDENT'
                ? 'border-[#001f3f] bg-[#001f3f]/5 text-[#001f3f]'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <GraduationCap className="size-5" />
            <span className="font-medium">Student</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: 'PROFESSOR' }))}
            className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
              formData.role === 'PROFESSOR'
                ? 'border-[#800020] bg-[#800020]/5 text-[#800020]'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <BookOpen className="size-5" />
            <span className="font-medium">Profesor</span>
          </button>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Prenume
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-1 focus:ring-[#001f3f]"
            placeholder="Ion"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Nume
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-1 focus:ring-[#001f3f]"
            placeholder="Popescu"
          />
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Universitar
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-1 focus:ring-[#001f3f]"
          placeholder={
            formData.role === 'STUDENT' ? 'nume.prenume@stud.rau.ro' : 'email@exemplu.com'
          }
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.role === 'STUDENT'
            ? 'Folosește adresa ta @stud.rau.ro'
            : 'Poți folosi orice adresă de email validă'}
        </p>
      </div>

      {/* Professor-specific fields */}
      {formData.role === 'PROFESSOR' && (
        <>
          {/* Department Selection */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Departament / Facultate
            </label>
            <div className="relative">
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                disabled={loadingDepartments}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-1 focus:ring-[#001f3f] disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingDepartments ? 'Se încarcă...' : 'Selectează departamentul'}
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
                <option value="Altul">Altul</option>
              </select>
              {loadingDepartments && (
                <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
          </div>

          {/* Reason for professor role */}
          <div>
            <label htmlFor="professorReason" className="block text-sm font-medium text-gray-700">
              De ce soliciți rol de profesor?
            </label>
            <textarea
              id="professorReason"
              name="professorReason"
              value={formData.professorReason}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, professorReason: e.target.value }))
              }
              required
              rows={3}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-1 focus:ring-[#001f3f]"
              placeholder="Descrie experiența ta academică și de ce dorești să creezi oportunități de voluntariat..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Minim 20 caractere. Cererea va fi revizuită de un administrator.
            </p>
          </div>

          {/* Professor info notice */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-amber-800">
              <strong>Notă:</strong> Conturile de profesor necesită aprobare de la administrator.
              După înregistrare, vei putea folosi platforma ca student până când cererea ta este
              aprobată.
            </p>
          </div>
        </>
      )}

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Parolă
        </label>
        <div className="relative mt-1">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-1 focus:ring-[#001f3f]"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">Minim 8 caractere</p>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirmă Parola
        </label>
        <div className="relative mt-1">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-900 focus:border-[#001f3f] focus:outline-none focus:ring-1 focus:ring-[#001f3f]"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-r from-[#001f3f] to-[#800020] px-6 py-3 font-medium text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? 'Se creează contul...'
          : formData.role === 'PROFESSOR'
            ? 'Creează cont și trimite cererea'
            : 'Creează cont'}
      </button>

      {/* Terms Notice */}
      <p className="text-center text-xs text-gray-500">
        Prin crearea unui cont, ești de acord cu{' '}
        <a href="/terms" className="text-[#001f3f] hover:underline">
          Termenii și Condițiile
        </a>{' '}
        și{' '}
        <a href="/privacy" className="text-[#001f3f] hover:underline">
          Politica de Confidențialitate
        </a>
      </p>
    </form>
  );
}
