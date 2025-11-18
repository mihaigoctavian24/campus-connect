'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    async function redirectToDashboard() {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // If not authenticated, redirect to login
        router.push('/login');
        return;
      }

      // Fetch user profile to get role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile) {
        console.error('Profile not found');
        router.push('/login');
        return;
      }

      // Redirect based on role
      switch (profile.role) {
        case 'STUDENT':
          router.push('/dashboard/student');
          break;
        case 'PROFESSOR':
          router.push('/dashboard/professor');
          break;
        case 'ADMIN':
          router.push('/dashboard/admin');
          break;
        default:
          // Default to student dashboard if role is unknown
          router.push('/dashboard/student');
      }
    }

    redirectToDashboard();
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001f3f] mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
