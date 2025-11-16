import { z } from 'zod';

/**
 * QR Code check-in schema (student scans QR)
 */
export const qrCheckInSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),

  qrPayload: z.string().min(1, 'QR code payload is required'),

  timestamp: z.date({
    required_error: 'Timestamp is required',
    invalid_type_error: 'Invalid timestamp',
  }),

  locationHash: z.string().optional(), // For future geolocation verification
});

export type QRCheckInInput = z.infer<typeof qrCheckInSchema>;

/**
 * Manual attendance marking schema (professor marks attendance)
 */
export const manualAttendanceSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),

  enrollmentId: z.string().uuid('Invalid enrollment ID'),

  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'], {
    errorMap: () => ({ message: 'Invalid attendance status' }),
  }),

  notes: z.string().max(500, 'Notes must be less than 500 characters').optional().or(z.literal('')),

  hoursWorked: z
    .number()
    .min(0, 'Hours worked cannot be negative')
    .max(24, 'Hours worked cannot exceed 24 hours')
    .optional(),
});

export type ManualAttendanceInput = z.infer<typeof manualAttendanceSchema>;

/**
 * Bulk attendance marking schema
 */
export const bulkAttendanceSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),

  attendanceRecords: z
    .array(
      z.object({
        enrollmentId: z.string().uuid(),
        status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
        notes: z.string().max(500).optional().or(z.literal('')),
      })
    )
    .min(1, 'At least one attendance record is required')
    .max(500, 'Cannot process more than 500 records at once'),
});

export type BulkAttendanceInput = z.infer<typeof bulkAttendanceSchema>;

/**
 * Log extra hours schema (student logs hours outside scheduled sessions)
 */
export const logHoursSchema = z
  .object({
    enrollmentId: z.string().uuid('Invalid enrollment ID'),

    workDate: z.date({
      required_error: 'Work date is required',
      invalid_type_error: 'Invalid date format',
    }),

    hoursWorked: z
      .number()
      .min(0.5, 'Minimum 0.5 hours required')
      .max(24, 'Maximum 24 hours allowed'),

    description: z
      .string()
      .min(50, 'Description must be at least 50 characters')
      .max(1000, 'Description must be less than 1000 characters'),

    proofDocument: z
      .instanceof(File)
      .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
      .refine(
        (file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
        'File must be PDF, JPEG, or PNG'
      )
      .optional(),
  })
  .refine(
    (data) => {
      // Work date cannot be in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return data.workDate <= today;
    },
    {
      message: 'Work date cannot be in the future',
      path: ['workDate'],
    }
  );

export type LogHoursInput = z.infer<typeof logHoursSchema>;

/**
 * Approve/reject hours request schema (professor reviews logged hours)
 */
export const reviewHoursSchema = z
  .object({
    hoursRequestId: z.string().uuid('Invalid hours request ID'),

    status: z.enum(['APPROVED', 'REJECTED'], {
      errorMap: () => ({ message: 'Invalid status' }),
    }),

    rejectionReason: z
      .string()
      .min(20, 'Rejection reason must be at least 20 characters')
      .max(500, 'Rejection reason must be less than 500 characters')
      .optional(),

    approvedHours: z.number().min(0.5, 'Minimum 0.5 hours').max(24, 'Maximum 24 hours').optional(), // Allow professor to adjust hours

    notes: z
      .string()
      .max(500, 'Notes must be less than 500 characters')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      // If rejecting, rejection reason is required
      if (data.status === 'REJECTED' && !data.rejectionReason) {
        return false;
      }
      return true;
    },
    {
      message: 'Rejection reason is required when rejecting hours',
      path: ['rejectionReason'],
    }
  );

export type ReviewHoursInput = z.infer<typeof reviewHoursSchema>;

/**
 * Update attendance schema (edit existing attendance record)
 */
export const updateAttendanceSchema = z.object({
  attendanceId: z.string().uuid('Invalid attendance ID'),

  status: z
    .enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'], {
      errorMap: () => ({ message: 'Invalid attendance status' }),
    })
    .optional(),

  hoursWorked: z
    .number()
    .min(0, 'Hours worked cannot be negative')
    .max(24, 'Hours worked cannot exceed 24 hours')
    .optional(),

  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
