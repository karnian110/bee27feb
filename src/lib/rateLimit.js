// Simple in-memory rate limiter for API routes
// For production, consider using Redis or similar

const rateLimitMap = new Map();

const RATE_LIMITS = {
  // Login attempts: 5 per minute per IP
  login: { windowMs: 60 * 1000, maxRequests: 5 },
  // User creation: 10 per minute per IP
  createUser: { windowMs: 60 * 1000, maxRequests: 10 },
  // User search: 30 per minute per IP
  search: { windowMs: 60 * 1000, maxRequests: 30 },
  // General API: 100 per minute per IP
  default: { windowMs: 60 * 1000, maxRequests: 100 },
};

function getClientIP(request) {
  // Get IP from various headers (works with most hosting providers)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  
  // Fallback to a default (in production, you might want to handle this differently)
  return "unknown";
}

export function checkRateLimit(request, type = "default") {
  const ip = getClientIP(request);
  const key = `${ip}:${type}`;
  const now = Date.now();
  const limit = RATE_LIMITS[type] || RATE_LIMITS.default;
  
  // Clean up old entries
  for (const [mapKey, data] of rateLimitMap.entries()) {
    if (now - data.resetTime > limit.windowMs) {
      rateLimitMap.delete(mapKey);
    }
  }
  
  // Get or create rate limit entry
  let rateData = rateLimitMap.get(key);
  if (!rateData || now > rateData.resetTime) {
    rateData = {
      count: 0,
      resetTime: now + limit.windowMs,
    };
    rateLimitMap.set(key, rateData);
  }
  
  // Check if limit exceeded
  if (rateData.count >= limit.maxRequests) {
    const retryAfter = Math.ceil((rateData.resetTime - now) / 1000);
    return {
      success: false,
      limit: limit.maxRequests,
      remaining: 0,
      retryAfter,
    };
  }
  
  // Increment count
  rateData.count++;
  
  return {
    success: true,
    limit: limit.maxRequests,
    remaining: limit.maxRequests - rateData.count,
    resetTime: rateData.resetTime,
  };
}

export function createRateLimitResponse(result) {
  return new Response(
    JSON.stringify({
      error: "Too many requests",
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Retry-After": String(result.retryAfter),
      },
    }
  );
}
