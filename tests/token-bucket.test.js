import request from "supertest";
import app from "../src/app.js";
import { refillTokensInterval } from "../src/limiters/token-bucket.js";

afterAll(() => {
  clearInterval(refillTokensInterval);
});

test("should return 200 for unlimited route", async () => {
  await request(app).get(`/unlimited`).expect(200);
});

test("should return 200 for limited route < 10 requests", async () => {
  for (let i = 0; i < 10; i++) {
    await request(app).get(`/limitedtb`).set("x-test-ip", "user1").expect(200);
  }
});

test("should return 200 for limited route < 10 requests multiple users", async () => {
  await new Promise((resolve) => setTimeout(resolve, 3 * 1000)); // wait for 3 seconds to refill tokens
  for (let i = 0; i < 2; i++) {
    await Promise.all([
      request(app).get(`/limitedtb`).set("x-test-ip", "user1").expect(200),
      request(app).get(`/limitedtb`).set("x-test-ip", "user2").expect(200),
    ]);
  }
}, 10000);

test("should return 409 when bucket is full", async () => {
  for (let i = 0; i < 2; i++) {
    await Promise.all([
      request(app).get(`/limitedtb`).set("x-test-ip", "user1").expect(429),
      request(app).get(`/limitedtb`).set("x-test-ip", "user2").expect(200),
    ]);
  }
}, 10000);
