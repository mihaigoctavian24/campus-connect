'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Notification, NotificationsResponse } from '@/types/notification';
import { subscribeToNotificationEvents } from '@/lib/hooks/useNotifications';

interface NotificationContextValue {
  unreadCount: number;
  refetchCount: () => Promise<void>;
  decrementUnread: () => void;
  setUnreadCount: (count: number) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications?limit=1&offset=0', {
        cache: 'no-store',
      });
      if (response.ok) {
        const data: NotificationsResponse = await response.json();
        setUnreadCount(data.unread_count);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  const decrementUnread = useCallback(() => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Subscribe to cross-component notification events
  useEffect(() => {
    const unsubscribe = subscribeToNotificationEvents((delta) => {
      setUnreadCount((prev) => Math.max(0, prev + delta));
    });
    return unsubscribe;
  }, []);

  // Realtime subscription for badge updates
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('notification-badge-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const newNotification = payload.new as Partial<Notification>;
          if (newNotification.is_read === false) {
            setUnreadCount((prev) => prev + 1);
          }
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
          const oldNotification = payload.old as Partial<Notification>;
          const newNotification = payload.new as Partial<Notification>;
          // If was unread and now is read, decrement
          if (oldNotification.is_read === false && newNotification.is_read === true) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
          // If was read and now is unread, increment (unlikely but handle it)
          if (oldNotification.is_read === true && newNotification.is_read === false) {
            setUnreadCount((prev) => prev + 1);
          }
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
          const deletedNotification = payload.old as Partial<Notification>;
          if (deletedNotification.is_read === false) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        refetchCount: fetchUnreadCount,
        decrementUnread,
        setUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
}
