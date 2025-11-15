import { Metadata } from 'next'
import Link from 'next/link'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password | Campus Connect',
  description: 'Reset your Campus Connect password',
}

export default function ForgotPasswordPage() {
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
            <h2 className="text-2xl font-medium text-[#001f3f]">Reset your password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {/* Form */}
          <ForgotPasswordForm />

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-[#001f3f]"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
