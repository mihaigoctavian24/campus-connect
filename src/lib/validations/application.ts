import { z } from 'zod';

/**
 * Quick apply schema (student applies to opportunity)
 */
export const quickApplySchema = z.object({
  activityId: z.string().uuid('Invalid activity ID'),

  motivation: z
    .string()
    .min(50, 'Motivation must be at least 50 characters')
    .max(1000, 'Motivation must be less than 1000 characters'),

  availability: z
    .string()
    .min(10, 'Please describe your availability')
    .max(500, 'Availability description must be less than 500 characters'),

  experience: z
    .string()
    .max(1000, 'Experience description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),

  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

export type QuickApplyInput = z.infer<typeof quickApplySchema>;

/**
 * Application review schema (professor accepts/rejects)
 */
export const applicationReviewSchema = z
  .object({
    applicationId: z.string().uuid('Invalid application ID'),

    status: z.enum(['ACCEPTED', 'REJECTED', 'WAITLISTED'], {
      errorMap: () => ({ message: 'Invalid status' }),
    }),

    customMessage: z
      .string()
      .max(1000, 'Message must be less than 1000 characters')
      .optional()
      .or(z.literal('')),

    rejectionReason: z
      .enum(['POSITION_FILLED', 'NOT_ELIGIBLE', 'INSUFFICIENT_EXPERIENCE', 'CUSTOM'], {
        errorMap: () => ({ message: 'Please select a rejection reason' }),
      })
      .optional(),

    moveToWaitingList: z.boolean().default(false).optional(),
  })
  .refine(
    (data) => {
      // If rejecting, rejection reason is required
      if (data.status === 'REJECTED' && !data.rejectionReason) {
        return false;
      }
      // If rejection reason is CUSTOM, custom message is required
      if (data.rejectionReason === 'CUSTOM' && !data.customMessage) {
        return false;
      }
      return true;
    },
    {
      message: 'Rejection reason and custom message (if CUSTOM) are required when rejecting',
      path: ['rejectionReason'],
    }
  );

export type ApplicationReviewInput = z.infer<typeof applicationReviewSchema>;

/**
 * Bulk application review schema
 */
export const bulkApplicationReviewSchema = z.object({
  applicationIds: z
    .array(z.string().uuid())
    .min(1, 'At least one application must be selected')
    .max(50, 'Cannot process more than 50 applications at once'),

  status: z.enum(['ACCEPTED', 'REJECTED'], {
    errorMap: () => ({ message: 'Invalid status' }),
  }),

  customMessage: z
    .string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
});

export type BulkApplicationReviewInput = z.infer<typeof bulkApplicationReviewSchema>;

/**
 * Cancel enrollment schema (student cancels application)
 */
export const cancelEnrollmentSchema = z.object({
  enrollmentId: z.string().uuid('Invalid enrollment ID'),

  reason: z
    .string()
    .min(20, 'Please provide a reason (at least 20 characters)')
    .max(500, 'Reason must be less than 500 characters')
    .optional()
    .or(z.literal('')),

  confirmCancellation: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the cancellation',
  }),
});

export type CancelEnrollmentInput = z.infer<typeof cancelEnrollmentSchema>;
