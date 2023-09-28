import request from "supertest";
import app from "../src/app.js";
import { refillTokensInterval } from "../src/limiters/token-bucket.js";

afterAll(() => {
  clearInterval(refillTokensInterval);
});

test("should return 200 for unlimited route", async () => {
  await request(app).get(`/unlimited`).expect(200);
});

test("should return 200 for limited route < 5 requests", async () => {
  for (let i = 0; i < 5; i++) {
    await request(app).get(`/limitedfwc`).set("x-test-ip", "user1").expect(200);
  }
});

test("should return 200 for limited route < 5 requests multiple users", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 seconds
  for (let i = 0; i < 5; i++) {
    await Promise.all([
      request(app).get(`/limitedfwc`).set("x-test-ip", "user1").expect(200),
      request(app).get(`/limitedfwc`).set("x-test-ip", "user2").expect(200),
    ]);
  }
}, 10000);

test("should return 409 when bucket is full", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 seconds
  for (let i = 0; i < 5; i++) {
    await Promise.all([
      request(app).get(`/limitedfwc`).set("x-test-ip", "user1").expect(200),
      request(app).get(`/limitedfwc`).set("x-test-ip", "user2").expect(200),
    ]);
  }

  // wait for 1 seconds
  await new Promise((resolve) => setTimeout(resolve, 1000));
  for (let i = 0; i < 5; i++) {
    await Promise.all([
      request(app).get(`/limitedfwc`).set("x-test-ip", "user1").expect(200),
      request(app).get(`/limitedfwc`).set("x-test-ip", "user2").expect(200),
    ]);
  }

  await request(app).get(`/limitedfwc`).set("x-test-ip", "user1").expect(429);
  await request(app).get(`/limitedfwc`).set("x-test-ip", "user2").expect(429);
}, 10000);
