import { Article } from "@/components/article";
import type { ArticlePageData } from "@/types/article";
import { render, screen } from "@testing-library/react";

jest.mock("../../../lib/sanity/image", () => ({
  urlFor: () => ({
    width: () => ({
      height: () => ({
        fit: () => ({ url: () => "https://cdn.sanity.io/test.jpg" }),
      }),
    }),
  }),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/zh-TW/notes/test",
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@portabletext/react", () => ({
  PortableText: () => <div data-testid="portable-text" />,
}));

jest.mock("../../mdx/portable-text", () => ({
  portableTextComponents: {},
}));

const makeArticle = (overrides = {}): ArticlePageData => ({
  title: "Test Article",
  description: "Test description",
  date: "2025-01-01",
  tags: [{ title: "React", slug: "react" }],
  featured: false,
  slug: "test-article",
  locale: "zh-TW",
  url: "/zh-TW/notes/test-article",
  body: [],
  ...overrides,
});

describe("Article Component", () => {
  it("renders article section", () => {
    render(
      <Article
        article={makeArticle()}
        contentType="notes"
        availableLocales={["zh-TW"]}
      />
    );
    expect(screen.getByTestId("article-section")).toBeInTheDocument();
  });

  it("renders article title", () => {
    render(
      <Article
        article={makeArticle()}
        contentType="notes"
        availableLocales={["zh-TW"]}
      />
    );
    expect(
      screen.getByRole("heading", { name: "Test Article" })
    ).toBeInTheDocument();
  });

  it("renders back link", () => {
    render(
      <Article
        article={makeArticle()}
        contentType="notes"
        backLinkText="Back to Notes"
        availableLocales={["zh-TW"]}
      />
    );
    expect(screen.getByText("Back to Notes")).toBeInTheDocument();
  });

  it("renders portable text body", () => {
    render(
      <Article
        article={makeArticle()}
        contentType="notes"
        availableLocales={["zh-TW"]}
      />
    );
    expect(screen.getByTestId("portable-text")).toBeInTheDocument();
  });
});
