import { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Log In | Campus Connect',
  description: 'Log in to your Campus Connect account',
}

export default function LoginPage() {
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
            <h1 className="text-3xl font-medium text-[#001f3f]">Welcome back</h1>
            <p className="mt-2 text-gray-500">Log in to continue making an impact</p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-[#001f3f] hover:text-[#800020]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Gradient Background */}
      <div className="hidden flex-1 bg-gradient-to-br from-[#001f3f] via-[#800020] to-[#001f3f] lg:block">
        <div className="flex h-full flex-col justify-center px-12">
          <div className="max-w-xl text-white">
            <h2 className="mb-6 text-4xl font-normal">Continue Your Impact Journey</h2>
            <p className="text-lg text-white/90">
              Track your volunteer hours, discover new opportunities, and connect with like-minded
              students dedicated to service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
