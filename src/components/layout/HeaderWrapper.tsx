'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { UnifiedHeader } from './UnifiedHeader';

export function HeaderWrapper() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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

  return (
    <UnifiedHeader
      showAuthElements={!!user}
      userName={user?.user_metadata?.full_name || 'User'}
      userEmail={user?.email || ''}
      userAvatar={user?.user_metadata?.avatar_url}
      onLogout={handleLogout}
    />
  );
}
