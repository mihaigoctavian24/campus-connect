'use client';

import { useState } from 'react';
import { Bell, Filter, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import type { Notification } from '@/types/notification';

type FilterType = 'all' | 'unread';

export function NotificationCenter() {
  const [filter, setFilter] = useState<FilterType>('all');

  const {
    notifications,
    unreadCount,
    total,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    hasMore,
  } = useNotifications({
    limit: 20,
    unreadOnly: filter === 'unread',
    enableRealtime: true,
  });

  const handleNotificationClick = (notification: Notification) => {
    // Navigate to related activity if exists
    if (notification.related_activity_id) {
      window.location.href = `/opportunities/${notification.related_activity_id}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notificări</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} notificări necitite` : 'Nicio notificare necitită'}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" onClick={() => markAllAsRead()}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Marchează toate ca citite
          </Button>
        )}
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              <Bell className="h-4 w-4" />
              Toate
              {total > 0 && (
                <span className="ml-1 rounded-full bg-[gold] px-2 py-0.5 text-xs font-medium text-[#001f3f]">
                  {total}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="gap-2">
              <Filter className="h-4 w-4" />
              Necitite
              {unreadCount > 0 && (
                <span className="ml-1 rounded-full bg-[gold] px-2 py-0.5 text-xs text-[#001f3f]">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-4">
          <NotificationList
            notifications={notifications}
            isLoading={isLoading}
            error={error}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            onClick={handleNotificationClick}
            onLoadMore={loadMore}
            hasMore={hasMore}
          />
        </TabsContent>

        <TabsContent value="unread" className="mt-4">
          <NotificationList
            notifications={notifications}
            isLoading={isLoading}
            error={error}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            onClick={handleNotificationClick}
            onLoadMore={loadMore}
            hasMore={hasMore}
            emptyMessage="Nu ai notificări necitite"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (notification: Notification) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  emptyMessage?: string;
}

function NotificationList({
  notifications,
  isLoading,
  error,
  onMarkAsRead,
  onDelete,
  onClick,
  onLoadMore,
  hasMore,
  emptyMessage = 'Nu ai notificări',
}: NotificationListProps) {
  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          onClick={onClick}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Se încarcă...
              </>
            ) : (
              'Încarcă mai multe'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
