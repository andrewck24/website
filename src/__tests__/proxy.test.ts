// Mock next/server so proxy.ts loads in Jest (jsdom) environment
jest.mock("next/server", () => ({
  NextResponse: {
    next: jest.fn(() => ({ headers: { set: jest.fn() } })),
    redirect: jest.fn(),
  },
}));

import { config } from "../proxy";

const matcherPattern = config.matcher[0];
// Build a regex from the Next.js path matcher string (e.g. "/((?!...).*)")
const regex = new RegExp(`^${matcherPattern}$`);

describe("proxy config.matcher", () => {
  it("does NOT match /robots.txt", () => {
    expect(regex.test("/robots.txt")).toBe(false);
  });

  it("does NOT match /sitemap.xml", () => {
    expect(regex.test("/sitemap.xml")).toBe(false);
  });

  it("DOES match /about", () => {
    expect(regex.test("/about")).toBe(true);
  });
});
