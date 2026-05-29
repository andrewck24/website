import { LanguageToggle } from "@/components/layout/language-toggle";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  usePathname: () => "/zh-TW/notes/test",
  useRouter: () => ({ push: jest.fn() }),
}));

describe("LanguageToggle Component", () => {
  it("renders without crashing", () => {
    render(
      <LanguageToggle availableLocales={["zh-TW", "en"]}>
        <span>Lang</span>
      </LanguageToggle>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders single locale as text display", () => {
    render(
      <LanguageToggle availableLocales={["zh-TW"]}>
        <span>Lang</span>
      </LanguageToggle>
    );
    expect(screen.getByTestId("language-toggle-single")).toBeInTheDocument();
  });
});
