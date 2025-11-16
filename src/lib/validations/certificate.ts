import { z } from 'zod';

/**
 * Generate certificate schema
 */
export const generateCertificateSchema = z.object({
  enrollmentId: z.string()
    .uuid('Invalid enrollment ID'),

  includeDetails: z.boolean()
    .default(true), // Include detailed activity description

  includeHours: z.boolean()
    .default(true), // Include hours breakdown

  language: z.enum(['RO', 'EN'], {
    errorMap: () => ({ message: 'Please select a language' })
  }).default('RO'),
});

export type GenerateCertificateInput = z.infer<typeof generateCertificateSchema>;

/**
 * Certificate template schema (admin creates custom templates)
 */
export const certificateTemplateSchema = z.object({
  name: z.string()
    .min(5, 'Template name must be at least 5 characters')
    .max(100, 'Template name must be less than 100 characters'),

  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),

  headerHtml: z.string()
    .min(1, 'Header HTML is required')
    .max(10000, 'Header HTML must be less than 10000 characters'),

  bodyHtml: z.string()
    .min(1, 'Body HTML is required')
    .max(10000, 'Body HTML must be less than 10000 characters'),

  footerHtml: z.string()
    .min(1, 'Footer HTML is required')
    .max(10000, 'Footer HTML must be less than 10000 characters'),

  styles: z.string()
    .max(10000, 'Styles must be less than 10000 characters')
    .optional()
    .or(z.literal('')),

  variables: z.array(z.string())
    .max(50, 'Maximum 50 variables allowed')
    .optional(), // Available template variables like {{student_name}}, {{activity_title}}

  isDefault: z.boolean()
    .default(false),

  isActive: z.boolean()
    .default(true),
});

export type CertificateTemplateInput = z.infer<typeof certificateTemplateSchema>;

/**
 * Request certificate schema (student requests certificate manually)
 */
export const requestCertificateSchema = z.object({
  enrollmentId: z.string()
    .uuid('Invalid enrollment ID'),

  requestReason: z.string()
    .max(500, 'Request reason must be less than 500 characters')
    .optional()
    .or(z.literal('')),

  deliveryMethod: z.enum(['EMAIL', 'DOWNLOAD'], {
    errorMap: () => ({ message: 'Please select delivery method' })
  }).default('EMAIL'),

  language: z.enum(['RO', 'EN'], {
    errorMap: () => ({ message: 'Please select a language' })
  }).default('RO'),
});

export type RequestCertificateInput = z.infer<typeof requestCertificateSchema>;
