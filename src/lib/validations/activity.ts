import { z } from 'zod';

/**
 * Activity basic info schema (Step 1 of wizard)
 */
export const activityBasicInfoSchema = z.object({
  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must be less than 200 characters'),

  description: z.string()
    .min(100, 'Description must be at least 100 characters')
    .max(5000, 'Description must be less than 5000 characters'),

  category: z.enum([
    'STEM',
    'SOCIAL_SCIENCES',
    'ARTS_HUMANITIES',
    'HEALTH_MEDICAL',
    'BUSINESS',
    'ENVIRONMENT',
    'COMMUNITY_SERVICE',
    'EDUCATION',
    'GENERAL'
  ], {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),

  departmentId: z.string()
    .uuid('Invalid department ID'),

  imageUrl: z.string()
    .url('Invalid image URL')
    .optional()
    .nullable(),
});

export type ActivityBasicInfoInput = z.infer<typeof activityBasicInfoSchema>;

/**
 * Activity logistics schema (Step 2 of wizard)
 */
export const activityLogisticsSchema = z.object({
  locationType: z.enum(['ON_CAMPUS', 'OFF_CAMPUS', 'HYBRID', 'REMOTE'], {
    errorMap: () => ({ message: 'Please select a location type' })
  }),

  location: z.string()
    .min(5, 'Location must be at least 5 characters')
    .max(200, 'Location must be less than 200 characters'),

  maxParticipants: z.number()
    .int()
    .min(1, 'At least 1 participant is required')
    .max(500, 'Maximum 500 participants allowed'),

  eligibilityCriteria: z.string()
    .max(1000, 'Eligibility criteria must be less than 1000 characters')
    .optional()
    .or(z.literal('')),

  requiredSkills: z.array(z.string())
    .max(20, 'Maximum 20 skills allowed')
    .optional(),

  benefits: z.string()
    .max(1000, 'Benefits description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
});

export type ActivityLogisticsInput = z.infer<typeof activityLogisticsSchema>;

/**
 * Activity schedule schema (Step 3 of wizard)
 */
export const activityScheduleSchema = z.object({
  startDate: z.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Invalid date format'
  }),

  endDate: z.date({
    required_error: 'End date is required',
    invalid_type_error: 'Invalid date format'
  }),

  applicationDeadline: z.date({
    required_error: 'Application deadline is required',
    invalid_type_error: 'Invalid date format'
  }),

  commitmentType: z.enum(['SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM', 'ONGOING'], {
    errorMap: () => ({ message: 'Please select a commitment type' })
  }),

  hoursPerWeek: z.number()
    .min(1, 'At least 1 hour per week is required')
    .max(40, 'Maximum 40 hours per week allowed')
    .optional(),

  totalHours: z.number()
    .int()
    .min(1, 'At least 1 total hour is required')
    .max(1000, 'Maximum 1000 total hours allowed')
    .optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
}).refine((data) => data.applicationDeadline <= data.startDate, {
  message: 'Application deadline must be before or equal to start date',
  path: ['applicationDeadline'],
});

export type ActivityScheduleInput = z.infer<typeof activityScheduleSchema>;

/**
 * Activity settings schema (Step 4 of wizard)
 */
export const activitySettingsSchema = z.object({
  autoAccept: z.boolean()
    .default(false),

  requireApproval: z.boolean()
    .default(true),

  allowWaitlist: z.boolean()
    .default(true),

  sendReminders: z.boolean()
    .default(true),

  reminderHoursBefore: z.number()
    .int()
    .min(1, 'At least 1 hour before')
    .max(168, 'Maximum 168 hours (7 days) before')
    .default(24),

  minimumHoursRequired: z.number()
    .int()
    .min(1, 'At least 1 hour is required')
    .max(1000, 'Maximum 1000 hours allowed')
    .optional(),

  certificateEnabled: z.boolean()
    .default(true),

  feedbackEnabled: z.boolean()
    .default(true),
});

export type ActivitySettingsInput = z.infer<typeof activitySettingsSchema>;

/**
 * Complete activity creation schema (all steps combined)
 */
export const createActivitySchema = z.object({
  basicInfo: activityBasicInfoSchema,
  logistics: activityLogisticsSchema,
  schedule: activityScheduleSchema,
  settings: activitySettingsSchema,
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;

/**
 * Activity update schema
 */
export const updateActivitySchema = z.object({
  activityId: z.string()
    .uuid('Invalid activity ID'),

  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must be less than 200 characters')
    .optional(),

  description: z.string()
    .min(100, 'Description must be at least 100 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .optional(),

  location: z.string()
    .min(5, 'Location must be at least 5 characters')
    .max(200, 'Location must be less than 200 characters')
    .optional(),

  maxParticipants: z.number()
    .int()
    .min(1, 'At least 1 participant is required')
    .max(500, 'Maximum 500 participants allowed')
    .optional(),

  status: z.enum(['DRAFT', 'PUBLISHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], {
    errorMap: () => ({ message: 'Invalid status' })
  }).optional(),
});

export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;

/**
 * Activity image upload schema
 */
export const activityImageUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'File must be JPEG, PNG, or WebP'
    ),
});

export type ActivityImageUploadInput = z.infer<typeof activityImageUploadSchema>;
