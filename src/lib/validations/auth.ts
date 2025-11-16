import { z } from 'zod';

// Email domain validation for RAU students
const RAU_EMAIL_DOMAIN = '@stud.rau.ro';

// Password requirements
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

/**
 * Sign Up validation schema
 */
export const signUpSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-]+$/, 'Full name can only contain letters, spaces, and hyphens'),

  email: z.string()
    .email('Invalid email address')
    .endsWith(RAU_EMAIL_DOMAIN, `Email must end with ${RAU_EMAIL_DOMAIN}`)
    .toLowerCase(),

  password: z.string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .regex(PASSWORD_REGEX, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignUpInput = z.infer<typeof signUpSchema>;

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .toLowerCase(),

  password: z.string()
    .min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .toLowerCase(),
});

export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;

/**
 * Password reset confirmation schema
 */
export const passwordResetSchema = z.object({
  password: z.string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .regex(PASSWORD_REGEX, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type PasswordResetInput = z.infer<typeof passwordResetSchema>;

/**
 * Change password schema (when user is logged in)
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),

  newPassword: z.string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .regex(PASSWORD_REGEX, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
