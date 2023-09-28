let redisClient = {
  get: () => {},
  set: () => {},
};

export const redisSlidingWindowCounterMiddleware = async (req, res, next) => {
  const now = Date.now();
  const clientIP = req.ip;

  // Fetch counter from Redis
  const counterJSON = await redisClient.get(clientIP);

  let counter;

  if (counterJSON) {
    counter = JSON.parse(counterJSON);
  } else {
    counter = { currentCount: 1, prevCount: 0, currentWindowStart: now };
    redisClient.set(clientIP, JSON.stringify(counter));
    return next();
  }

  const timeElapsed = now - counter.currentWindowStart;

  if (timeElapsed > WINDOW_SIZE) {
    counter.prevCount = counter.currentCount;
    counter.currentCount = 1;
    counter.currentWindowStart = now;
  } else {
    const weight = (WINDOW_SIZE - timeElapsed) / WINDOW_SIZE;
    const weightedCount = counter.currentCount + counter.prevCount * weight;

    if (weightedCount > MAX_REQUESTS) {
      return res.status(429).send("Rate limit exceeded");
    }

    counter.currentCount++;
  }

  // Save updated counter back to Redis
  await redisClient.set(clientIP, JSON.stringify(counter));

  return next();
};
