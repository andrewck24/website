import React from "react";
import { render, screen } from "@testing-library/react";
import { BusinessCard } from "../business-card";

describe("BusinessCard", () => {
  const defaultProps = {
    lang: "zh-TW" as const,
    pdfUrls: { zh: null, en: null },
  };

  it("renders owner name inside the gradient card", () => {
    render(<BusinessCard {...defaultProps} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders job title inside the gradient card", () => {
    render(<BusinessCard {...defaultProps} />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders GitHub, LinkedIn, and Cake social buttons", () => {
    render(<BusinessCard {...defaultProps} />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("https://github.com/andrewck24");
    expect(hrefs).toContain("https://www.linkedin.com/in/andrewck24/");
    expect(hrefs).toContain("https://www.cake.me/me/andrewck24");
  });

  it("does not render PDF trigger when both pdfUrls are null", () => {
    render(<BusinessCard {...defaultProps} pdfUrls={{ zh: null, en: null }} />);
    expect(
      screen.queryByRole("button", { name: /pdf|resume|履歷|download/i })
    ).not.toBeInTheDocument();
  });

  it("renders PDF trigger button when pdfUrls.zh is set", () => {
    render(
      <BusinessCard
        {...defaultProps}
        pdfUrls={{ zh: "https://cdn.sanity.io/files/zh.pdf", en: null }}
      />
    );
    expect(
      screen.getByRole("button", { name: /pdf|resume|履歷|download/i })
    ).toBeInTheDocument();
  });

  it("renders PDF trigger button when pdfUrls.en is set", () => {
    render(
      <BusinessCard
        {...defaultProps}
        pdfUrls={{ zh: null, en: "https://cdn.sanity.io/files/en.pdf" }}
      />
    );
    expect(
      screen.getByRole("button", { name: /pdf|resume|履歷|download/i })
    ).toBeInTheDocument();
  });

  describe("collapsed state CSS structure", () => {
    it("wrapper has data-testid for collapsed CSS selector targeting", () => {
      const { container } = render(<BusinessCard {...defaultProps} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute("data-testid", "about-business-card");
    });

    it("h1 and p are rendered for collapsed display", () => {
      render(<BusinessCard {...defaultProps} />);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });
  });

  describe("sentinel for IntersectionObserver", () => {
    it("renders a sentinel element as the first child of the wrapper", () => {
      const { container } = render(<BusinessCard {...defaultProps} />);
      const wrapper = container.firstChild as HTMLElement;
      const firstChild = wrapper?.firstElementChild;
      expect(firstChild).toHaveAttribute("data-sentinel");
    });

    it("sentinel has zero height", () => {
      const { container } = render(<BusinessCard {...defaultProps} />);
      const sentinel = container.querySelector("[data-sentinel]");
      expect(sentinel?.className).toContain("h-0");
    });
  });
});
