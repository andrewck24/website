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
import { profileData } from "@/lib/data/profile";
import { render, screen } from "@testing-library/react";

describe("ProfileHero", () => {
  describe("Locale-driven content", () => {
    it.each(Object.entries(profileData))(
      "renders %s profile data (title and bio)",
      (locale, profile) => {
        render(<ProfileHero locale={locale} />);

        expect(screen.getByTestId("profile-name")).toHaveTextContent(
          profile.name
        );
        expect(screen.getByTestId("profile-title")).toHaveTextContent(
          profile.title
        );
        expect(screen.getByTestId("profile-bio")).toHaveTextContent(
          profile.bio
        );
      }
    );

    it("falls back to zh-TW profile data for an unsupported locale", () => {
      render(<ProfileHero locale="fr" />);

      expect(screen.getByTestId("profile-title")).toHaveTextContent(
        profileData["zh-TW"].title
      );
    });
  });

  describe("Composition", () => {
    it("renders the CTA buttons and terminal animation alongside the profile", () => {
      render(<ProfileHero locale="zh-TW" />);

      expect(screen.getByTestId("profile-hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("cta-buttons")).toBeInTheDocument();
      expect(screen.getByTestId("terminal-animation")).toBeInTheDocument();
    });
  });
});
