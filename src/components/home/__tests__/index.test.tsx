// Mock the data dependencies BEFORE imports
jest.mock("../../../lib/data/profile", () => ({
  profileData: {
    "zh-TW": {
      name: "Andrew Tseng",
      title: "軟體工程師",
      bio: "專精於 React 和 Node.js 的全端開發，致力於打造高品質的使用者體驗。",
      location: "台灣 台北",
    },
    en: {
      name: "Andrew Tseng",
      title: "Software Engineer",
      bio: "Specialized in React and Node.js development, dedicated to creating high-quality user experiences.",
      location: "Taipei, Taiwan",
    },
    ja: {
      name: "Andrew Tseng",
      title: "ソフトウェアエンジニア",
      bio: "React と Node.js を専門とするソフトウェアエンジニア。高品質なユーザーエクスペリエンスの創造に取り組んでいます。",
      location: "台湾 台北",
    },
  },
}));

jest.mock("../../../lib/data/social-links", () => ({
  socialLinks: {
    github: "https://github.com/andrewck24",
    linkedin: "https://www.linkedin.com/in/li-wei-tseng-andrew/",
    email: "andrewck24@gmail.com",
  },
}));

// Mock TerminalAnimation component
jest.mock("../terminal-animation", () => ({
  TerminalAnimation: () => (
    <div data-testid="terminal-animation">Terminal Animation Mock</div>
  ),
}));

import { ProfileHero } from "@/components/home";
import { render, screen } from "@testing-library/react";

describe("ProfileHero", () => {
  describe("zh-TW locale", () => {
    it("renders profile information correctly", () => {
      render(<ProfileHero locale="zh-TW" />);

      expect(screen.getByTestId("profile-hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("profile-name")).toHaveTextContent(
        "Andrew Tseng"
      );
      expect(screen.getByTestId("profile-title")).toHaveTextContent(
        "軟體工程師"
      );
      expect(screen.getByTestId("profile-bio")).toHaveTextContent(
        "專精於 React 和 Node.js 的全端開發，致力於打造高品質的使用者體驗。"
      );
    });

    it("renders CTA buttons section", () => {
      render(<ProfileHero locale="zh-TW" />);
      expect(screen.getByTestId("cta-buttons")).toBeInTheDocument();
    });
  });

  describe("en locale", () => {
    it("renders English profile information correctly", () => {
      render(<ProfileHero locale="en" />);

      expect(screen.getByTestId("profile-name")).toHaveTextContent(
        "Andrew Tseng"
      );
      expect(screen.getByTestId("profile-title")).toHaveTextContent(
        "Software Engineer"
      );
      expect(screen.getByTestId("profile-bio")).toHaveTextContent(
        "Specialized in React and Node.js development, dedicated to creating high-quality user experiences."
      );
    });
  });

  describe("ja locale", () => {
    it("renders Japanese profile information correctly", () => {
      render(<ProfileHero locale="ja" />);

      expect(screen.getByTestId("profile-name")).toHaveTextContent(
        "Andrew Tseng"
      );
      expect(screen.getByTestId("profile-title")).toHaveTextContent(
        "ソフトウェアエンジニア"
      );
      expect(screen.getByTestId("profile-bio")).toHaveTextContent(
        "React と Node.js を専門とするソフトウェアエンジニア。高品質なユーザーエクスペリエンスの創造に取り組んでいます。"
      );
    });
  });

  describe("fallback locale", () => {
    it("falls back to zh-TW when locale is not supported", () => {
      render(<ProfileHero locale="fr" />);

      expect(screen.getByTestId("profile-title")).toHaveTextContent(
        "軟體工程師"
      );
    });
  });

  describe("responsive layout", () => {
    it("applies correct CSS classes for responsive layout", () => {
      render(<ProfileHero locale="zh-TW" />);

      const heroSection = screen.getByTestId("profile-hero-section");
      expect(heroSection).toHaveClass("my-auto", "size-full");
      expect(heroSection).toHaveClass("px-4", "pb-(--navbar-scroll-offset)");
    });
  });
});
