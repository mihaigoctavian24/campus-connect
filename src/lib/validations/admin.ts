import { z } from 'zod';

/**
 * Create department schema (admin)
 */
export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, 'Department name must be at least 2 characters')
    .max(100, 'Department name must be less than 100 characters'),

  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),

  code: z
    .string()
    .min(2, 'Department code must be at least 2 characters')
    .max(20, 'Department code must be less than 20 characters')
    .regex(
      /^[A-Z0-9_-]+$/,
      'Department code can only contain uppercase letters, numbers, underscores, and hyphens'
    ),

  contactEmail: z.string().email('Invalid email address').optional().or(z.literal('')),

  isActive: z.boolean().default(true),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;

/**
 * Update department schema
 */
export const updateDepartmentSchema = z.object({
  departmentId: z.string().uuid('Invalid department ID'),

  name: z
    .string()
    .min(2, 'Department name must be at least 2 characters')
    .max(100, 'Department name must be less than 100 characters')
    .optional(),

  description: z.string().max(500, 'Description must be less than 500 characters').optional(),

  contactEmail: z.string().email('Invalid email address').optional(),

  isActive: z.boolean().optional(),
});

export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;

/**
 * Update user role schema (admin assigns roles)
 */
export const updateUserRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),

  role: z.enum(['STUDENT', 'PROFESSOR', 'ADMIN'], {
    errorMap: () => ({ message: 'Invalid role' }),
  }),

  reason: z
    .string()
    .min(20, 'Please provide a reason (at least 20 characters)')
    .max(500, 'Reason must be less than 500 characters'),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

/**
 * Suspend user schema (admin suspends user account)
 */
export const suspendUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),

  reason: z
    .string()
    .min(20, 'Please provide a reason (at least 20 characters)')
    .max(1000, 'Reason must be less than 1000 characters'),

  suspendUntil: z
    .date({
      invalid_type_error: 'Invalid date format',
    })
    .optional(), // If not provided, suspension is indefinite

  notifyUser: z.boolean().default(true),
});

export type SuspendUserInput = z.infer<typeof suspendUserSchema>;

/**
 * Unsuspend user schema
 */
export const unsuspendUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),

  reason: z
    .string()
    .min(20, 'Please provide a reason (at least 20 characters)')
    .max(500, 'Reason must be less than 500 characters'),

  notifyUser: z.boolean().default(true),
});

export type UnsuspendUserInput = z.infer<typeof unsuspendUserSchema>;

/**
 * System settings update schema
 */
export const updateSystemSettingsSchema = z.object({
  // Email settings
  emailFrom: z.string().email('Invalid email address').optional(),

  emailReplyTo: z.string().email('Invalid email address').optional(),

  // Application settings
  defaultApplicationDeadlineDays: z
    .number()
    .int()
    .min(1, 'At least 1 day required')
    .max(365, 'Maximum 365 days allowed')
    .optional(),

  autoAcceptApplications: z.boolean().optional(),

  requireEmailVerification: z.boolean().optional(),

  // Session settings
  defaultSessionReminderHours: z
    .number()
    .int()
    .min(1, 'At least 1 hour before')
    .max(168, 'Maximum 168 hours (7 days) before')
    .optional(),

  qrCodeExpirationMinutes: z
    .number()
    .int()
    .min(5, 'At least 5 minutes')
    .max(60, 'Maximum 60 minutes')
    .optional(),

  checkInWindowMinutes: z
    .number()
    .int()
    .min(5, 'At least 5 minutes')
    .max(120, 'Maximum 120 minutes (2 hours)')
    .optional(),

  // Certificate settings
  certificateAutoGenerate: z.boolean().optional(),

  certificateRequireMinimumHours: z.boolean().optional(),

  // Notification settings
  enableEmailNotifications: z.boolean().optional(),

  enableInAppNotifications: z.boolean().optional(),

  enablePushNotifications: z.boolean().optional(),
});

export type UpdateSystemSettingsInput = z.infer<typeof updateSystemSettingsSchema>;

/**
 * Audit log query schema
 */
export const auditLogQuerySchema = z.object({
  userId: z.string().uuid('Invalid user ID').optional(),

  action: z
    .enum([
      'CREATE',
      'UPDATE',
      'DELETE',
      'LOGIN',
      'LOGOUT',
      'ROLE_CHANGE',
      'SUSPEND',
      'UNSUSPEND',
      'OTHER',
    ])
    .optional(),

  resourceType: z
    .enum([
      'USER',
      'ACTIVITY',
      'SESSION',
      'ENROLLMENT',
      'ATTENDANCE',
      'CERTIFICATE',
      'DEPARTMENT',
      'SETTINGS',
      'OTHER',
    ])
    .optional(),

  dateRange: z
    .object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    })
    .optional(),

  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),

  page: z.number().int().min(1).default(1),

  limit: z.number().int().min(1).max(100).default(50),
});

export type AuditLogQueryInput = z.infer<typeof auditLogQuerySchema>;

/**
 * Bulk user import schema (admin imports multiple users)
 */
export const bulkUserImportSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) =>
        [
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ].includes(file.type),
      'File must be CSV or Excel'
    ),

  role: z.enum(['STUDENT', 'PROFESSOR'], {
    errorMap: () => ({ message: 'Invalid role' }),
  }),

  sendWelcomeEmail: z.boolean().default(true),

  requirePasswordReset: z.boolean().default(true),
});

export type BulkUserImportInput = z.infer<typeof bulkUserImportSchema>;
