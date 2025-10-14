import rateLimit from "express-rate-limit";

/**
 * Dynamic Rate Limiter Middleware
 * @param {Object} options - Configuration options
 * @param {number} options.windowMs - Time window in milliseconds (default 15 mins)
 * @param {number} options.max - Max requests allowed in window (default 100)
 * @param {string} options.message - Custom message when limit is exceeded
 * @param {Function} options.keyGenerator - Optional custom key (like email)
 * @returns {Function} Express middleware
 */
export const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    message = "Too many requests, please try again later.",
    keyGenerator,
  } = options;

  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
    },
    keyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
  });
};
