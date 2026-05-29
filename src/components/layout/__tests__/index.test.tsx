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

let observerCallback: IntersectionObserverCallback;
const observeMock = jest.fn();
const disconnectMock = jest.fn();

beforeEach(() => {
  observeMock.mockClear();
  disconnectMock.mockClear();
  global.IntersectionObserver = jest.fn((cb) => {
    observerCallback = cb;
    return { observe: observeMock, disconnect: disconnectMock };
  }) as unknown as typeof IntersectionObserver;
});

describe("NavLayout", () => {
  it("renders sentinel as first child of main", () => {
    render(
      <NavLayout lang="en">
        <div>content</div>
      </NavLayout>
    );
    const main = screen.getByRole("main");
    expect(main.firstElementChild).toHaveAttribute("id", "nav-sentinel");
  });

  it("renders children after sentinel", () => {
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

  it("sets isScrolled true when sentinel leaves viewport", () => {
    render(
      <NavLayout lang="en">
        <div>content</div>
      </NavLayout>
    );
    act(() => {
      observerCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });
    expect(screen.getByTestId("navbar")).toHaveAttribute(
      "data-scrolled",
      "true"
    );
  });

  it("sets isScrolled false when sentinel re-enters viewport", () => {
    render(
      <NavLayout lang="en">
        <div>content</div>
      </NavLayout>
    );
    act(() => {
      observerCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });
    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });
    expect(screen.getByTestId("navbar")).toHaveAttribute(
      "data-scrolled",
      "false"
    );
  });

  it("observes sentinel element on mount", () => {
    render(
      <NavLayout lang="en">
        <div>content</div>
      </NavLayout>
    );
    expect(observeMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: "nav-sentinel" })
    );
  });
});
