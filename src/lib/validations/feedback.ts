import { z } from 'zod';

/**
 * Student feedback schema (after completing activity)
 */
export const studentFeedbackSchema = z.object({
  enrollmentId: z.string().uuid('Invalid enrollment ID'),

  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating must be at most 5 stars'),

  whatYouLiked: z
    .string()
    .min(20, 'Please share what you liked (at least 20 characters)')
    .max(1000, 'Feedback must be less than 1000 characters'),

  improvements: z
    .string()
    .max(1000, 'Suggestions must be less than 1000 characters')
    .optional()
    .or(z.literal('')),

  wouldRecommend: z.boolean(),

  additionalComments: z
    .string()
    .max(1000, 'Additional comments must be less than 1000 characters')
    .optional()
    .or(z.literal('')),

  anonymous: z.boolean().default(false),
});

export type StudentFeedbackInput = z.infer<typeof studentFeedbackSchema>;

/**
 * Professor feedback response schema (optional response to student feedback)
 */
export const professorFeedbackResponseSchema = z.object({
  feedbackId: z.string().uuid('Invalid feedback ID'),

  response: z
    .string()
    .min(20, 'Response must be at least 20 characters')
    .max(1000, 'Response must be less than 1000 characters'),

  actionTaken: z
    .string()
    .max(500, 'Action taken description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
});

export type ProfessorFeedbackResponseInput = z.infer<typeof professorFeedbackResponseSchema>;

/**
 * Report issue schema (student reports problem with activity/session)
 */
export const reportIssueSchema = z
  .object({
    enrollmentId: z.string().uuid('Invalid enrollment ID').optional(),

    sessionId: z.string().uuid('Invalid session ID').optional(),

    issueType: z.enum(
      [
        'SESSION_CANCELLED',
        'LOCATION_CHANGED',
        'TIME_CONFLICT',
        'PROFESSOR_ABSENT',
        'SAFETY_CONCERN',
        'HARASSMENT',
        'TECHNICAL_ISSUE',
        'OTHER',
      ],
      {
        errorMap: () => ({ message: 'Please select an issue type' }),
      }
    ),

    description: z
      .string()
      .min(50, 'Description must be at least 50 characters')
      .max(2000, 'Description must be less than 2000 characters'),

    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
      errorMap: () => ({ message: 'Please select severity level' }),
    }),

    evidenceDocument: z
      .instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
      .refine(
        (file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
        'File must be PDF, JPEG, or PNG'
      )
      .optional(),

    anonymous: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // At least one of enrollmentId or sessionId must be provided
      return data.enrollmentId || data.sessionId;
    },
    {
      message: 'Either enrollment ID or session ID must be provided',
      path: ['enrollmentId'],
    }
  );

export type ReportIssueInput = z.infer<typeof reportIssueSchema>;
