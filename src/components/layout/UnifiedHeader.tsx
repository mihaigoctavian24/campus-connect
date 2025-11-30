'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationDropdown } from '@/components/notifications';

interface UnifiedHeaderProps {
  showAuthElements?: boolean; // Show notifications + user menu for authenticated users
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userRole?: string; // User role for dashboard routing
  onLogout?: () => void;
}

export function UnifiedHeader({
  showAuthElements = false,
  userName = 'Student Name',
  userEmail = 'student@stud.rau.ro',
  userAvatar,
  userRole,
  onLogout,
}: UnifiedHeaderProps) {
  const pathname = usePathname();
  const [isOverVideo, setIsOverVideo] = useState(false);

  // Track scroll position and detect if header is over video section
  useEffect(() => {
    const handleScroll = () => {
      // Check if header overlaps the hero video section
      const heroSection = document.getElementById('hero-video-section');
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        const headerHeight = 72; // Approximate header height
        // Header is over video when:
        // - The video section's top edge is above or at the header's bottom (heroRect.top < headerHeight)
        // - The video section's bottom edge is below the top of viewport (heroRect.bottom > 0)
        const isOverlapping = heroRect.top < headerHeight && heroRect.bottom > headerHeight;
        setIsOverVideo(isOverlapping);
      } else {
        setIsOverVideo(false);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine dashboard URL based on role
  const getDashboardUrl = () => {
    if (!userRole) return '/dashboard/student';

    switch (userRole.toUpperCase()) {
      case 'PROFESSOR':
        return '/dashboard/professor';
      case 'ADMIN':
        return '/dashboard/admin';
      case 'STUDENT':
      default:
        return '/dashboard/student';
    }
  };

  const dashboardUrl = getDashboardUrl();

  // Get notifications center URL based on role
  const getNotificationCenterUrl = () => {
    if (!userRole) return '/dashboard/student/notifications';

    switch (userRole.toUpperCase()) {
      case 'PROFESSOR':
        return '/dashboard/professor/notifications';
      case 'ADMIN':
        return '/dashboard/admin/notifications';
      case 'STUDENT':
      default:
        return '/dashboard/student/notifications';
    }
  };

  // Get user initials for avatar fallback
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Dynamic color classes based on whether header is over video
  const textColor = isOverVideo ? 'text-[gold]' : 'text-[#001f3f]';
  const logoBg = 'bg-[gold]';
  const logoText = 'text-[#001f3f]';

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300 border-b border-white/20"
      style={{
        background: isOverVideo ? 'rgba(0, 31, 63, 0.3)' : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="mx-auto max-w-7xl px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 transition-colors duration-300">
            <div
              className={`flex size-10 items-center justify-center rounded-lg transition-colors duration-300 ${logoBg}`}
            >
              <span className={`font-medium transition-colors duration-300 ${logoText}`}>CC</span>
            </div>
            <span className={`text-2xl font-medium transition-colors duration-300 ${textColor}`}>
              CampusConnect
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={`transition-colors duration-300 ${
                pathname === '/'
                  ? isOverVideo
                    ? 'font-medium text-white'
                    : 'font-medium text-[#800020]'
                  : isOverVideo
                    ? 'text-[gold]/80 hover:text-[gold]'
                    : 'text-[#001f3f]/80 hover:text-[#001f3f]'
              }`}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className={`transition-colors duration-300 ${
                pathname === '/explore' || pathname.startsWith('/opportunities')
                  ? isOverVideo
                    ? 'font-medium text-white'
                    : 'font-medium text-[#800020]'
                  : isOverVideo
                    ? 'text-[gold]/80 hover:text-[gold]'
                    : 'text-[#001f3f]/80 hover:text-[#001f3f]'
              }`}
            >
              Explore
            </Link>
            <Link
              href={dashboardUrl}
              className={`transition-colors duration-300 ${
                pathname.startsWith('/dashboard')
                  ? isOverVideo
                    ? 'font-medium text-white'
                    : 'font-medium text-[#800020]'
                  : isOverVideo
                    ? 'text-[gold]/80 hover:text-[gold]'
                    : 'text-[#001f3f]/80 hover:text-[#001f3f]'
              }`}
            >
              Dashboard
            </Link>

            {/* Auth Elements (Notifications + User) - Only show if authenticated */}
            {showAuthElements && (
              <>
                {/* Notifications - Real data from database */}
                <NotificationDropdown
                  notificationCenterUrl={getNotificationCenterUrl()}
                  isOverVideo={isOverVideo}
                />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full hover:bg-[#001f3f]/10"
                    >
                      <Avatar className="h-10 w-10 border-2 border-[gold]">
                        <AvatarImage src={userAvatar} alt={userName} />
                        <AvatarFallback className="bg-[gold] text-[#001f3f] font-medium">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/student" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-[#800020] focus:bg-[#800020] focus:text-white"
                      onClick={onLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Login/Signup buttons for non-authenticated users */}
            {!showAuthElements && (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className={`transition-colors duration-300 ${
                    isOverVideo
                      ? 'text-[gold]/80 hover:text-[gold]'
                      : 'text-[#001f3f]/80 hover:text-[#001f3f]'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg px-6 py-2 font-medium transition-all duration-300 bg-[gold] text-[#001f3f] hover:bg-yellow-400"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
