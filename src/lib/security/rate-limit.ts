/**
 * Rate Limiting Utility for API Routes
 *
 * Provides in-memory rate limiting with configurable windows and limits.
 * For production at scale, consider using Redis or Upstash.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Identifier for the rate limit bucket (e.g., 'auth', 'api') */
  identifier?: string;
}

// In-memory store for rate limits
// Key format: {identifier}:{ip}
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check rate limit for a given IP address
 * @returns Object with success status and remaining requests
 */
export function checkRateLimit(
  ip: string,
  config: RateLimitConfig
): {
  success: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
} {
  cleanupExpiredEntries();

  const { limit, windowMs, identifier = 'default' } = config;
  const key = `${identifier}:${ip}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  // New entry or expired
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: limit - 1,
      resetAt: now + windowMs,
      limit,
    };
  }

  // Within window - check limit
  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
      limit,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
    limit,
  };
}

/**
 * Get client IP from request headers
 * Handles various proxy configurations
 */
export function getClientIp(request: Request): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to a default identifier
  return 'unknown';
}

// Preset configurations for common use cases
export const RATE_LIMIT_PRESETS = {
  /** Auth endpoints: 5 requests per minute */
  auth: {
    limit: 5,
    windowMs: 60 * 1000,
    identifier: 'auth',
  },
  /** Password reset: 3 requests per 15 minutes */
  passwordReset: {
    limit: 3,
    windowMs: 15 * 60 * 1000,
    identifier: 'password-reset',
  },
  /** API general: 100 requests per minute */
  api: {
    limit: 100,
    windowMs: 60 * 1000,
    identifier: 'api',
  },
  /** API strict: 30 requests per minute (for sensitive endpoints) */
  apiStrict: {
    limit: 30,
    windowMs: 60 * 1000,
    identifier: 'api-strict',
  },
  /** File uploads: 10 per hour */
  upload: {
    limit: 10,
    windowMs: 60 * 60 * 1000,
    identifier: 'upload',
  },
  /** Email sending: 10 per hour per user */
  email: {
    limit: 10,
    windowMs: 60 * 60 * 1000,
    identifier: 'email',
  },
} as const;

/**
 * Create rate limit response headers
 */
export function createRateLimitHeaders(result: {
  remaining: number;
  resetAt: number;
  limit: number;
}): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetAt / 1000).toString(),
  };
}

/**
 * Rate limit error response in Romanian
 */
export function rateLimitErrorResponse(resetAt: number): Response {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);

  return new Response(
    JSON.stringify({
      error: 'Prea multe cereri. Vă rugăm să așteptați.',
      message: `Ați depășit limita de cereri. Încercați din nou în ${retryAfter} secunde.`,
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}
