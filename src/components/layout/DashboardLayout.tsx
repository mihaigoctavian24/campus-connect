'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/components/ui/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Search, Calendar, FileText, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: 'student' | 'professor' | 'admin';
}

export function DashboardLayout({ children, role = 'student' }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items based on role
  const navigationItems = {
    student: [
      { href: '/dashboard/student', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/explore', label: 'Explore', icon: Search },
      { href: '/dashboard/student/my-activities', label: 'My Activities', icon: Calendar },
      { href: '/dashboard/student/applications', label: 'Applications', icon: FileText },
    ],
    professor: [
      { href: '/dashboard/professor', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/professor/opportunities', label: 'My Opportunities', icon: Calendar },
      { href: '/dashboard/professor/applications', label: 'Applications', icon: FileText },
      { href: '/dashboard/professor/reports', label: 'Reports', icon: FileText },
    ],
    admin: [
      { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/admin/users', label: 'Users', icon: User },
      { href: '/dashboard/admin/opportunities', label: 'Opportunities', icon: Calendar },
      { href: '/dashboard/admin/reports', label: 'Reports', icon: FileText },
    ],
  };

  const navItems = navigationItems[role];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header is now in root layout - no longer rendered here */}

      {/* Mobile sidebar toggle button */}
      <div className="md:hidden sticky top-[72px] z-40 border-b bg-white px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full justify-start"
        >
          {sidebarOpen ? <X className="mr-2 h-4 w-4" /> : <Menu className="mr-2 h-4 w-4" />}
          Menu
        </Button>
      </div>

      <div className="mx-auto max-w-7xl px-8">
        <div className="flex items-start gap-8 py-8">
          {/* Sidebar */}
          <aside
            className={cn('w-64 shrink-0', 'hidden md:block', sidebarOpen && 'block md:block')}
          >
            <div className="sticky top-24">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition',
                        isActive ? 'bg-[#001f3f] text-white' : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="min-h-screen flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
