jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/en/projects"),
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock("next-themes", () => ({
  useTheme: () => ({
    setTheme: jest.fn(),
    theme: "light",
    resolvedTheme: "light",
  }),
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";

const mockUsePathname = usePathname as jest.Mock;

describe("Navbar — locale links", () => {
  it("renders zh-TW links", () => {
    mockUsePathname.mockReturnValue("/zh-TW/projects");
    render(<Navbar lang="zh-TW" isScrolled={false} />);
    expect(screen.getByRole("link", { name: "專案" })).toHaveAttribute(
      "href",
      "/zh-TW/projects"
    );
    expect(screen.getByRole("link", { name: "關於" })).toHaveAttribute(
      "href",
      "/zh-TW/about"
    );
  });

  it("renders en links", () => {
    mockUsePathname.mockReturnValue("/en");
    render(<Navbar lang="en" isScrolled={false} />);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/en/projects"
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/en/about"
    );
  });

  it("renders ja links", () => {
    mockUsePathname.mockReturnValue("/ja");
    render(<Navbar lang="ja" isScrolled={false} />);
    expect(screen.getByRole("link", { name: "プロジェクト" })).toHaveAttribute(
      "href",
      "/ja/projects"
    );
    expect(screen.getByRole("link", { name: "私について" })).toHaveAttribute(
      "href",
      "/ja/about"
    );
  });
});

describe("Navbar — scroll-aware backdrop", () => {
  beforeEach(() => mockUsePathname.mockReturnValue("/en"));

  it("applies backdrop classes when isScrolled is true", () => {
    const { container } = render(<Navbar lang="en" isScrolled={true} />);
    const nav = container.querySelector("nav");
    expect(nav?.className).toMatch(/bg-background\/60/);
    expect(nav?.className).toMatch(/backdrop-blur-sm/);
    expect(nav?.className).toMatch(/shadow-xl/);
  });

  it("no backdrop classes when isScrolled is false", () => {
    const { container } = render(<Navbar lang="en" isScrolled={false} />);
    const nav = container.querySelector("nav");
    expect(nav?.className).not.toMatch(/bg-background\/60/);
    expect(nav?.className).not.toMatch(/shadow-xl/);
  });
});

describe("Navbar — active link detection", () => {
  it("marks exact route as active", () => {
    mockUsePathname.mockReturnValue("/en/projects");
    render(<Navbar lang="en" isScrolled={false} />);
    const link = screen.getByRole("link", { name: "Projects" });
    expect(link.dataset.active).toBe("true");
  });

  it("marks sub-route as active", () => {
    mockUsePathname.mockReturnValue("/en/projects/my-project");
    render(<Navbar lang="en" isScrolled={false} />);
    const link = screen.getByRole("link", { name: "Projects" });
    expect(link.dataset.active).toBe("true");
  });

  it("does not cross-activate links", () => {
    mockUsePathname.mockReturnValue("/en/about");
    render(<Navbar lang="en" isScrolled={false} />);
    const link = screen.getByRole("link", { name: "Projects" });
    expect(link.dataset.active).not.toBe("true");
  });

  it("no link active when on root lang path", () => {
    mockUsePathname.mockReturnValue("/en");
    render(<Navbar lang="en" isScrolled={false} />);
    const projects = screen.getByRole("link", { name: "Projects" });
    const about = screen.getByRole("link", { name: "About" });
    expect(projects.dataset.active).not.toBe("true");
    expect(about.dataset.active).not.toBe("true");
  });
});

describe("Navbar — CSS anchor positioning indicator", () => {
  it("each desktop link has an anchor-name style", () => {
    mockUsePathname.mockReturnValue("/en");
    const { container } = render(<Navbar lang="en" isScrolled={false} />);
    const desktopLinks = container.querySelectorAll("[style*='--nav-link-']");
    expect(desktopLinks.length).toBeGreaterThanOrEqual(2);
  });

  it("renders the indicator span inside the desktop link row", () => {
    mockUsePathname.mockReturnValue("/en/projects");
    const { container } = render(<Navbar lang="en" isScrolled={false} />);
    const indicator = container.querySelector("[data-indicator]");
    expect(indicator).toBeInTheDocument();
  });
});
