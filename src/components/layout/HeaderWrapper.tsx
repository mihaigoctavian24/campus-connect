'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { UnifiedHeader } from './UnifiedHeader';

interface UserProfile {
  role: string;
  first_name: string | null;
  last_name: string | null;
}

export function HeaderWrapper() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserAndProfile() {
      try {
        const supabase = createClient();

        // 1. Get session first
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('[HeaderWrapper] Session error:', sessionError);
          setLoading(false);
          return;
        }

        if (!session?.user) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        // 2. Set user immediately
        setUser(session.user);

        // 3. Fetch profile with role from database
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, first_name, last_name')
          .eq('id', session.user.id)
          .single<UserProfile>();

        if (profileError) {
          console.error('[HeaderWrapper] Profile fetch error:', profileError);
          // Fallback to default role if profile fetch fails
          setProfile({ role: 'STUDENT', first_name: null, last_name: null });
        } else {
          setProfile(profileData);
        }

        setLoading(false);
      } catch (error) {
        console.error('[HeaderWrapper] Unexpected error:', error);
        setLoading(false);
      }
    }

    loadUserAndProfile();

    // Listen for auth state changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        setProfile(null);
      } else {
        setUser(session.user);
        // Re-fetch profile when auth state changes
        loadUserAndProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Don't show header on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  if (loading) {
    // Return placeholder with same height to prevent layout shift
    return <div className="h-[72px] bg-[#001f3f]" />;
  }

  // Construct full name from first_name and last_name
  const fullName =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.first_name ||
        user?.user_metadata?.full_name ||
        user?.email?.split('@')[0] ||
        'User';

  return (
    <UnifiedHeader
      showAuthElements={!!user}
      userName={fullName}
      userEmail={user?.email || ''}
      userAvatar={user?.user_metadata?.avatar_url}
      userRole={profile?.role || 'STUDENT'}
      onLogout={handleLogout}
    />
  );
}
