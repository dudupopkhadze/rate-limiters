const rateLimitsInfo = new Map();

const WINDOW_SIZE = 1000; // 1 second
const MAX_REQUESTS = 5; // max requests per window

export const fixedWindowCounterMiddleware = (req, res, next) => {
  const now = Date.now();
  const clientIP = req.headers["x-test-ip"] ?? req.ip;

  const limitInfo = rateLimitsInfo.get(clientIP);

  if (!limitInfo) {
    rateLimitsInfo.set(clientIP, { count: 1, windowStart: now });
    return next();
  }

  const timeElapsed = now - limitInfo.windowStart;

  if (timeElapsed > WINDOW_SIZE) {
    rateLimitsInfo.set(clientIP, { count: 1, windowStart: now });
    return next();
  }

  limitInfo.count++;

  if (limitInfo.count > MAX_REQUESTS) {
    return res.status(429).json({ message: "Rate limit exceeded" });
  }

  next();
};
