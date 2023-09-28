import express from "express";
import { tokenBucketRateLimiterMiddleware } from "./limiters/token-bucket.js";
import { fixedWindowCounterMiddleware } from "./limiters/fixed-window-counter.js";
import { slidingWindowLogsMiddleware } from "./limiters/sliding-window-log.js";
import { slidingWindowCounterMiddleware } from "./limiters/sliding-window-counter.js";

const app = express();

app.get("/limited", (req, res) => {
  // Your limited route logic
  res.send("Limited Access");
});

// limited with token bucket
app.get("/limitedtb", tokenBucketRateLimiterMiddleware, (req, res) => {
  // Your limited route logic
  res.send("Limited Access");
});

// limited with fixed window counter
app.get("/limitedfwc", fixedWindowCounterMiddleware, (req, res) => {
  // Your limited route logic
  res.send("Limited Access");
});

// limited with sliding window log
app.get("/limitedswl", slidingWindowLogsMiddleware, (req, res) => {
  // Your limited route logic
  res.send("Limited Access");
});

// limited with sliding window counter
app.get("/limitedswc", slidingWindowCounterMiddleware, (req, res) => {
  // Your limited route logic
  res.send("Limited Access");
});

app.get("/unlimited", (req, res) => {
  // Your unlimited route logic
  res.send("Unlimited Access");
});

export default app;
