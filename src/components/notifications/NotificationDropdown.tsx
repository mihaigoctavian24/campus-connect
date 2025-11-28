'use client';

import { useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { useNotificationContext } from '@/lib/contexts/NotificationContext';
import { NotificationItem } from './NotificationItem';

interface NotificationDropdownProps {
  /** URL to the full notification center page */
  notificationCenterUrl?: string;
}

/**
 * Inner content component that fetches notifications fresh each time
 * it mounts. This ensures data is always up-to-date when dropdown opens.
 */
function NotificationDropdownContent({
  notificationCenterUrl,
  onClose,
}: {
  notificationCenterUrl: string;
  onClose: () => void;
}) {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications({ limit: 5, enableRealtime: false });

  return (
    <>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h4 className="font-medium">Notificări</h4>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-xs"
            onClick={() => markAllAsRead()}
          >
            Marchează toate ca citite
          </Button>
        )}
      </div>

      <ScrollArea className="h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">Nu ai notificări</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
                compact
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {notifications.length > 0 && (
        <div className="border-t p-2">
          <Button variant="ghost" className="w-full" size="sm" asChild onClick={onClose}>
            <Link href={notificationCenterUrl}>Vezi toate notificările</Link>
          </Button>
        </div>
      )}
    </>
  );
}

export function NotificationDropdown({
  notificationCenterUrl = '/dashboard/student/notifications',
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Key changes each time we open, forcing the content component to remount
  const [contentKey, setContentKey] = useState(0);

  // Use shared context for badge count - syncs across all components
  const { unreadCount } = useNotificationContext();

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Increment key to force remount and fresh data fetch
      setContentKey((k) => k + 1);
    }
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[gold] text-xs font-medium text-[#001f3f]">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notificări ({unreadCount} necitite)</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end">
        <NotificationDropdownContent
          key={contentKey}
          notificationCenterUrl={notificationCenterUrl}
          onClose={() => setIsOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
