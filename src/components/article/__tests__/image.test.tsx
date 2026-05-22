import { ArticleImage } from "@/components/article/image";
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

const mockCoverImage = {
  _type: "image" as const,
  asset: { _ref: "image-abc-800x600-jpg", _type: "reference" as const },
};

describe("ArticleImage Component", () => {
  it("renders container with testid", () => {
    render(<ArticleImage slug="test-slug" title="Test Title" />);
    expect(screen.getByTestId("article-image-container")).toBeInTheDocument();
  });

  it("renders fallback gradient when no coverImage", () => {
    render(<ArticleImage slug="test" title="Test" />);
    expect(screen.getByTestId("article-image-container")).toBeInTheDocument();
  });

  it("renders image when coverImage is provided", () => {
    render(
      <ArticleImage
        slug="test"
        title="Test Title"
        coverImage={mockCoverImage}
      />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Test Title");
  });

  it("sets view-transition-name based on slug", () => {
    render(<ArticleImage slug="my-note" title="My Note" />);
    const container = screen.getByTestId("article-image-container");
    expect(container.style.viewTransitionName).toBe("article-image-my-note");
  });
});
