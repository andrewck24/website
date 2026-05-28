jest.mock("../../lib/locale-from-headers", () => ({
  getLocaleFromHeaders: jest.fn(),
}));

jest.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-inter", subsets: ["latin"] }),
  Ubuntu_Mono: () => ({
    variable: "--font-ubuntu-mono",
    subsets: ["latin"],
    weight: ["400", "700"],
  }),
}));

import React from "react";
import { render } from "@testing-library/react";
import RootLayout from "../layout";
import { getLocaleFromHeaders } from "../../lib/locale-from-headers";

const mockGetLocale = getLocaleFromHeaders as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("RootLayout", () => {
  it("calls getLocaleFromHeaders() to determine lang", async () => {
    mockGetLocale.mockResolvedValue("en");

    render(await RootLayout({ children: <div>content</div> }));

    expect(mockGetLocale).toHaveBeenCalled();
  });

  it("uses locale returned by getLocaleFromHeaders() for html lang attribute", async () => {
    mockGetLocale.mockResolvedValue("ja");

    const element = await RootLayout({ children: <div>content</div> });

    expect(element.props.lang).toBe("ja");
  });
});
