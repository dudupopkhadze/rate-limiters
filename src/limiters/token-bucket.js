const ipBuckets = {};

class TokenBucket {
  constructor(rate, capacity) {
    this.tokens = capacity;
    this.rate = rate;
    this.lastFilled = Date.now();
  }

  consume() {
    const now = Date.now();
    const timePassed = (now - this.lastFilled) / 1000;

    this.tokens += timePassed * this.rate;
    this.tokens = Math.min(this.tokens, 10);
    this.lastFilled = now;

    if (this.tokens < 1) {
      return false;
    }

    this.tokens -= 1;
    return true;
  }
}

export const tokenBucketRateLimiterMiddleware = (req, res, next) => {
  const ip = req.ip;

  if (!ipBuckets[ip]) {
    ipBuckets[ip] = new TokenBucket(1, 10);
  }

  if (ipBuckets[ip].consume()) {
    next();
  } else {
    res.status(429).send("Too many requests");
  }
};
