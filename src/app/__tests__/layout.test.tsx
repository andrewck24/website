jest.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-inter", subsets: ["latin"] }),
  Ubuntu_Mono: () => ({
    variable: "--font-ubuntu-mono",
    subsets: ["latin"],
    weight: ["400", "700"],
  }),
}));

jest.mock("@vercel/analytics/next", () => ({
  Analytics: () => null,
}));

import React from "react";
import { render } from "@testing-library/react";
import RootLayout from "../layout";

describe("RootLayout", () => {
  it("renders children", () => {
    const { getByText } = render(RootLayout({ children: <div>content</div> }));
    expect(getByText("content")).toBeInTheDocument();
  });

  it("applies font class variables to html element", () => {
    const element = RootLayout({ children: <div /> });
    expect(element.props.className).toContain("--font-ubuntu-mono");
    expect(element.props.className).toContain("--font-inter");
  });
});
