'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  return (
    <nav className="sticky top-0 z-50 bg-[#001f3f] shadow-lg">
      <div className="mx-auto max-w-7xl px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[gold]">
              <span className="font-medium text-[#001f3f]">CC</span>
            </div>
            <span className="text-2xl font-medium text-white">CampusConnect</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={
                pathname === '/'
                  ? 'font-medium text-[gold]'
                  : 'text-white/80 transition hover:text-white'
              }
            >
              Home
            </Link>
            <Link
              href="/explore"
              className={
                pathname === '/explore' || pathname.startsWith('/opportunities')
                  ? 'font-medium text-[gold]'
                  : 'text-white/80 transition hover:text-white'
              }
            >
              Explore
            </Link>
            <Link
              href={dashboardUrl}
              className={
                pathname.startsWith('/dashboard')
                  ? 'font-medium text-[gold]'
                  : 'text-white/80 transition hover:text-white'
              }
            >
              Dashboard
            </Link>

            {/* Auth Elements (Notifications + User) - Only show if authenticated */}
            {showAuthElements && (
              <>
                {/* Notifications - Real data from database */}
                <NotificationDropdown notificationCenterUrl={getNotificationCenterUrl()} />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full hover:bg-white/10"
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
                      className="cursor-pointer text-red-600 focus:text-red-600"
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
                <Link href="/auth/login" className="text-white/80 transition hover:text-white">
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-[gold] px-6 py-2 font-medium text-[#001f3f] transition hover:bg-[gold]/90"
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
