'use client';

import { cn } from '@/components/ui/utils';

interface WelcomeHeaderProps {
  userName?: string;
  role?: 'student' | 'professor' | 'admin';
  subtitle?: string;
  className?: string;
}

export function WelcomeHeader({
  userName = 'User',
  role = 'student',
  subtitle,
  className,
}: WelcomeHeaderProps) {
  // Get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get default subtitle based on role
  const getDefaultSubtitle = () => {
    switch (role) {
      case 'student':
        return "Here's what's happening with your volunteering activities";
      case 'professor':
        return 'Manage your opportunities and track student engagement';
      case 'admin':
        return 'System overview and administrative controls';
      default:
        return 'Welcome to Campus Connect';
    }
  };

  return (
    <div className={cn('space-y-1', className)}>
      <h1 className="text-3xl font-bold tracking-tight">
        {getGreeting()}, {userName}! 👋
      </h1>
      <p className="text-muted-foreground">{subtitle || getDefaultSubtitle()}</p>
    </div>
  );
}
