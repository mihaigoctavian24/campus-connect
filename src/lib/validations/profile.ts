import { z } from 'zod';

/**
 * Student profile update schema
 */
export const studentProfileSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-]+$/, 'Full name can only contain letters, spaces, and hyphens')
    .optional(),

  phone: z.string()
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),

  faculty: z.string()
    .min(2, 'Faculty name is required')
    .max(100)
    .optional(),

  specialization: z.string()
    .min(2, 'Specialization is required')
    .max(100)
    .optional(),

  year: z.number()
    .int()
    .min(1, 'Year must be at least 1')
    .max(6, 'Year must be at most 6')
    .optional(),

  programType: z.enum(['bachelor', 'master', 'phd'], {
    errorMap: () => ({ message: 'Please select a valid program type' })
  }).optional(),

  departmentId: z.string()
    .uuid('Invalid department ID')
    .optional()
    .nullable(),

  avatarUrl: z.string()
    .url('Invalid avatar URL')
    .optional()
    .nullable(),

  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .nullable(),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;

/**
 * Professor profile update schema
 */
export const professorProfileSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-\.]+$/, 'Full name can only contain letters, spaces, hyphens, and periods')
    .optional(),

  phone: z.string()
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),

  departmentId: z.string()
    .uuid('Invalid department ID')
    .optional()
    .nullable(),

  position: z.string()
    .min(2, 'Position is required')
    .max(100)
    .optional(),

  office: z.string()
    .max(100, 'Office location must be less than 100 characters')
    .optional()
    .nullable(),

  avatarUrl: z.string()
    .url('Invalid avatar URL')
    .optional()
    .nullable(),

  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .nullable(),
});

export type ProfessorProfileInput = z.infer<typeof professorProfileSchema>;

/**
 * Avatar upload schema
 */
export const avatarUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'File must be JPEG, PNG, or WebP'
    ),
});

export type AvatarUploadInput = z.infer<typeof avatarUploadSchema>;

/**
 * Notification preferences schema
 */
export const notificationPreferencesSchema = z.object({
  // Email notifications
  emailApplicationAccepted: z.boolean().default(true),
  emailApplicationRejected: z.boolean().default(true),
  emailSessionReminder: z.boolean().default(true),
  emailHoursApproved: z.boolean().default(true),
  emailActivityCompleted: z.boolean().default(true),
  emailNewOpportunity: z.boolean().default(false),
  emailSessionCancelled: z.boolean().default(true),

  // In-app notifications
  inAppApplicationAccepted: z.boolean().default(true),
  inAppApplicationRejected: z.boolean().default(true),
  inAppSessionReminder: z.boolean().default(true),
  inAppHoursApproved: z.boolean().default(true),
  inAppActivityCompleted: z.boolean().default(true),
  inAppNewOpportunity: z.boolean().default(true),
  inAppSessionCancelled: z.boolean().default(true),
});

export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;
