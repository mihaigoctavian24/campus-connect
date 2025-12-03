# Validare Date - CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## 1. Zod Schema Validation

### 1.1 Overview

**Library**: [Zod](https://zod.dev) v3.22+

**Benefits**:
- ✅ TypeScript-first
- ✅ Runtime validation
- ✅ Type inference
- ✅ Composable schemas
- ✅ Custom error messages

### 1.2 Basic Example

```typescript
import { z } from 'zod';

const activitySchema = z.object({
  title: z.string().min(10, 'Minim 10 caractere').max(100),
  description: z.string().min(50).max(1000),
  category: z.enum(['ACADEMIC', 'COMMUNITY', 'SPORTS', 'ARTS']),
  start_date: z.string().datetime(),
  capacity: z.number().int().min(1).max(100),
});

// Infer TypeScript type
type ActivityInput = z.infer<typeof activitySchema>;

// Validate
const result = activitySchema.safeParse(data);

if (!result.success) {
  console.error(result.error.flatten());
} else {
  console.log(result.data); // Typed!
}
```

---

## 2. Schema-uri Comune

### 2.1 Activity Schema

```typescript
// lib/schemas/activity.schema.ts
import { z } from 'zod';

export const createActivitySchema = z.object({
  title: z.string()
    .min(10, 'Titlul trebuie să aibă minim 10 caractere')
    .max(100, 'Titlul poate avea maxim 100 caractere'),
  
  description: z.string()
    .min(50, 'Descrierea trebuie să aibă minim 50 caractere')
    .max(2000, 'Descrierea poate avea maxim 2000 caractere'),
  
  category: z.enum([
    'ACADEMIC_SUPPORT',
    'COMMUNITY_SERVICE',
    'SPORTS_RECREATION',
    'ARTS_CULTURE',
    'ENVIRONMENTAL',
    'OTHER'
  ], {
    errorMap: () => ({ message: 'Categorie invalidă' })
  }),
  
  start_date: z.string()
    .datetime()
    .refine((date) => new Date(date) > new Date(), {
      message: 'Data de început trebuie să fie în viitor'
    }),
  
  end_date: z.string()
    .datetime()
    .optional(),
  
  location: z.string()
    .min(5, 'Locația trebuie să aibă minim 5 caractere')
    .max(200),
  
  capacity: z.number()
    .int('Capacitatea trebuie să fie un număr întreg')
    .min(1, 'Capacitatea minimă este 1')
    .max(100, 'Capacitatea maximă este 100'),
  
  requirements: z.object({
    min_year: z.number().int().min(1).max(5).optional(),
    skills: z.array(z.string()).optional(),
  }).optional(),
  
  hours_awarded: z.number()
    .int()
    .min(1, 'Minim 1 oră')
    .max(10, 'Maxim 10 ore per sesiune'),
}).refine((data) => {
  if (data.end_date) {
    return new Date(data.end_date) > new Date(data.start_date);
  }
  return true;
}, {
  message: 'Data de sfârșit trebuie să fie după data de început',
  path: ['end_date'],
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
```

### 2.2 Enrollment Schema

```typescript
// lib/schemas/enrollment.schema.ts
export const enrollmentSchema = z.object({
  activity_id: z.string().uuid('ID activitate invalid'),
  
  motivation: z.string()
    .min(50, 'Motivația trebuie să aibă minim 50 caractere')
    .max(500, 'Motivația poate avea maxim 500 caractere')
    .optional(),
  
  availability: z.object({
    days: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])),
    time_slots: z.array(z.string()),
  }).optional(),
});

export type EnrollmentInput = z.infer<typeof enrollmentSchema>;
```

### 2.3 Profile Schema

```typescript
// lib/schemas/profile.schema.ts
export const updateProfileSchema = z.object({
  first_name: z.string()
    .min(2, 'Prenumele trebuie să aibă minim 2 caractere')
    .max(50)
    .regex(/^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/, 'Prenumele conține caractere invalide'),
  
  last_name: z.string()
    .min(2, 'Numele trebuie să aibă minim 2 caractere')
    .max(50)
    .regex(/^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/, 'Numele conține caractere invalide'),
  
  phone: z.string()
    .regex(/^07[0-9]{8}$/, 'Număr de telefon invalid (ex: 0712345678)')
    .optional()
    .or(z.literal('')),
  
  bio: z.string()
    .max(500, 'Bio poate avea maxim 500 caractere')
    .optional(),
  
  notification_preferences: z.object({
    email_enabled: z.boolean(),
    enrollment_confirmed: z.boolean(),
    hours_approved: z.boolean(),
    session_reminder: z.boolean(),
  }).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
```

### 2.4 Volunteer Hours Schema

```typescript
// lib/schemas/hours.schema.ts
export const submitHoursSchema = z.object({
  activity_id: z.string().uuid(),
  
  hours: z.number()
    .min(0.5, 'Minim 0.5 ore')
    .max(10, 'Maxim 10 ore per sesiune')
    .multipleOf(0.5, 'Orele trebuie să fie multipli de 0.5'),
  
  date: z.string()
    .datetime()
    .refine((date) => new Date(date) <= new Date(), {
      message: 'Data nu poate fi în viitor'
    }),
  
  description: z.string()
    .min(20, 'Descrierea trebuie să aibă minim 20 caractere')
    .max(1000),
  
  proof_url: z.string().url('URL invalid').optional(),
});

export type SubmitHoursInput = z.infer<typeof submitHoursSchema>;
```

---

## 3. Server-Side Validation

### 3.1 API Routes

```typescript
// app/api/activities/route.ts
import { createActivitySchema } from '@/lib/schemas/activity.schema';

export async function POST(request: Request) {
  const body = await request.json();
  
  // Validate
  const result = createActivitySchema.safeParse(body);
  
  if (!result.success) {
    return NextResponse.json(
      { 
        error: 'Validation failed',
        details: result.error.flatten() 
      },
      { status: 400 }
    );
  }
  
  // Use validated data
  const validData = result.data;
  
  // ... create activity
}
```

### 3.2 Server Actions

```typescript
// app/actions/activities.ts
'use server';

import { createActivitySchema } from '@/lib/schemas/activity.schema';

export async function createActivity(formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    // ... rest
  };
  
  const result = createActivitySchema.safeParse(rawData);
  
  if (!result.success) {
    return {
      error: 'Validation failed',
      details: result.error.flatten().fieldErrors,
    };
  }
  
  // ... create activity with result.data
  
  revalidatePath('/dashboard/professor/activities');
  
  return { success: true };
}
```

---

## 4. Client-Side Validation

### 4.1 React Hook Form Integration

```bash
npm install react-hook-form @hookform/resolvers
```

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createActivitySchema, type CreateActivityInput } from '@/lib/schemas/activity.schema';

