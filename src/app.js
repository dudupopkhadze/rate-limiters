import express from "express";
import { tokenBucketRateLimiterMiddleware } from "./limiters/token-bucket.js";

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

app.get("/unlimited", (req, res) => {
  // Your unlimited route logic
  res.send("Unlimited Access");
});

export default app;
