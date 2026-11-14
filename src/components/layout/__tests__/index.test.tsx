jest.mock("../navbar", () => ({
  Navbar: ({ isScrolled, lang }: { lang: string; isScrolled: boolean }) => (
    <nav
      data-testid="navbar"
      data-lang={lang}
      data-scrolled={String(isScrolled)}
    />
  ),
}));

import React from "react";
import { render, screen, act } from "@testing-library/react";
import { NavLayout } from "@/components/layout";

function setScrollY(scrollY: number) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: scrollY,
  });
  window.dispatchEvent(new Event("scroll"));
}

beforeEach(() => {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: 0,
  });
});

describe("NavLayout", () => {
  it("keeps isScrolled false at the 4px threshold", () => {
    render(
      <NavLayout lang="en">
        <div>content</div>
      </NavLayout>
    );
    act(() => setScrollY(4));
    expect(screen.getByTestId("navbar")).toHaveAttribute(
      "data-scrolled",
      "false"
    );
  });

  it("renders children", () => {
    render(
      <NavLayout lang="en">
        <div>content</div>
      </NavLayout>
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("main has no pt- padding", () => {
    render(
      <NavLayout lang="en">
        <div>content</div>
      </NavLayout>
    );
    const main = screen.getByRole("main");
    expect(main.className).not.toMatch(/\bpt-/);
  });

  it("passes lang to Navbar", () => {
    render(
      <NavLayout lang="zh-TW">
        <div>content</div>
      </NavLayout>
    );
    expect(screen.getByTestId("navbar")).toHaveAttribute("data-lang", "zh-TW");
  });

  it("initialises isScrolled as false", () => {
    render(
      <NavLayout lang="en">
        <div>content</div>
      </NavLayout>
    );
    expect(screen.getByTestId("navbar")).toHaveAttribute(
      "data-scrolled",
      "false"
    );
  });

  it("sets isScrolled true when scrollY passes the 4px threshold", () => {
    render(
      <NavLayout lang="en">
        <div>content</div>
      </NavLayout>
    );
    act(() => setScrollY(5));
    expect(screen.getByTestId("navbar")).toHaveAttribute(
      "data-scrolled",
      "true"
    );
  });

  it("sets isScrolled false when returning to the top", () => {
    render(
      <NavLayout lang="en">
        <div>content</div>
      </NavLayout>
    );
    act(() => setScrollY(5));
    act(() => setScrollY(0));
    expect(screen.getByTestId("navbar")).toHaveAttribute(
      "data-scrolled",
      "false"
    );
  });

  it("updates isScrolled when the scroll position changes again", () => {
    render(
      <NavLayout lang="en">
        <div>content</div>
      </NavLayout>
    );
    act(() => setScrollY(10));
    expect(screen.getByTestId("navbar")).toHaveAttribute(
      "data-scrolled",
      "true"
    );
    act(() => setScrollY(3));
    expect(screen.getByTestId("navbar")).toHaveAttribute(
      "data-scrolled",
      "false"
    );
  });
});
