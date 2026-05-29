import { ArticleInfo } from "@/components/article/info";
import type { Locale } from "@/types/article";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  usePathname: () => "/zh-TW/notes/test",
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../../github-info", () => ({
  GithubInfo: ({ url }: { url: string }) => (
    <a data-testid="github-info" href={url}>
      GitHub
    </a>
  ),
}));

jest.mock("../../layout/language-toggle", () => ({
  LanguageToggle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="language-toggle-component">{children}</div>
  ),
}));

const defaultProps = {
  date: "2025-01-01",
  locale: "zh-TW" as Locale,
  tags: [{ title: "React", slug: "react" }],
  contentType: "notes" as const,
  availableLocales: ["zh-TW"] as Locale[],
};

describe("ArticleInfo Component", () => {
  it("renders the info container", () => {
    render(<ArticleInfo {...defaultProps} />);
    expect(screen.getByTestId("article-info")).toBeInTheDocument();
  });

  it("renders the article date", () => {
    render(<ArticleInfo {...defaultProps} />);
    expect(screen.getByTestId("article-date")).toBeInTheDocument();
  });

  it("renders the formatted date", () => {
    render(<ArticleInfo {...defaultProps} date="2025-01-01" locale="zh-TW" />);
    const dateEl = screen.getByTestId("article-date");
    expect(dateEl).toHaveAttribute("dateTime", "2025-01-01");
  });

  it("renders tags when provided", () => {
    render(<ArticleInfo {...defaultProps} />);
    expect(screen.getByTestId("article-tags")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("does not render tags section when tags are empty", () => {
    render(<ArticleInfo {...defaultProps} tags={[]} />);
    expect(screen.queryByTestId("article-tags")).not.toBeInTheDocument();
  });

  it("renders multiple tags", () => {
    render(
      <ArticleInfo
        {...defaultProps}
        tags={[
          { title: "React", slug: "react" },
          { title: "TypeScript", slug: "typescript" },
        ]}
      />
    );
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders language toggle", () => {
    render(<ArticleInfo {...defaultProps} />);
    expect(screen.getByTestId("language-toggle-component")).toBeInTheDocument();
  });

  it("does not render project links for notes", () => {
    render(
      <ArticleInfo
        {...defaultProps}
        contentType="notes"
        githubUrl="https://github.com/test"
        demoUrl="https://demo.test"
      />
    );
    expect(screen.queryByTestId("project-links")).not.toBeInTheDocument();
  });

  it("renders project links for projects when githubUrl is provided", () => {
    render(
      <ArticleInfo
        {...defaultProps}
        contentType="projects"
        githubUrl="https://github.com/test"
      />
    );
    expect(screen.getByTestId("project-links")).toBeInTheDocument();
    expect(screen.getByTestId("github-info")).toBeInTheDocument();
  });

  it("renders demo link for projects when demoUrl is provided", () => {
    render(
      <ArticleInfo
        {...defaultProps}
        contentType="projects"
        demoUrl="https://demo.test"
      />
    );
    expect(screen.getByTestId("project-links")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /live demo/i })
    ).toBeInTheDocument();
  });

  it("does not render project links section when no urls are provided", () => {
    render(<ArticleInfo {...defaultProps} contentType="projects" />);
    expect(screen.queryByTestId("project-links")).not.toBeInTheDocument();
  });
});
