import { CtaButtons } from "@/components/home/cta-buttons";
import type { SocialLinks } from "@/types/profile";
import { render, screen } from "@testing-library/react";

const fullSocial: SocialLinks = {
  github: "https://github.com/andrewck24",
  linkedin: "https://www.linkedin.com/in/li-wei-tseng-andrew/",
  email: "andrewck24@gmail.com",
};

describe("CtaButtons", () => {
  describe("Localization & Routing Behavior", () => {
    it("renders zh-TW labels and locale-prefixed hrefs", () => {
      render(<CtaButtons locale="zh-TW" social={fullSocial} />);

      const portfolioLink = screen.getByRole("link", { name: "檢視作品集" });
      const aboutLink = screen.getByRole("link", { name: "關於我" });

      expect(portfolioLink).toHaveAttribute("href", "/zh-TW/projects");
      expect(aboutLink).toHaveAttribute("href", "/zh-TW/about");
    });

    it("renders ja labels and locale-prefixed hrefs", () => {
      render(<CtaButtons locale="ja" social={fullSocial} />);

      const portfolioLink = screen.getByRole("link", {
        name: "ポートフォリオを見る",
      });
      const aboutLink = screen.getByRole("link", { name: "私について" });

      expect(portfolioLink).toHaveAttribute("href", "/ja/projects");
      expect(aboutLink).toHaveAttribute("href", "/ja/about");
    });

    it("falls back to English labels for an unrecognized locale", () => {
      render(<CtaButtons locale="en" social={fullSocial} />);

      const portfolioLink = screen.getByRole("link", {
        name: "View Portfolio",
      });
      const aboutLink = screen.getByRole("link", { name: "About Me" });

      expect(portfolioLink).toHaveAttribute("href", "/en/projects");
      expect(aboutLink).toHaveAttribute("href", "/en/about");
    });
  });

  describe("Social Links Conditional Rendering", () => {
    it("renders both social links as safe external links when provided", () => {
      render(<CtaButtons locale="zh-TW" social={fullSocial} />);

      const githubLink = screen.getByRole("link", { name: "GitHub" });
      const linkedinLink = screen.getByRole("link", { name: "LinkedIn" });

      expect(githubLink).toHaveAttribute("href", fullSocial.github);
      expect(linkedinLink).toHaveAttribute("href", fullSocial.linkedin);

      for (const link of [githubLink, linkedinLink]) {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    });

    it("omits the LinkedIn link when its URL is missing", () => {
      render(
        <CtaButtons
          locale="zh-TW"
          social={{ github: fullSocial.github, email: fullSocial.email }}
        />
      );

      expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "LinkedIn" })
      ).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases / Robustness", () => {
    it("renders only the primary buttons when social fields are missing", () => {
      render(
        <CtaButtons locale="zh-TW" social={{} as unknown as SocialLinks} />
      );

      expect(
        screen.getByRole("link", { name: "檢視作品集" })
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "關於我" })).toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "GitHub" })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "LinkedIn" })
      ).not.toBeInTheDocument();
    });
  });
});
