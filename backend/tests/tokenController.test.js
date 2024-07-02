import request from "supertest";
import app from "../index.js";

describe("GET /api/tokens/blockchains", () => {
  it("should fetch blockchains", async () => {
    const res = await request(app).get("/api/tokens/blockchains");

    expect(res.statusCode).toEqual(200);
    expect(res.body.supportedChains).toBeInstanceOf(Array);
    expect(res.body.success).toEqual(true);
  });
});

describe("GET /api/tokens?chainId=1", () => {
  it("should fetch tokens", async () => {
    const res = await request(app).get("/api/tokens?chainId=1");

    expect(res.statusCode).toEqual(200);
    expect(res.body.recommendedTokens).toBeInstanceOf(Array);
    expect(res.body.success).toEqual(true);
  });
});

describe("GET /api/tokens", () => {
  it("should not fetch tokens", async () => {
    const res = await request(app).get("/api/tokens");

    expect(res.statusCode).toEqual(500);
  });
});

describe("POST /api/quotes", () => {
  it("should fetch quotes", async () => {
    const payload = {
      dstChainId: 1,
      dstQuoteTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      srcChainId: 1,
      srcQuoteTokenAddress: "0x6985884C4392D348587B19cb9eAAf157F13271cd",
      srcQuoteTokenAmount: "1000000000000000000",
    };

    const res = await request(app).post("/api/quotes").send(payload);
    expect(res.statusCode).toEqual(200);
    expect(res.body.routes).toBeInstanceOf(Array);
    expect(res.body.success).toEqual(true);
  });
});

describe("POST /api/quotes", () => {
  it("should not fetch quotes", async () => {
    const payload = {};

    const res = await request(app).post("/api/quotes").send(payload);
    expect(res.statusCode).toEqual(500);
  });
});
