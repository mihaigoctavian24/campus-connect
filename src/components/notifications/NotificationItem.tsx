'use client';

import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import {
  Sparkles,
  RefreshCw,
  XCircle,
  CheckCircle,
  UserX,
  Bell,
  ClipboardCheck,
  Award,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Notification, NotificationType } from '@/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: Notification) => void;
  compact?: boolean;
}

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

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
  compact = false,
}: NotificationItemProps) {
  const Icon = ICON_MAP[notification.type] || Bell;
  const colorClass = COLOR_MAP[notification.type] || 'text-gray-500 bg-gray-50';

  const handleClick = () => {
    if (!notification.is_read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (onClick) {
      onClick(notification);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: ro,
  });

  if (compact) {
    return (
      <div
        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
          notification.is_read ? 'bg-background' : 'bg-muted/30'
        }`}
        onClick={handleClick}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorClass}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${notification.is_read ? 'font-normal' : 'font-medium'}`}>
            {notification.title}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
        </div>
        {!notification.is_read && <div className="h-2 w-2 shrink-0 rounded-full bg-[gold] mt-1" />}
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
        notification.is_read ? 'bg-background' : 'bg-muted/30'
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={handleClick}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={`text-sm ${notification.is_read ? 'font-normal' : 'font-medium'}`}>
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
            {notification.activities && (
              <p className="text-xs text-primary mt-1">
                Activitate: {notification.activities.title}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">{timeAgo}</p>
          </div>
          {!notification.is_read && <div className="h-2 w-2 shrink-0 rounded-full bg-[gold]" />}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Acțiuni</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!notification.is_read && onMarkAsRead && (
            <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Marchează ca citită
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              onClick={() => onDelete(notification.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Șterge
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
