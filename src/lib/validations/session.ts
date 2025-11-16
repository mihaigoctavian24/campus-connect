import { z } from 'zod';

/**
 * Recurring pattern schema for session creation
 */
export const recurringPatternSchema = z
  .object({
    dayOfWeek: z.enum(
      ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
      {
        errorMap: () => ({ message: 'Please select a valid day of week' }),
      }
    ),

    startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),

    endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),

    frequency: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY'], {
      errorMap: () => ({ message: 'Please select a valid frequency' }),
    }),

    startDate: z.date({
      required_error: 'Start date is required',
      invalid_type_error: 'Invalid date format',
    }),

    endDate: z.date({
      required_error: 'End date is required',
      invalid_type_error: 'Invalid date format',
    }),

    location: z
      .string()
      .min(5, 'Location must be at least 5 characters')
      .max(200, 'Location must be less than 200 characters')
      .optional(),

    maxParticipants: z
      .number()
      .int()
      .min(1, 'At least 1 participant is required')
      .max(500, 'Maximum 500 participants allowed')
      .optional()
      .nullable(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
  .refine(
    (data) => {
      const [startHour, startMin] = data.startTime.split(':').map(Number);
      const [endHour, endMin] = data.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      return endMinutes > startMinutes;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  );

export type RecurringPatternInput = z.infer<typeof recurringPatternSchema>;

/**
 * Individual session schema
 */
export const individualSessionSchema = z
  .object({
    activityId: z.string().uuid('Invalid activity ID'),

    sessionDate: z.date({
      required_error: 'Session date is required',
      invalid_type_error: 'Invalid date format',
    }),

    startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),

    endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),

    location: z
      .string()
      .min(5, 'Location must be at least 5 characters')
      .max(200, 'Location must be less than 200 characters'),

    maxParticipants: z
      .number()
      .int()
      .min(1, 'At least 1 participant is required')
      .max(500, 'Maximum 500 participants allowed')
      .optional()
      .nullable(),

    notes: z
      .string()
      .max(500, 'Notes must be less than 500 characters')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      const [startHour, startMin] = data.startTime.split(':').map(Number);
      const [endHour, endMin] = data.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      return endMinutes > startMinutes;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  );

export type IndividualSessionInput = z.infer<typeof individualSessionSchema>;

/**
 * Update session schema
 */
export const updateSessionSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),

  sessionDate: z
    .date({
      invalid_type_error: 'Invalid date format',
    })
    .optional(),

  startTime: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .optional(),

  endTime: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .optional(),

  location: z
    .string()
    .min(5, 'Location must be at least 5 characters')
    .max(200, 'Location must be less than 200 characters')
    .optional(),

  maxParticipants: z
    .number()
    .int()
    .min(1, 'At least 1 participant is required')
    .max(500, 'Maximum 500 participants allowed')
    .optional(),

  status: z
    .enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], {
      errorMap: () => ({ message: 'Invalid status' }),
    })
    .optional(),

  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;

/**
 * Cancel session schema
 */
export const cancelSessionSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),

  reason: z
    .string()
    .min(20, 'Please provide a cancellation reason (at least 20 characters)')
    .max(500, 'Reason must be less than 500 characters'),

  notifyParticipants: z.boolean().default(true),
});

export type CancelSessionInput = z.infer<typeof cancelSessionSchema>;

/**
 * Bulk session creation schema (from recurring pattern)
 */
export const bulkSessionCreationSchema = z.object({
  activityId: z.string().uuid('Invalid activity ID'),

  pattern: recurringPatternSchema,

  confirmGeneration: z.boolean().refine((val) => val === true, {
    message: 'You must confirm session generation',
  }),
});

export type BulkSessionCreationInput = z.infer<typeof bulkSessionCreationSchema>;
