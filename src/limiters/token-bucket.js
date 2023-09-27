const ipBuckets = new Map();

// refill tokens every second
export const refillTokensInterval = setInterval(() => {
  [...ipBuckets.values()].forEach((bucket) => bucket.refill());
}, 1000);
class TokenBucket {
  constructor() {
    this.tokens = 10;
    this.lastFilled = Date.now();
  }

  refill() {
    if (this.tokens === 10) return;
    const now = Date.now();
    const timePassed = (now - this.lastFilled) / 1000;
    if (timePassed >= 1) {
      this.tokens = Math.min(this.tokens + 1, 10);
      this.lastFilled = now;
    }
  }

  consume() {
    if (this.tokens < 1) {
      return false;
    }
    this.tokens -= 1;
    return true;
  }
}

export const tokenBucketRateLimiterMiddleware = (req, res, next) => {
  const ip = req.headers["x-test-ip"] ?? req.ip;

  if (!ipBuckets.get(ip)) {
    ipBuckets.set(ip, new TokenBucket(1, 10));
  }

  if (ipBuckets.get(ip).consume()) {
    next();
  } else {
    res.status(429).send("Too many requests");
  }
};
