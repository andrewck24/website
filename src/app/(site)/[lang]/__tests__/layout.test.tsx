jest.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-inter", subsets: ["latin"] }),
}));

jest.mock("../../../../components/lang-setter", () => ({
  LangSetter: () => null,
}));

jest.mock("../../../../components/layout", () => ({
  NavLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import React from "react";
import { render } from "@testing-library/react";
import { generateMetadata } from "../layout";
import Layout from "../layout";

describe("generateMetadata hreflang", () => {
  it("returns canonical link for zh-TW", async () => {
    const result = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW" }),
    });
    expect((result.alternates as { canonical?: string })?.canonical).toBe(
      "/zh-TW"
    );
  });

  it("returns canonical link for en", async () => {
    const result = await generateMetadata({
      params: Promise.resolve({ lang: "en" }),
    });
    expect((result.alternates as { canonical?: string })?.canonical).toBe(
      "/en"
    );
  });

  it("returns hreflang for all three locales and x-default", async () => {
    const result = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW" }),
    });
    const languages = (
      result.alternates as {
        languages?: Record<string, string>;
      }
    )?.languages;
    expect(languages?.["zh-TW"]).toBe("/zh-TW");
    expect(languages?.["en"]).toBe("/en");
    expect(languages?.["ja"]).toBe("/ja");
    expect(languages?.["x-default"]).toBe("/zh-TW");
  });
});

describe("Layout JSON-LD", () => {
  it("renders a script tag with application/ld+json type", async () => {
    const { container } = render(
      await Layout({
        children: <div />,
        params: Promise.resolve({ lang: "zh-TW" }),
      })
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]'
    );
    expect(script).not.toBeNull();
  });

  it("JSON-LD contains Person and WebSite types", async () => {
    const { container } = render(
      await Layout({
        children: <div />,
        params: Promise.resolve({ lang: "zh-TW" }),
      })
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]'
    );
    const content = script?.innerHTML ?? "";
    expect(content).toContain('"@type":"Person"');
    expect(content).toContain('"@type":"WebSite"');
  });
});
