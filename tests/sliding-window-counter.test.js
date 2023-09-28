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
    await request(app).get(`/limitedswc`).set("x-test-ip", "user1").expect(200);
  }
});

test("should return 409 when bucket is full", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 seconds
  for (let i = 0; i < 5; i++) {
    await request(app).get(`/limitedswc`).set("x-test-ip", "user2").expect(200);
  }

  await request(app).get(`/limitedswc`).set("x-test-ip", "user1").expect(200);
  await request(app).get(`/limitedswc`).set("x-test-ip", "user2").expect(200);
  await request(app).get(`/limitedswc`).set("x-test-ip", "user1").expect(429);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 seconds
  await request(app).get(`/limitedswc`).set("x-test-ip", "user1").expect(200);

  await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 seconds
  for (let i = 0; i < 5; i++) {
    await request(app).get(`/limitedswc`).set("x-test-ip", "user1").expect(200);
  }
  await request(app).get(`/limitedswc`).set("x-test-ip", "user1").expect(429);
  await request(app).get(`/limitedswc`).set("x-test-ip", "user2").expect(200);
}, 10000);
