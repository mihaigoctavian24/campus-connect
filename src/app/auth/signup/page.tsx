import { Metadata } from 'next';
import Link from 'next/link';
import { SignUpForm } from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Sign Up | Campus Connect',
  description: 'Create your Campus Connect account and start making an impact',
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-[gold]">
              <span className="text-lg font-medium text-[#001f3f]">CC</span>
            </div>
            <span className="text-2xl font-medium text-[#001f3f]">CampusConnect</span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-[#001f3f]">Create your account</h1>
            <p className="mt-2 text-gray-500">
              Join the community of student leaders making a difference
            </p>
          </div>

          {/* Sign Up Form */}
          <SignUpForm />

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-[#001f3f] hover:text-[#800020]">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Gradient Background with Stats */}
      <div className="hidden flex-1 bg-gradient-to-br from-[#001f3f] via-[#800020] to-[#001f3f] lg:block">
        <div className="flex h-full flex-col justify-center px-12">
          <div className="max-w-xl text-white">
            <h2 className="mb-6 text-4xl font-normal">Your Module of Impact Starts Here</h2>
            <p className="mb-12 text-lg text-white/90">
              Connect with meaningful volunteer opportunities that complement your academic journey
              and build the leadership skills that define tomorrow&apos;s changemakers.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-3xl font-medium text-[gold]">50+</p>
                <p className="mt-1 text-sm text-white/80">Active Projects</p>
              </div>
              <div>
                <p className="text-3xl font-medium text-[gold]">1,500+</p>
                <p className="mt-1 text-sm text-white/80">Volunteer Hours</p>
              </div>
              <div>
                <p className="text-3xl font-medium text-[gold]">30</p>
                <p className="mt-1 text-sm text-white/80">Partner Organizations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
