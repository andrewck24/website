jest.mock("next/og", () => ({
  ImageResponse: jest.fn((jsx) => ({ type: "ImageResponse", jsx })),
}));

jest.mock("../../../../../../lib/data/projects", () => ({
  getProject: jest.fn(),
}));

jest.mock("../../../../../../lib/sanity/image", () => ({
  urlFor: jest.fn(),
}));

import { ImageResponse } from "next/og";
import { getProject } from "../../../../../../lib/data/projects";
import { urlFor } from "../../../../../../lib/sanity/image";
import Image, { size, contentType } from "../opengraph-image";

const mockGetProject = getProject as jest.Mock;
const mockUrlFor = urlFor as jest.Mock;
const MockImageResponse = ImageResponse as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("size export", () => {
  it("has width 1200", () => {
    expect(size.width).toBe(1200);
  });

  it("has height 630", () => {
    expect(size.height).toBe(630);
  });
});

describe("contentType export", () => {
  it('is "image/png"', () => {
    expect(contentType).toBe("image/png");
  });
});

describe("Image (no coverImage)", () => {
  beforeEach(() => {
    mockGetProject.mockResolvedValue({
      title: "My Project",
      coverImage: null,
    });
  });

  it("calls ImageResponse with fallback JSX", async () => {
    await Image({
      params: Promise.resolve({ lang: "en", slug: "my-project" }),
    });
    expect(MockImageResponse).toHaveBeenCalledTimes(1);
  });

  it('fallback JSX contains "Andrew Tseng"', async () => {
    await Image({
      params: Promise.resolve({ lang: "en", slug: "my-project" }),
    });
    const result = MockImageResponse.mock.results[0].value as {
      jsx: React.ReactElement;
    };
    const jsxString = JSON.stringify(result.jsx);
    expect(jsxString).toContain("Andrew Tseng");
  });

  it("fallback JSX contains the project title", async () => {
    await Image({
      params: Promise.resolve({ lang: "en", slug: "my-project" }),
    });
    const result = MockImageResponse.mock.results[0].value as {
      jsx: React.ReactElement;
    };
    const jsxString = JSON.stringify(result.jsx);
    expect(jsxString).toContain("My Project");
  });
});

describe("Image (with coverImage)", () => {
  const fakeImageUrl = "https://cdn.sanity.io/images/test/1200x630.jpg";

  beforeEach(() => {
    mockGetProject.mockResolvedValue({
      title: "Cover Project",
      coverImage: { asset: { _ref: "image-abc-1200x630-jpg" } },
    });

    const mockUrlBuilder = {
      width: jest.fn().mockReturnThis(),
      height: jest.fn().mockReturnThis(),
      fit: jest.fn().mockReturnThis(),
      url: jest.fn().mockReturnValue(fakeImageUrl),
    };
    mockUrlFor.mockReturnValue(mockUrlBuilder);
  });

  it("uses Sanity image URL as img src", async () => {
    await Image({
      params: Promise.resolve({ lang: "en", slug: "cover-project" }),
    });
    const result = MockImageResponse.mock.results[0].value as {
      jsx: React.ReactElement;
    };
    const jsxString = JSON.stringify(result.jsx);
    expect(jsxString).toContain(fakeImageUrl);
  });

  it("uses height 630 for Sanity URL builder", async () => {
    await Image({
      params: Promise.resolve({ lang: "en", slug: "cover-project" }),
    });
    const urlBuilder = mockUrlFor.mock.results[0].value;
    expect(urlBuilder.height).toHaveBeenCalledWith(630);
  });
});