export function CreateActivityForm() {
  const form = useForm<CreateActivityInput>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'ACADEMIC_SUPPORT',
      capacity: 20,
    },
  });
  
  const onSubmit = async (data: CreateActivityInput) => {
    console.log('Valid data:', data);
    // ... submit
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        {...form.register('title')}
        error={form.formState.errors.title?.message}
      />
      
      <Textarea
        {...form.register('description')}
        error={form.formState.errors.description?.message}
      />
      
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Create Activity
      </Button>
    </form>
  );
}
```

### 4.2 shadcn/ui Form Component

```tsx
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function CreateActivityForm() {
  const form = useForm<CreateActivityInput>({
    resolver: zodResolver(createActivitySchema),
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titlu activitate</FormLabel>
              <FormControl>
                <Input placeholder="Ex: STEM Mentorship" {...field} />
              </FormControl>
              <FormDescription>
                Minim 10 caractere, maxim 100
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacitate</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
```

---

## 5. Custom Validators

### 5.1 Custom Refinements

```typescript
const passwordSchema = z.string()
  .min(8)
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Parola trebuie să conțină cel puțin o literă mare'
  })
  .refine((val) => /[0-9]/.test(val), {
    message: 'Parola trebuie să conțină cel puțin o cifră'
  })
  .refine((val) => /[!@#$%^&*]/.test(val), {
    message: 'Parola trebuie să conțină cel puțin un caracter special'
  });
```

### 5.2 Async Validation

```typescript
const emailSchema = z.string()
  .email()
  .refine(async (email) => {
    const response = await fetch(`/api/check-email?email=${email}`);
    const { available } = await response.json();
    return available;
  }, {
    message: 'Acest email este deja înregistrat'
  });
```

### 5.3 Cross-Field Validation

```typescript
const dateRangeSchema = z.object({
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
}).refine((data) => {
  return new Date(data.end_date) > new Date(data.start_date);
}, {
  message: 'Data de sfârșit trebuie să fie după data de început',
  path: ['end_date'],
});
```

---

## 6. Error Handling

### 6.1 Flatten Errors

```typescript
const result = schema.safeParse(data);

if (!result.success) {
  const errors = result.error.flatten();
  
  console.log(errors.fieldErrors);
  // {
  //   title: ['Minim 10 caractere'],
  //   capacity: ['Capacitatea minimă este 1']
  // }
}
```

### 6.2 Display Errors

```tsx
{errors.title && (
  <p className="text-sm text-red-600 mt-1">
    {errors.title[0]}
  </p>
)}
```

### 6.3 Error Summary

```tsx
{Object.keys(errors).length > 0 && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Erori de validare</AlertTitle>
    <AlertDescription>
      <ul className="list-disc list-inside">
        {Object.entries(errors).map(([field, messages]) => (
          <li key={field}>
            <strong>{field}:</strong> {messages[0]}
          </li>
        ))}
      </ul>
    </AlertDescription>
  </Alert>
)}
```

---

## 7. Database Constraints

### 7.1 NOT NULL

```sql
ALTER TABLE public.activities
ALTER COLUMN title SET NOT NULL;
```

### 7.2 CHECK Constraints

```sql
ALTER TABLE public.activities
ADD CONSTRAINT check_capacity CHECK (capacity > 0 AND capacity <= 100);

ALTER TABLE public.activities
ADD CONSTRAINT check_dates CHECK (end_date > start_date);

ALTER TABLE public.volunteer_hours
ADD CONSTRAINT check_hours CHECK (hours > 0 AND hours <= 10);
```

### 7.3 UNIQUE Constraints

```sql
ALTER TABLE public.profiles
ADD CONSTRAINT unique_email UNIQUE (email);

CREATE UNIQUE INDEX idx_unique_enrollment 
ON public.enrollments(student_id, activity_id)
WHERE deleted_at IS NULL;
```

---

## 8. Sanitization

### 8.1 XSS Prevention

```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML input
const cleanHTML = DOMPurify.sanitize(userInput);
```

**Next.js**: Auto-escapes JSX
```tsx
<p>{userInput}</p> {/* Safe - auto-escaped */}
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userHTML) }} />
```

### 8.2 SQL Injection Prevention

**Supabase**: Parameterized queries (built-in protection)
```typescript
// SAFE - parameterized
const { data } = await supabase
  .from('activities')
  .select('*')
  .eq('title', userInput); // Automatically escaped

// UNSAFE - never do this
await supabase.rpc('raw_sql', { 
  query: `SELECT * FROM activities WHERE title = '${userInput}'` // DON'T!
});
```

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Ultima actualizare**: Decembrie 2024  
**Versiune**: 1.0
