/**
 * Simple in-memory rate limiter for API endpoints
 * Note: For production, use Redis-based solution for distributed systems
 */

interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key)
        }
    }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
    maxRequests: number     // Maximum requests allowed
    windowMs: number        // Time window in milliseconds
}

export interface RateLimitResult {
    allowed: boolean
    remaining: number
    resetTime: number
}

/**
 * Check rate limit for a given identifier (IP, userId, etc.)
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    const now = Date.now()
    const key = identifier
    const entry = rateLimitStore.get(key)

    // If no entry or window expired, create new entry
    if (!entry || now > entry.resetTime) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + config.windowMs
        })
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetTime: now + config.windowMs
        }
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: entry.resetTime
        }
    }

    // Increment count
    entry.count++
    rateLimitStore.set(key, entry)

    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime
    }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }

    const realIP = request.headers.get('x-real-ip')
    if (realIP) {
        return realIP
    }

    return 'unknown'
}

// Preset configurations for common use cases
export const RATE_LIMITS = {
    // Upload: 10 images per minute per user
    UPLOAD: { maxRequests: 10, windowMs: 60 * 1000 },

    // Auth: 5 attempts per 15 minutes per IP
    AUTH: { maxRequests: 5, windowMs: 15 * 60 * 1000 },

    // API general: 100 requests per minute per IP
    API_GENERAL: { maxRequests: 100, windowMs: 60 * 1000 },

    // Password reset: 3 attempts per hour per IP
    PASSWORD_RESET: { maxRequests: 3, windowMs: 60 * 60 * 1000 },
}
