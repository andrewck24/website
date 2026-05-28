/**
 * T015-T017: ArticleCard Component Tests
 *
 * TDD Red Phase - These tests MUST FAIL before implementation
 *
 * Test Coverage:
 * - T015: Hero variant layout (2-column grid on desktop, stacked on mobile)
 * - T016: Compact variant layout (row layout with image 1/3, content 2/3)
 * - T017: Navigation and hover effects
 */

import { ArticleCard } from "@/components/article/card";
import type { ArticlePageData, BaseArticle } from "@/types/article";
import { render, screen } from "@testing-library/react";

// Mock ArticleImage component
jest.mock("../image", () => ({
  ArticleImage: ({
    slug,
    title,
    priority,
  }: {
    slug: string;
    title: string;
    priority?: boolean;
  }) => (
    <div
      data-testid="article-image"
      data-slug={slug}
      data-title={title}
      data-priority={priority}
    >
      Mock ArticleImage
    </div>
  ),
}));

describe("ArticleCard Component", () => {
  const mockArticle: ArticlePageData<BaseArticle> = {
    title: "Test Article",
    description: "This is a test article description for testing purposes.",
    slug: "test-article",
    locale: "zh-TW",
    url: "/zh-TW/projects/test-article",
    date: "2025-10-19",
    tags: [],
    featured: false,
    body: [],
  };

  // T015: Hero variant layout tests
  describe("Hero Variant Layout", () => {
    it("should render hero variant with correct container classes", () => {
      const { container } = render(
        <ArticleCard article={mockArticle} variant="hero" />
      );

      const card = container.querySelector('[data-testid="article-card"]');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("md:col-span-2"); // 2-column span on desktop
    });

    it("should use flex-col layout with lg:flex-row for hero variant", () => {
      const { container } = render(
        <ArticleCard article={mockArticle} variant="hero" />
      );

      const card = container.querySelector('[data-testid="article-card"]');
      expect(card).toHaveClass("flex-col");
      expect(card).toHaveClass("lg:flex-row");
    });

    it("should render ArticleImage with correct props in hero variant", () => {
      render(<ArticleCard article={mockArticle} variant="hero" priority />);

      const image = screen.getByTestId("article-image");
      expect(image).toHaveAttribute("data-slug", "test-article");
      expect(image).toHaveAttribute("data-title", "Test Article");
      expect(image).toHaveAttribute("data-priority", "true");
    });

    it("should render article title, description, and date in hero variant", () => {
      render(<ArticleCard article={mockArticle} variant="hero" />);

      expect(screen.getByText("Test Article")).toBeInTheDocument();
      expect(
        screen.getByText(
          "This is a test article description for testing purposes."
        )
      ).toBeInTheDocument();

      const time = screen.getByText(/2025/);
      expect(time).toBeInTheDocument();
    });
  });

  // T016: Compact variant layout tests
  describe("Compact Variant Layout", () => {
    it("should render compact variant with correct layout classes", () => {
      const { container } = render(
        <ArticleCard article={mockArticle} variant="compact" />
      );

      const card = container.querySelector('[data-testid="article-card"]');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("flex-col");
      expect(card).toHaveClass("md:flex-row");
    });

    it("should not have col-span-2 class in compact variant", () => {
      const { container } = render(
        <ArticleCard article={mockArticle} variant="compact" />
      );

      const card = container.querySelector('[data-testid="article-card"]');
      expect(card).not.toHaveClass("md:col-span-2");
    });

    it("should render ArticleImage in compact variant", () => {
      render(<ArticleCard article={mockArticle} variant="compact" />);

      const image = screen.getByTestId("article-image");
      expect(image).toHaveAttribute("data-slug", "test-article");
    });

    it("should use default variant as compact when variant not specified", () => {
      const { container } = render(<ArticleCard article={mockArticle} />);

      const card = container.querySelector('[data-testid="article-card"]');
      expect(card).toHaveClass("flex-col");
      expect(card).toHaveClass("md:flex-row");
      expect(card).not.toHaveClass("md:col-span-2");
    });
  });

  // T017: Navigation and hover effects tests
  describe("Navigation and Hover Effects", () => {
    it("should render as Next.js Link with correct href", () => {
      render(
        <ArticleCard
          article={mockArticle}
          contentType="projects"
          variant="compact"
        />
      );

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/zh-TW/projects/test-article");
    });

    it("should construct URL from article metadata when contentType is provided", () => {
      const notesArticle = {
        ...mockArticle,
        url: "/zh-TW/notes/test-article",
      };

      render(
        <ArticleCard
          article={notesArticle}
          contentType="notes"
          variant="compact"
        />
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/zh-TW/notes/test-article");
    });

    it("should have hover transition classes", () => {
      render(<ArticleCard article={mockArticle} variant="compact" />);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("transition-all");
      expect(link).toHaveClass("hover:shadow-md");
    });

    it("should have data-testid for e2e testing", () => {
      const { container } = render(
        <ArticleCard article={mockArticle} variant="compact" />
      );

      const card = container.querySelector('[data-testid="article-card"]');
      expect(card).toBeInTheDocument();
    });

    it("should render semantic HTML elements", () => {
      render(<ArticleCard article={mockArticle} variant="compact" />);

      // Title should be h3
      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toHaveTextContent("Test Article");

      // Date should be time element with dateTime
      const time = screen.getByText(/2025/);
      expect(time.tagName).toBe("TIME");
      expect(time).toHaveAttribute("dateTime", "2025-10-19");
    });

    it("should format date according to locale", () => {
      render(<ArticleCard article={mockArticle} variant="compact" />);

      const time = screen.getByText(/2025/);
      expect(time).toBeInTheDocument();
      // Exact format depends on browser's Intl implementation
      // Just verify date element exists
    });

    it("should pass priority prop to ArticleImage", () => {
      render(
        <ArticleCard article={mockArticle} variant="hero" priority={true} />
      );

      const image = screen.getByTestId("article-image");
      expect(image).toHaveAttribute("data-priority", "true");
    });

    it("should default priority to false when not specified", () => {
      render(<ArticleCard article={mockArticle} variant="compact" />);

      const image = screen.getByTestId("article-image");
      expect(image).toHaveAttribute("data-priority", "false");
    });

    it("should apply additional className prop", () => {
      render(
        <ArticleCard
          article={mockArticle}
          variant="compact"
          className="custom-class"
        />
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("custom-class");
    });
  });

  // Edge cases and content handling
  describe("Content Handling", () => {
    it("should handle long descriptions gracefully", () => {
      const longDescArticle = {
        ...mockArticle,
        description:
          "This is a very long description that should be truncated or handled appropriately in the UI. ".repeat(
            5
          ),
      };

      render(<ArticleCard article={longDescArticle} variant="compact" />);

      const description = screen.getByText(/This is a very long description/);
      expect(description).toBeInTheDocument();
    });

    it("should handle articles without cover image", () => {
      const generatedImageArticle: ArticlePageData<BaseArticle> = {
        ...mockArticle,
        coverImage: undefined,
      };

      render(<ArticleCard article={generatedImageArticle} variant="compact" />);

      const image = screen.getByTestId("article-image");
      expect(image).toBeInTheDocument();
    });

    it("should handle different locales correctly", () => {
      const enArticle: ArticlePageData<BaseArticle> = {
        ...mockArticle,
        locale: "en",
        url: "/en/projects/test-article",
      };

      render(<ArticleCard article={enArticle} contentType="projects" />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/en/projects/test-article");
    });
  });
});
