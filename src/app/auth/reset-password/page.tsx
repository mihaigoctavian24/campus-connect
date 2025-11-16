import { Metadata } from 'next';
import Link from 'next/link';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password | Campus Connect',
  description: 'Create a new password for your account',
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-16 items-center justify-center rounded-lg bg-[gold]">
              <span className="text-2xl font-medium text-[#001f3f]">CC</span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-gray-200 bg-white px-8 py-10 shadow-sm">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-medium text-[#001f3f]">Create new password</h2>
            <p className="mt-2 text-sm text-gray-600">Enter a new password for your account</p>
          </div>

          {/* Form */}
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
