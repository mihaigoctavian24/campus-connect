import { z } from 'zod';

/**
 * Mark notification as read schema
 */
export const markNotificationReadSchema = z.object({
  notificationId: z.string()
    .uuid('Invalid notification ID'),
});

export type MarkNotificationReadInput = z.infer<typeof markNotificationReadSchema>;

/**
 * Mark all notifications as read schema
 */
export const markAllNotificationsReadSchema = z.object({
  userId: z.string()
    .uuid('Invalid user ID'),

  beforeDate: z.date({
    invalid_type_error: 'Invalid date format'
  }).optional(), // Mark all notifications before this date as read
});

export type MarkAllNotificationsReadInput = z.infer<typeof markAllNotificationsReadSchema>;

/**
 * Delete notification schema
 */
export const deleteNotificationSchema = z.object({
  notificationId: z.string()
    .uuid('Invalid notification ID'),
});

export type DeleteNotificationInput = z.infer<typeof deleteNotificationSchema>;

/**
 * Get notifications schema (with filters)
 */
export const getNotificationsSchema = z.object({
  userId: z.string()
    .uuid('Invalid user ID'),

  type: z.enum([
    'APPLICATION_ACCEPTED',
    'APPLICATION_REJECTED',
    'APPLICATION_WAITLISTED',
    'SESSION_REMINDER',
    'SESSION_CANCELLED',
    'HOURS_APPROVED',
    'HOURS_REJECTED',
    'ACTIVITY_COMPLETED',
    'CERTIFICATE_READY',
    'NEW_OPPORTUNITY',
    'ENROLLMENT_CANCELLED',
    'FEEDBACK_REQUESTED',
    'GENERAL'
  ]).optional(),

  isRead: z.boolean()
    .optional(),

  dateRange: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  }).optional(),

  page: z.number()
    .int()
    .min(1)
    .default(1),

  limit: z.number()
    .int()
    .min(1)
    .max(100)
    .default(20),
});

export type GetNotificationsInput = z.infer<typeof getNotificationsSchema>;

/**
 * Create custom notification schema (admin sends manual notification)
 */
export const createCustomNotificationSchema = z.object({
  recipientIds: z.array(z.string().uuid())
    .min(1, 'At least one recipient is required')
    .max(1000, 'Cannot send to more than 1000 recipients at once'),

  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters'),

  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),

  type: z.enum([
    'GENERAL',
    'ANNOUNCEMENT',
    'REMINDER',
    'ALERT',
    'INFO'
  ]).default('GENERAL'),

  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .default('MEDIUM'),

  actionUrl: z.string()
    .url('Invalid action URL')
    .optional()
    .or(z.literal('')),

  sendEmail: z.boolean()
    .default(false),

  scheduleFor: z.date({
    invalid_type_error: 'Invalid date format'
  }).optional(), // Schedule notification for future delivery
});

export type CreateCustomNotificationInput = z.infer<typeof createCustomNotificationSchema>;

/**
 * Notification settings update schema
 */
export const updateNotificationSettingsSchema = z.object({
  userId: z.string()
    .uuid('Invalid user ID'),

  emailEnabled: z.boolean()
    .optional(),

  inAppEnabled: z.boolean()
    .optional(),

  preferences: z.object({
    emailApplicationAccepted: z.boolean().optional(),
    emailApplicationRejected: z.boolean().optional(),
    emailSessionReminder: z.boolean().optional(),
    emailHoursApproved: z.boolean().optional(),
    emailActivityCompleted: z.boolean().optional(),
    emailNewOpportunity: z.boolean().optional(),
    emailSessionCancelled: z.boolean().optional(),

    inAppApplicationAccepted: z.boolean().optional(),
    inAppApplicationRejected: z.boolean().optional(),
    inAppSessionReminder: z.boolean().optional(),
    inAppHoursApproved: z.boolean().optional(),
    inAppActivityCompleted: z.boolean().optional(),
    inAppNewOpportunity: z.boolean().optional(),
    inAppSessionCancelled: z.boolean().optional(),
  }).optional(),
});

export type UpdateNotificationSettingsInput = z.infer<typeof updateNotificationSettingsSchema>;
