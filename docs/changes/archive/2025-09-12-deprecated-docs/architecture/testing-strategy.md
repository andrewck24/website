# Testing Strategy

## 測試金字塔

```txt
        E2E Tests (Playwright)
       /                    \
   Integration Tests (Jest + RTL)
  /                              \
Frontend Unit        API Unit Tests
   Tests              (Jest + Supertest)
```

## 測試組織

**前端測試:**

```txt
__tests__/
├── components/          # 元件單元測試
│   ├── profile-hero.test.tsx
│   └── project-card.test.tsx
├── e2e/                # E2E 測試
│   ├── homepage.spec.ts
│   └── portfolio.spec.ts
└── utils/              # 測試工具
    └── test-utils.tsx
```

**測試範例:**

```typescript
// 前端元件測試
describe("ProfileHero", () => {
  it("should display profile info with testids", () => {
    render(<ProfileHero />);
    expect(screen.getByTestId("profile-name")).toBeInTheDocument();
  });
});

// E2E 測試
test("should navigate portfolio correctly", async ({ page }) => {
  await page.goto("/portfolio");
  await expect(page.locator('[data-testid="portfolio-page"]')).toBeVisible();
});
```
