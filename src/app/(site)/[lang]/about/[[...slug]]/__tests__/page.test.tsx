import AboutPage from "../page";

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("../../../../../../lib/sanity/client", () => ({
  client: { fetch: jest.fn() },
}));

jest.mock("../../../../../../components/about/personal-info", () => ({
  PersonalInfo: () => null,
}));

jest.mock("@portabletext/react", () => ({
  PortableText: () => null,
}));

jest.mock("../../../../../../components/mdx/portable-text", () => ({
  portableTextComponents: {},
}));

import { client } from "../../../../../../lib/sanity/client";
import { notFound } from "next/navigation";

const mockFetch = client.fetch as jest.Mock;
const mockNotFound = notFound as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AboutPage", () => {
  it("calls notFound() when Sanity returns null", async () => {
    mockFetch.mockResolvedValue(null);

    await expect(
      AboutPage({ params: Promise.resolve({ lang: "en" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockNotFound).toHaveBeenCalled();
  });

  it("renders without calling notFound() when about document exists", async () => {
    mockFetch.mockResolvedValue({ title: "About", body: [] });

    await expect(
      AboutPage({ params: Promise.resolve({ lang: "zh-TW" }) })
    ).resolves.not.toThrow();

    expect(mockNotFound).not.toHaveBeenCalled();
  });
});
