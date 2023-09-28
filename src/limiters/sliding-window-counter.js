const WINDOW_SIZE = 1000; // 1 second
const MAX_REQUESTS = 5; // max requests per window
const counters = new Map();

export const slidingWindowCounterMiddleware = (req, res, next) => {
  const now = Date.now();
  const clientIP = req.headers["x-test-ip"] ?? req.ip;

  let counter = counters.get(clientIP);

  if (!counter) {
    counter = {
      currentCount: 1,
      prevCount: 0,
      currentWindowStart: now,
    };
    counters.set(clientIP, counter);
    return next();
  }

  const timeElapsed = now - counter.currentWindowStart;

  if (timeElapsed > WINDOW_SIZE) {
    counter.prevCount = counter.currentCount;
    counter.currentCount = 1;
    counter.currentWindowStart = now;
    return next();
  }

  const weight = (WINDOW_SIZE - timeElapsed) / WINDOW_SIZE;
  const weightedCount = counter.currentCount + counter.prevCount * weight;

  if (weightedCount > MAX_REQUESTS) {
    return res.status(429).send("Rate limit exceeded");
  }

  counter.currentCount++;
  next();
};
