const requestLogs = new Map();

const WINDOW_SIZE = 1000; // 1 second
const MAX_REQUESTS = 5; // max requests per window

export const slidingWindowLogsMiddleware = (req, res, next) => {
  const now = Date.now();
  const clientIP = req.headers["x-test-ip"] ?? req.ip;

  const logs = requestLogs.get(clientIP) || [];

  const windowStart = now - WINDOW_SIZE;

  // Filter logs to only keep entries within the current window
  const filteredLogs = logs.filter((log) => log >= windowStart);

  if (filteredLogs.length >= MAX_REQUESTS) {
    return res.status(429).send("Rate limit exceeded");
  }

  // Add current timestamp to the logs
  filteredLogs.push(now);

  requestLogs.set(clientIP, filteredLogs);

  next();
};
