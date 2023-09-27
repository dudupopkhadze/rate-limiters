import request from "supertest";
import app from "../src/app.js";

describe("Token Bucket Rate Limiter", () => {
  test("should return 200 for unlimited route", async () => {
    await request(app).get(`/unlimited`).expect(200);
  });
});
