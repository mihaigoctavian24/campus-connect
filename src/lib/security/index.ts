/**
 * Security Module
 *
 * Centralized security utilities for the Campus Connect platform.
 */

export {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_PRESETS,
  createRateLimitHeaders,
  rateLimitErrorResponse,
} from './rate-limit';

export {
  escapeHtml,
  sanitizeString,
  sanitizeEmail,
  sanitizeUUID,
  sanitizeSlug,
  sanitizeInteger,
  sanitizePositiveInteger,
  sanitizeStringArray,
  sanitizeUrl,
  stripHtmlTags,
  sanitizeRichText,
} from './sanitize';
