'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Notification, NotificationsResponse } from '@/types/notification';

// Simple event emitter for cross-component notification sync
type NotificationEventHandler = (delta: number) => void;

const notificationEventHandlers = new Set<NotificationEventHandler>();

export function emitNotificationEvent(delta: number) {
  notificationEventHandlers.forEach((handler) => handler(delta));
}

export function subscribeToNotificationEvents(handler: NotificationEventHandler) {
  notificationEventHandlers.add(handler);
  return () => {
    notificationEventHandlers.delete(handler);
  };
}

interface UseNotificationsOptions {
  limit?: number;
  unreadOnly?: boolean;
  enableRealtime?: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const { limit = 20, unreadOnly = false, enableRealtime = true } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(
    async (resetOffset = true) => {
      try {
        setIsLoading(true);
        setError(null);

        const currentOffset = resetOffset ? 0 : offset;
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: currentOffset.toString(),
        });

        if (unreadOnly) {
          params.set('unread_only', 'true');
        }

        const response = await fetch(`/api/notifications?${params}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Eroare la încărcarea notificărilor');
        }

        const data: NotificationsResponse = await response.json();

        if (resetOffset) {
          setNotifications(data.notifications);
          setOffset(limit);
        } else {
          setNotifications((prev) => [...prev, ...data.notifications]);
          setOffset((prev) => prev + limit);
        }

        setUnreadCount(data.unread_count);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Eroare necunoscută');
      } finally {
        setIsLoading(false);
      }
    },
    [limit, offset, unreadOnly]
  );

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/notifications/${id}/read`, {
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Eroare la marcarea notificării');
        }

        // Check if notification was unread before marking
        const wasUnread = notifications.find((n) => n.id === id && !n.is_read);

        // Optimistic update
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // Emit event for cross-component sync
        if (wasUnread) {
          emitNotificationEvent(-1);
        }
      } catch (err) {
        console.error('Error marking notification as read:', err);
        throw err;
      }
    },
    [notifications]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Eroare la marcarea notificărilor');
      }

      // Count unread before marking
      const unreadBefore = notifications.filter((n) => !n.is_read).length;

      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);

      // Emit event for cross-component sync
      if (unreadBefore > 0) {
        emitNotificationEvent(-unreadBefore);
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      throw err;
    }
  }, [notifications]);

  const deleteNotification = useCallback(
    async (id: string) => {
      try {
        // Find notification before delete to check if unread
        const notificationToDelete = notifications.find((n) => n.id === id);
        const wasUnread = notificationToDelete && !notificationToDelete.is_read;

        const response = await fetch(`/api/notifications/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Eroare la ștergerea notificării');
        }

        // Optimistic update
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setTotal((prev) => Math.max(0, prev - 1));

        if (wasUnread) {
          setUnreadCount((count) => Math.max(0, count - 1));
          // Emit event for cross-component sync
          emitNotificationEvent(-1);
        }
      } catch (err) {
        console.error('Error deleting notification:', err);
        throw err;
      }
    },
    [notifications]
  );

  const loadMore = useCallback(async () => {
    if (!isLoading && notifications.length < total) {
      await fetchNotifications(false);
    }
  }, [isLoading, notifications.length, total, fetchNotifications]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications(true);
  }, [unreadOnly, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  // Realtime subscription
  useEffect(() => {
    if (!enableRealtime) return;

    const supabase = createClient();

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          // Add new notification to the top of the list
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          setTotal((prev) => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const updatedNotification = payload.new as Notification;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updatedNotification.id ? updatedNotification : n))
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const deletedId = payload.old?.id;
          const deletedNotification = payload.old as Partial<Notification> | undefined;

          if (deletedId) {
            // Remove from local list
            setNotifications((prev) => prev.filter((n) => n.id !== deletedId));
            setTotal((prev) => Math.max(0, prev - 1));

            // Update unread count based on the deleted notification's is_read status
            // payload.old contains the deleted row data
            if (deletedNotification && deletedNotification.is_read === false) {
              setUnreadCount((count) => Math.max(0, count - 1));
            }
          } else {
            // Fallback: refetch if we can't identify the deleted notification
            fetchNotifications(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enableRealtime]);

  return {
    notifications,
    unreadCount,
    total,
    isLoading,
    error,
    refetch: () => fetchNotifications(true),
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    hasMore: notifications.length < total,
  };
}
