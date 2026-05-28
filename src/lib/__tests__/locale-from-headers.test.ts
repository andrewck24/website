import { headers } from "next/headers";
import { getLocaleFromHeaders } from "@/lib/locale-from-headers";

jest.mock("next/headers", () => ({ headers: jest.fn() }));

const mockHeaders = headers as jest.Mock;

function makeHeadersObj(value: string | null) {
  return { get: jest.fn().mockReturnValue(value) };
}

describe("getLocaleFromHeaders", () => {
  it('returns "en" when x-pathname is /en/notes/foo', async () => {
    mockHeaders.mockResolvedValue(makeHeadersObj("/en/notes/foo"));
    expect(await getLocaleFromHeaders()).toBe("en");
  });

  it('returns "zh-TW" when x-pathname is /zh-TW/projects/my-project', async () => {
    mockHeaders.mockResolvedValue(makeHeadersObj("/zh-TW/projects/my-project"));
    expect(await getLocaleFromHeaders()).toBe("zh-TW");
  });

  it('returns "ja" when x-pathname is /ja/about', async () => {
    mockHeaders.mockResolvedValue(makeHeadersObj("/ja/about"));
    expect(await getLocaleFromHeaders()).toBe("ja");
  });

  it('returns "zh-TW" when the header is absent', async () => {
    mockHeaders.mockResolvedValue(makeHeadersObj(null));
    expect(await getLocaleFromHeaders()).toBe("zh-TW");
  });
});
