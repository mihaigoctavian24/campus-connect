import { z } from 'zod';

/**
 * Validation schema for logging hours
 * Used by LogHoursModal and POST /api/hours/log endpoint
 */
export const logHoursSchema = z.object({
  enrollment_id: z.string().uuid('ID de înscriere invalid'),
  activity_id: z.string().uuid('ID de activitate invalid'),
  hours: z
    .number({
      required_error: 'Numărul de ore este obligatoriu',
      invalid_type_error: 'Numărul de ore trebuie să fie un număr',
    })
    .min(0.5, 'Minim 0.5 ore (30 minute)')
    .max(24, 'Maxim 24 ore pe zi'),
  date: z
    .date({
      required_error: 'Data este obligatorie',
      invalid_type_error: 'Data trebuie să fie validă',
    })
    .max(new Date(), 'Data nu poate fi în viitor'),
  description: z
    .string({
      required_error: 'Descrierea este obligatorie',
    })
    .min(20, 'Descrierea trebuie să conțină minim 20 caractere')
    .max(1000, 'Descrierea nu poate depăși 1000 caractere'),
  evidence_urls: z.array(z.string().url('URL invalid')).optional(),
});

export type LogHoursFormData = z.infer<typeof logHoursSchema>;

/**
 * API request body schema (accepts ISO string for date)
 */
export const logHoursApiSchema = z.object({
  enrollment_id: z.string().uuid('ID de înscriere invalid'),
  activity_id: z.string().uuid('ID de activitate invalid'),
  hours: z.number().min(0.5).max(24),
  date: z.string().refine(
    (dateStr) => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime()) && date <= new Date();
    },
    {
      message: 'Data trebuie să fie validă și nu poate fi în viitor',
    }
  ),
  description: z.string().min(20).max(1000),
  evidence_urls: z.array(z.string().url()).optional(),
});

export type LogHoursApiRequest = z.infer<typeof logHoursApiSchema>;
