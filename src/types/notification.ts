/**
 * Notification types matching database enum
 */
export type NotificationType =
  | 'ACTIVITY_NEW'
  | 'ACTIVITY_UPDATED'
  | 'ACTIVITY_CANCELLED'
  | 'ENROLLMENT_CONFIRMED'
  | 'ENROLLMENT_CANCELLED'
  | 'REMINDER'
  | 'ATTENDANCE_VALIDATED'
  | 'CERTIFICATE_READY';

/**
 * Notification from database with optional activity relation
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  related_activity_id: string | null;
  activities?: {
    id: string;
    title: string;
  } | null;
}

/**
 * Response from GET /api/notifications
 */
export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unread_count: number;
  limit: number;
  offset: number;
}

/**
 * Notification preferences stored in profiles.notification_preferences JSONB
 */
export interface NotificationPreferences {
  email_applications: boolean;
  email_hours: boolean;
  email_activity_updates: boolean;
  email_reminders: boolean;
  email_general: boolean;
  in_app_applications: boolean;
  in_app_hours: boolean;
  in_app_activity_updates: boolean;
  in_app_reminders: boolean;
  in_app_general: boolean;
}

/**
 * Default notification preferences
 */
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  email_applications: true,
  email_hours: true,
  email_activity_updates: true,
  email_reminders: true,
  email_general: false,
  in_app_applications: true,
  in_app_hours: true,
  in_app_activity_updates: true,
  in_app_reminders: true,
  in_app_general: true,
};

/**
 * Icon and color mapping for notification types
 */
export const NOTIFICATION_TYPE_CONFIG: Record<
  NotificationType,
  { icon: string; color: string; label: string }
> = {
  ACTIVITY_NEW: {
    icon: 'Sparkles',
    color: 'text-blue-500',
    label: 'Activitate nouă',
  },
  ACTIVITY_UPDATED: {
    icon: 'RefreshCw',
    color: 'text-amber-500',
    label: 'Activitate actualizată',
  },
  ACTIVITY_CANCELLED: {
    icon: 'XCircle',
    color: 'text-red-500',
    label: 'Activitate anulată',
  },
  ENROLLMENT_CONFIRMED: {
    icon: 'CheckCircle',
    color: 'text-green-500',
    label: 'Înscriere confirmată',
  },
  ENROLLMENT_CANCELLED: {
    icon: 'UserX',
    color: 'text-red-500',
    label: 'Înscriere anulată',
  },
  REMINDER: {
    icon: 'Bell',
    color: 'text-purple-500',
    label: 'Reminder',
  },
  ATTENDANCE_VALIDATED: {
    icon: 'ClipboardCheck',
    color: 'text-green-500',
    label: 'Prezență validată',
  },
  CERTIFICATE_READY: {
    icon: 'Award',
    color: 'text-yellow-500',
    label: 'Certificat disponibil',
  },
};
