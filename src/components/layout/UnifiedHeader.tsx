'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, User, Settings, LogOut } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface UnifiedHeaderProps {
  showAuthElements?: boolean; // Show notifications + user menu for authenticated users
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

export function UnifiedHeader({
  showAuthElements = false,
  userName = 'Student Name',
  userEmail = 'student@stud.rau.ro',
  userAvatar,
  onLogout,
}: UnifiedHeaderProps) {
  const pathname = usePathname();

  // Mock notifications - replace with real data later
  const notifications = [
    {
      id: '1',
      type: 'application_accepted',
      title: 'Application Accepted',
      message: 'Your application for STEM Mentorship Program has been accepted!',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      type: 'session_reminder',
      title: 'Upcoming Session',
      message: 'Community Outreach session starts in 1 hour',
      time: '3 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'hours_approved',
      title: 'Hours Approved',
      message: '5 volunteer hours have been approved',
      time: '1 day ago',
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

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
              href="/profile"
              className={
                pathname === '/profile'
                  ? 'font-medium text-[gold]'
                  : 'text-white/80 transition hover:text-white'
              }
            >
              Profile
            </Link>

            {/* Auth Elements (Notifications + User) - Only show if authenticated */}
            {showAuthElements && (
              <>
                {/* Notifications */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[gold] text-xs font-medium text-[#001f3f]">
                          {unreadCount}
                        </span>
                      )}
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Notifications</h4>
                        {unreadCount > 0 && (
                          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                            Mark all as read
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {notifications.length === 0 ? (
                          <p className="py-4 text-center text-sm text-muted-foreground">
                            No notifications
                          </p>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`rounded-lg border p-3 ${
                                notification.read ? 'bg-background' : 'bg-muted/50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 space-y-1">
                                  <p className="text-sm font-medium">{notification.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {notification.time}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="h-2 w-2 rounded-full bg-[gold]" />
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <Button variant="ghost" className="w-full" size="sm">
                          View all notifications
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

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
