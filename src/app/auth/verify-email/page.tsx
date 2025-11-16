import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Verify Email | Campus Connect',
  description: 'Verify your email address to complete registration',
};

export default function VerifyEmailPage() {
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

        {/* Success Card */}
        <div className="rounded-lg border border-gray-200 bg-white px-8 py-10 shadow-sm">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-green-100">
              <Mail className="size-10 text-green-600" />
            </div>

            {/* Heading */}
            <h2 className="mb-4 text-2xl font-medium text-[#001f3f]">Check your email</h2>

            {/* Description */}
            <p className="mb-6 text-gray-600">
              We&apos;ve sent a verification link to your email address. Please check your inbox and
              click the link to verify your account and complete registration.
            </p>

            {/* Instructions */}
            <div className="w-full space-y-4 rounded-lg bg-blue-50 p-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="size-5 shrink-0 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium">Check your spam folder</p>
                  <p className="mt-1 text-blue-700">
                    The email might be in your spam or junk folder
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="size-5 shrink-0 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium">Link expires in 24 hours</p>
                  <p className="mt-1 text-blue-700">
                    Make sure to verify your email within 24 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 w-full">
              <Link
                href="/auth/login"
                className="rounded-lg bg-gradient-to-r from-[#001f3f] to-[#800020] px-6 py-3 text-center font-medium text-white shadow-lg transition hover:opacity-90"
              >
                Go to Login
              </Link>
              <Link href="/auth/signup" className="text-sm text-gray-600 hover:text-[#001f3f]">
                Didn&apos;t receive the email? Try signing up again
              </Link>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500">
          Need help?{' '}
          <a
            href="mailto:support@campusconnect-scs.work"
            className="text-[#001f3f] hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
