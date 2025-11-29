'use client';

import { useState, useEffect } from 'react';
import { Bell, Loader2, CheckCircle, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { useNotificationContext } from '@/lib/contexts/NotificationContext';
import type { Notification, NotificationType } from '@/types/notification';
import { Sparkles, RefreshCw, XCircle, UserX, ClipboardCheck, Award } from 'lucide-react';

// Icon map for notification types
const ICON_MAP: Record<NotificationType, React.ElementType> = {
  ACTIVITY_NEW: Sparkles,
  ACTIVITY_UPDATED: RefreshCw,
  ACTIVITY_CANCELLED: XCircle,
  ENROLLMENT_CONFIRMED: CheckCircle,
  ENROLLMENT_CANCELLED: UserX,
  REMINDER: Bell,
  ATTENDANCE_VALIDATED: ClipboardCheck,
  CERTIFICATE_READY: Award,
};

const COLOR_MAP: Record<NotificationType, string> = {
  ACTIVITY_NEW: 'text-blue-500 bg-blue-50',
  ACTIVITY_UPDATED: 'text-amber-500 bg-amber-50',
  ACTIVITY_CANCELLED: 'text-red-500 bg-red-50',
  ENROLLMENT_CONFIRMED: 'text-green-500 bg-green-50',
  ENROLLMENT_CANCELLED: 'text-red-500 bg-red-50',
  REMINDER: 'text-purple-500 bg-purple-50',
  ATTENDANCE_VALIDATED: 'text-green-500 bg-green-50',
  CERTIFICATE_READY: 'text-yellow-500 bg-yellow-50',
};

interface NotificationDropdownProps {
  /** URL to the full notification center page */
  notificationCenterUrl?: string;
}

/**
 * Compact notification item with inline quick actions
 */
function DropdownNotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onNavigate,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (notification: Notification) => void;
}) {
  const Icon = ICON_MAP[notification.type] || Bell;
  const colorClass = COLOR_MAP[notification.type] || 'text-gray-500 bg-gray-50';

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: ro,
  });

  return (
    <div
      className={`group relative rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
        notification.is_read ? 'bg-background' : 'bg-muted/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorClass}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0 pr-8">
          <p className={`text-sm ${notification.is_read ? 'font-normal' : 'font-medium'}`}>
            {notification.title}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
        </div>
        {!notification.is_read && (
          <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[gold]" />
        )}
      </div>

      {/* Quick actions - visible on hover */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded px-1">
        {!notification.is_read && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            title="Marchează ca citită"
          >
            <CheckCircle className="h-3.5 w-3.5 text-green-600" />
          </Button>
        )}
        {notification.related_activity_id && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(notification);
            }}
            title="Vezi activitatea"
          >
            <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          title="Șterge"
        >
          <Trash2 className="h-3.5 w-3.5 text-red-500" />
        </Button>
      </div>
    </div>
  );
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
  const { setUnreadCount } = useNotificationContext();
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications({ limit: 5, enableRealtime: false });

  // Sync unread count to context when dropdown fetches fresh data
  useEffect(() => {
    if (!isLoading) {
      setUnreadCount(unreadCount);
    }
  }, [unreadCount, isLoading, setUnreadCount]);

  const handleNavigate = (notification: Notification) => {
    if (notification.related_activity_id) {
      window.location.href = `/opportunities/${notification.related_activity_id}`;
    }
    onClose();
  };

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

      <ScrollArea className="h-[350px]">
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
          <div className="space-y-2 p-2">
            {notifications.map((notification) => (
              <DropdownNotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="border-t p-2 space-y-1">
        {unreadCount > 0 && (
          <div className="text-center text-xs text-muted-foreground pb-1">
            {unreadCount} notificări necitite
          </div>
        )}
        <Button variant="outline" className="w-full" size="sm" asChild onClick={onClose}>
          <Link href={notificationCenterUrl}>
            <Bell className="mr-2 h-4 w-4" />
            Vezi toate notificările
          </Link>
        </Button>
      </div>
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
