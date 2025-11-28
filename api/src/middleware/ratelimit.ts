import rateLimit from 'express-rate-limit';

// General API rate limit - 200 requests per minute
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limit - 10 attempts per 15 minutes (stricter for security)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 15 * 60
  },
});