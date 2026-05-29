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
    const projectLinks = screen.getAllByRole("link", { name: "專案" });
    expect(projectLinks[0]).toHaveAttribute("href", "/zh-TW/projects");
    const aboutLinks = screen.getAllByRole("link", { name: "關於" });
    expect(aboutLinks[0]).toHaveAttribute("href", "/zh-TW/about");
  });

  it("renders en links", () => {
    mockUsePathname.mockReturnValue("/en");
    render(<Navbar lang="en" isScrolled={false} />);
    const projectLinks = screen.getAllByRole("link", { name: "Projects" });
    expect(projectLinks[0]).toHaveAttribute("href", "/en/projects");
    const aboutLinks = screen.getAllByRole("link", { name: "About" });
    expect(aboutLinks[0]).toHaveAttribute("href", "/en/about");
  });

  it("renders ja links", () => {
    mockUsePathname.mockReturnValue("/ja");
    render(<Navbar lang="ja" isScrolled={false} />);
    const projectLinks = screen.getAllByRole("link", { name: "プロジェクト" });
    expect(projectLinks[0]).toHaveAttribute("href", "/ja/projects");
    const aboutLinks = screen.getAllByRole("link", { name: "私について" });
    expect(aboutLinks[0]).toHaveAttribute("href", "/ja/about");
  });
});

describe("Navbar — scroll-aware backdrop", () => {
  beforeEach(() => mockUsePathname.mockReturnValue("/en"));

  it("applies backdrop classes to floating card when isScrolled is true", () => {
    const { container } = render(<Navbar lang="en" isScrolled={true} />);
    // Background lives on the inner card div, not the outer <nav>
    const card = container.querySelector("nav > div > div");
    expect(card?.className).toMatch(/bg-background\/60/);
    expect(card?.className).toMatch(/backdrop-blur-sm/);
    expect(card?.className).toMatch(/shadow-xl/);
  });

  it("no backdrop classes on card when isScrolled is false", () => {
    const { container } = render(<Navbar lang="en" isScrolled={false} />);
    const card = container.querySelector("nav > div > div");
    expect(card?.className).not.toMatch(/bg-background\/60/);
    expect(card?.className).not.toMatch(/shadow-xl/);
  });
});

describe("Navbar — active link detection", () => {
  it("marks exact route as active", () => {
    mockUsePathname.mockReturnValue("/en/projects");
    render(<Navbar lang="en" isScrolled={false} />);
    const links = screen.getAllByRole("link", { name: "Projects" });
    expect(links[0].dataset.active).toBe("true");
  });

  it("marks sub-route as active", () => {
    mockUsePathname.mockReturnValue("/en/projects/my-project");
    render(<Navbar lang="en" isScrolled={false} />);
    const links = screen.getAllByRole("link", { name: "Projects" });
    expect(links[0].dataset.active).toBe("true");
  });

  it("does not cross-activate links", () => {
    mockUsePathname.mockReturnValue("/en/about");
    render(<Navbar lang="en" isScrolled={false} />);
    const links = screen.getAllByRole("link", { name: "Projects" });
    expect(links[0].dataset.active).not.toBe("true");
  });

  it("no link active when on root lang path", () => {
    mockUsePathname.mockReturnValue("/en");
    render(<Navbar lang="en" isScrolled={false} />);
    const projects = screen.getAllByRole("link", { name: "Projects" });
    const about = screen.getAllByRole("link", { name: "About" });
    expect(projects[0].dataset.active).not.toBe("true");
    expect(about[0].dataset.active).not.toBe("true");
  });
});

describe("Navbar — mobile menu", () => {
  it("renders a toggle button for mobile menu", () => {
    mockUsePathname.mockReturnValue("/en");
    render(<Navbar lang="en" isScrolled={false} />);
    expect(
      screen.getByRole("button", { name: /toggle menu/i })
    ).toBeInTheDocument();
  });

  it("mobile menu contains locale nav links", () => {
    mockUsePathname.mockReturnValue("/zh-TW");
    render(<Navbar lang="zh-TW" isScrolled={false} />);
    const links = screen.getAllByRole("link", { name: "專案" });
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it("closes menu on route change", () => {
    mockUsePathname.mockReturnValue("/en");
    const { rerender } = render(<Navbar lang="en" isScrolled={false} />);
    const trigger = screen.getByRole("button", { name: /toggle menu/i });
    // menu starts closed
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    mockUsePathname.mockReturnValue("/en/about");
    rerender(<Navbar lang="en" isScrolled={false} />);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
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
