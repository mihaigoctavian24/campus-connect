/**
 * Input Sanitization Utilities
 *
 * Provides functions to sanitize user input to prevent XSS and injection attacks.
 */

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  return str.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char]);
}

/**
 * Sanitize string input by trimming and removing null bytes
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }
  // Remove null bytes, trim whitespace
  return input.replace(/\0/g, '').trim();
}

/**
 * Sanitize and validate email format
 */
export function sanitizeEmail(input: unknown): string | null {
  if (typeof input !== 'string') {
    return null;
  }

  const sanitized = sanitizeString(input).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Sanitize UUID format
 */
export function sanitizeUUID(input: unknown): string | null {
  if (typeof input !== 'string') {
    return null;
  }

  const sanitized = sanitizeString(input).toLowerCase();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  if (!uuidRegex.test(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Sanitize slug format (lowercase letters, numbers, and hyphens)
 */
export function sanitizeSlug(input: unknown): string | null {
  if (typeof input !== 'string') {
    return null;
  }

  const sanitized = sanitizeString(input).toLowerCase();
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!slugRegex.test(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Sanitize integer input
 */
export function sanitizeInteger(input: unknown): number | null {
  if (typeof input === 'number' && Number.isInteger(input)) {
    return input;
  }

  if (typeof input === 'string') {
    const parsed = parseInt(input, 10);
    if (!isNaN(parsed) && Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

/**
 * Sanitize positive integer (for pagination, limits, etc.)
 */
export function sanitizePositiveInteger(input: unknown, max?: number): number | null {
  const num = sanitizeInteger(input);
  if (num === null || num < 1) {
    return null;
  }
  if (max !== undefined && num > max) {
    return max;
  }
  return num;
}

/**
 * Sanitize array of strings
 */
export function sanitizeStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter((item) => typeof item === 'string').map((item) => sanitizeString(item));
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(input: unknown): string | null {
  if (typeof input !== 'string') {
    return null;
  }

  try {
    const url = new URL(sanitizeString(input));
    // Only allow http and https protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

/**
 * Strip HTML tags from string
 */
export function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize rich text content (basic - for more robust, use a library like DOMPurify)
 */
export function sanitizeRichText(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove script tags and event handlers
  const sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*(['"])[^'"]*\1/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '');

  return sanitized.trim();
}
