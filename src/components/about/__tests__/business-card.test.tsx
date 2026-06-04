import React from "react";
import { render, screen } from "@testing-library/react";
import { BusinessCard } from "../business-card";

describe("BusinessCard", () => {
  const defaultProps = {
    lang: "zh-TW" as const,
    pdfUrls: { tw: null, en: null, ja: null },
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

  it("does not render PDF trigger when all pdfUrls are null", () => {
    render(<BusinessCard {...defaultProps} />);
    expect(
      screen.queryByRole("button", { name: /resume/i })
    ).not.toBeInTheDocument();
  });

  it("renders PDF trigger button when pdfUrls.tw is set", () => {
    render(
      <BusinessCard
        {...defaultProps}
        pdfUrls={{
          tw: "https://cdn.sanity.io/files/tw.pdf",
          en: null,
          ja: null,
        }}
      />
    );
    expect(screen.getByRole("button", { name: /resume/i })).toBeInTheDocument();
  });

  it("renders PDF trigger button when pdfUrls.en is set", () => {
    render(
      <BusinessCard
        {...defaultProps}
        pdfUrls={{
          tw: null,
          en: "https://cdn.sanity.io/files/en.pdf",
          ja: null,
        }}
      />
    );
    expect(screen.getByRole("button", { name: /resume/i })).toBeInTheDocument();
  });

  it("renders PDF trigger button when pdfUrls.ja is set", () => {
    render(
      <BusinessCard
        {...defaultProps}
        pdfUrls={{
          tw: null,
          en: null,
          ja: "https://cdn.sanity.io/files/ja.pdf",
        }}
      />
    );
    expect(screen.getByRole("button", { name: /resume/i })).toBeInTheDocument();
  });

  it("is static: wrapper has no scroll event handlers (no data-collapsed attribute by default)", () => {
    const { container } = render(<BusinessCard {...defaultProps} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toHaveAttribute("data-collapsed");
  });
});
