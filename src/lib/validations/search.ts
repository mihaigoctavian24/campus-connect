import { z } from 'zod';

/**
 * Search opportunities schema (with filters and sorting)
 */
export const searchOpportunitiesSchema = z.object({
  query: z.string()
    .max(200, 'Search query must be less than 200 characters')
    .optional()
    .or(z.literal('')),

  // Filters
  categories: z.array(z.enum([
    'STEM',
    'SOCIAL_SCIENCES',
    'ARTS_HUMANITIES',
    'HEALTH_MEDICAL',
    'BUSINESS',
    'ENVIRONMENT',
    'COMMUNITY_SERVICE',
    'EDUCATION',
    'GENERAL'
  ])).optional(),

  departments: z.array(z.string().uuid())
    .max(20, 'Maximum 20 departments allowed')
    .optional(),

  locationType: z.enum(['ON_CAMPUS', 'OFF_CAMPUS', 'HYBRID', 'REMOTE'])
    .optional(),

  commitmentType: z.enum(['SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM', 'ONGOING'])
    .optional(),

  availableSpots: z.boolean()
    .optional(), // Only show opportunities with available spots

  dateRange: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  }).optional(),

  hoursPerWeekRange: z.object({
    min: z.number().min(1).max(40).optional(),
    max: z.number().min(1).max(40).optional(),
  }).optional().refine(
    (data) => {
      if (!data || !data.min || !data.max) return true;
      return data.max >= data.min;
    },
    { message: 'Max hours must be greater than or equal to min hours' }
  ),

  // Sorting
  sortBy: z.enum([
    'RELEVANCE',
    'DATE_NEWEST',
    'DATE_OLDEST',
    'TITLE_ASC',
    'TITLE_DESC',
    'SPOTS_AVAILABLE',
    'DEADLINE_SOON'
  ]).default('RELEVANCE'),

  // Pagination
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

export type SearchOpportunitiesInput = z.infer<typeof searchOpportunitiesSchema>;

/**
 * Search users schema (admin/professor search for students)
 */
export const searchUsersSchema = z.object({
  query: z.string()
    .max(200, 'Search query must be less than 200 characters')
    .optional()
    .or(z.literal('')),

  role: z.enum(['STUDENT', 'PROFESSOR', 'ADMIN'])
    .optional(),

  department: z.string()
    .uuid('Invalid department ID')
    .optional(),

  faculty: z.string()
    .max(100)
    .optional(),

  year: z.number()
    .int()
    .min(1)
    .max(6)
    .optional(),

  programType: z.enum(['bachelor', 'master', 'phd'])
    .optional(),

  isActive: z.boolean()
    .optional(),

  // Sorting
  sortBy: z.enum([
    'NAME_ASC',
    'NAME_DESC',
    'EMAIL_ASC',
    'EMAIL_DESC',
    'CREATED_AT_DESC',
    'CREATED_AT_ASC'
  ]).default('NAME_ASC'),

  // Pagination
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

export type SearchUsersInput = z.infer<typeof searchUsersSchema>;

/**
 * Filter saved opportunities schema
 */
export const filterSavedOpportunitiesSchema = z.object({
  categories: z.array(z.enum([
    'STEM',
    'SOCIAL_SCIENCES',
    'ARTS_HUMANITIES',
    'HEALTH_MEDICAL',
    'BUSINESS',
    'ENVIRONMENT',
    'COMMUNITY_SERVICE',
    'EDUCATION',
    'GENERAL'
  ])).optional(),

  status: z.enum(['PUBLISHED', 'IN_PROGRESS', 'COMPLETED'])
    .optional(),

  sortBy: z.enum([
    'SAVED_DATE_DESC',
    'SAVED_DATE_ASC',
    'TITLE_ASC',
    'TITLE_DESC',
    'DEADLINE_SOON'
  ]).default('SAVED_DATE_DESC'),

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

export type FilterSavedOpportunitiesInput = z.infer<typeof filterSavedOpportunitiesSchema>;
