'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ProfileContent } from '@/components/profile/ProfileContent';
import type { Application } from '@/components/dashboard/MyApplications';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  first_name: string;
  last_name: string;
  role: string;
  phone: string | null;
  faculty: string | null;
  specialization: string | null;
  year: number | null;
  program_type: string | null;
  profile_picture_url: string | null;
  created_at: string;
}

export default function ProfessorProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function loadProfileData() {
      try {
        const supabase = createClient();

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        // Fetch user profile
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single<Profile>();

        if (!userProfile) {
          router.push('/auth/login');
          return;
        }

        // Verify user is a professor
        if (userProfile.role !== 'PROFESSOR') {
          router.push('/dashboard/student');
          return;
        }

        setProfile(userProfile);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }

    loadProfileData();
  }, [router]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="lg:col-span-2 h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <ProfileContent
      profile={profile}
      stats={{ totalHours: 0, activeOpportunities: 0, completedOpportunities: 0 }}
      applications={[] as Application[]}
      showApplications={false}
      onSaveProfile={async () => {}}
      onUploadAvatar={async () => ''}
      onRemoveAvatar={async () => {}}
    />
  );
}
