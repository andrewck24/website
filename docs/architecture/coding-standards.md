# Coding Standards

## TypeScript 類型定義

### 個人資料類型

**使用者個人資料:**

```typescript
// types/profile.ts
export interface UserProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  location: string;
  website?: string;
  social: SocialLinks;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email: string;
}
```

**專案資料類型:**

```typescript
// types/project.ts
export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  status: ProjectStatus;
  techStack: string[];
  features: string[];
  screenshots: Screenshot[];
  links: ProjectLinks;
  dateRange: {
    start: string; // ISO date
    end?: string; // ISO date or null for ongoing
  };
}

export type ProjectStatus = "completed" | "in-progress" | "planned";

export interface ProjectLinks {
  github?: string;
  demo?: string;
  documentation?: string;
}

export interface Screenshot {
  url: string;
  alt: string;
  caption?: string;
}
```

## 元件規範

### 檔案命名規範

**檔案命名標準:**

- 一般檔案：使用 kebab-case (例：social-links.ts, user-profile.ts, hero-section.tsx)
- 目錄：使用 kebab-case (例：profile/, user-data/)
- 測試檔案：使用目錄資料夾 + kebab-case + .test.tsx (例：profile/hero-section.test.tsx)

### React 元件標準

**元件結構範例:**

```typescript
// components/home/hero.tsx
import { source } from "@/lib/source";
import { type UserProfile } from "@/types/profile";

interface ProfileHeroProps {
  locale: string;
  profile?: UserProfile;
  className?: string;
}

export function Hero({ locale, profile, className }: ProfileHeroProps) {
  // 使用 Fumadocs i18n 靜態資料
  const profileData = source.getPage(["profile"], locale);

  return (
    <section
      data-testid="hero-section"
      className={cn("relative", className)}
    >
      <HeroCard data-testid="hero-card" className="glass-effect" />
    </section>
  );
}
```

### 測試 ID 命名標準

**data-testid 命名規範:**

```typescript
// 頁面層級: [page-name]-page
data-testid="portfolio-page"
data-testid="about-page"
data-testid="blog-page"

// 區塊層級: [component-name]-section
data-testid="profile-hero-section"
data-testid="projects-grid-section"

// 卡片層級: [item-type]-card
data-testid="project-card"
data-testid="skill-card"

// 按鈕層級: [action]-[element-type]
data-testid="view-portfolio-btn"
data-testid="language-switch"
data-testid="theme-toggle"

// 列表項目: [item-type]-item
data-testid="nav-item"
data-testid="skill-item"
```

## 樣式規範

### Tailwind CSS 使用標準

**響應式設計模式:**

```typescript
// 響應式斷點
const responsiveClasses = {
  mobile: "block",      // default
  tablet: "md:flex",    // >= 768px
  desktop: "lg:grid",   // >= 1024px
  wide: "xl:container"  // >= 1280px
};

// 元件應用範例
<div className="
  grid grid-cols-1          // mobile: 1 column
  md:grid-cols-2           // tablet: 2 columns
  lg:grid-cols-3           // desktop: 3 columns
  gap-4 md:gap-6 lg:gap-8  // responsive gaps
">
```

**色彩系統配置:**

```typescript
// tailwind.config.ts 色彩配置
const colors = {
  primary: {
    50: "#eff6ff",
    500: "#3b82f6",
    900: "#1e3a8a",
  },
  accent: {
    50: "#f0f9ff",
    500: "#06b6d4",
    900: "#164e63",
  },
};
```

## 狀態管理

### Redux Toolkit 使用標準

**Slice 模式範例:**

```typescript
// store/demo-slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DemoState {
  volleyball: {
    currentGame: GameState | null;
    isLive: boolean;
    score: { home: number; away: number };
  };
  ui: {
    isLoading: boolean;
    error: string | null;
  };
}

const initialState: DemoState = {
  volleyball: {
    currentGame: null,
    isLive: false,
    score: { home: 0, away: 0 },
  },
  ui: {
    isLoading: false,
    error: null,
  },
};

export const demoSlice = createSlice({
  name: "demo",
  initialState,
  reducers: {
    updateScore: (
      state,
      action: PayloadAction<{ team: "home" | "away"; points: number }>
    ) => {
      const { team, points } = action.payload;
      state.volleyball.score[team] = points;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.ui.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.ui.error = action.payload;
    },
  },
});
```

## 國際化規範

### Fumadocs i18n 配置

**i18n 配置檔案:**

```typescript
// lib/i18n.ts
import { defineI18n } from "fumadocs-core/i18n";

export const { i18n, locales } = defineI18n({
  languages: [
    { code: "zh-TW", name: "中文" },
    { code: "en", name: "English" },
    { code: "ja", name: "日本語" },
  ],
  defaultLanguage: "zh-TW",
  fallbackLanguage: "en",
});
```

**靜態資料結構範例:**

```typescript
// lib/data/profile.ts
export const profileData = {
  "zh-TW": {
    name: "曾立維",
    title: "全端工程師",
    bio: "專精於 React 和 Node.js 的全端開發",
  },
  en: {
    name: "Andrew Tseng",
    title: "Full-stack Developer",
    bio: "Specialized in React and Node.js development",
  },
  ja: {
    name: "アンドリュー・ツェン",
    title: "フルスタック開発者",
    bio: "React と Node.js を専門とするフルスタック開発",
  },
};
```

**多語言內容檔案結構:**

```text
content/docs/
├── zh-TW/
│   ├── profile.mdx
│   ├── projects/
│   │   └── volleyball-app.mdx
│   └── about.mdx
├── en/
│   ├── profile.mdx
│   ├── projects/
│   │   └── volleyball-app.mdx
│   └── about.mdx
└── ja/
    ├── profile.mdx
    ├── projects/
    │   └── volleyball-app.mdx
    └── about.mdx
```

## API 設計標準

### Next.js API Routes 規範

**API 路由結構:**

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    return Response.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      "data-testid": "health-check-response",
    });
  } catch (error) {
    return Response.json(
      {
        status: "error",
        error: "Internal server error",
        "data-testid": "error-response",
      },
      { status: 500 }
    );
  }
}
```

**錯誤處理標準:**

```typescript
// lib/api-error.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_ERROR"
  ) {
    super(message);
    this.name = "APIError";
  }
}

// 使用範例
if (!isValidInput(data)) {
  throw new APIError("Invalid input data", 400, "VALIDATION_ERROR");
}
```

## 效能優化標準

### 圖片優化

```typescript
// components/common/OptimizedImage.tsx
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,..."
    />
  );
}
```

### 程式碼分割標準

```typescript
// 延遲載入元件
import { lazy, Suspense } from "react";

const VolleyballDemo = lazy(() => import("@/components/demo/VolleyballDemo"));

export function ProjectShowcase() {
  return (
    <Suspense fallback={<div data-testid="loading-demo">載入中...</div>}>
      <VolleyballDemo />
    </Suspense>
  );
}
```

## 品質保證標準

### 程式碼品質保證

**Pre-commit Hooks:**

```bash
# .husky/pre-commit
#!/bin/sh
npx lint-staged
pnpm type-check
pnpm test
```

**品質檢查腳本:**

```bash
#!/bin/bash
# scripts/quality-check.sh
echo "🔍 執行程式碼品質檢查..."

pnpm type-check || exit 1
pnpm lint || exit 1
pnpm test || exit 1
pnpm build || exit 1
pnpm test:e2e || exit 1

echo "✅ 所有品質檢查通過！"
```

#### **部署和發布流程**

**Vercel 自動部署:**

```bash
# 開發環境
feature/* → Vercel Preview Deploy → 測試預覽

# 生產環境
main → Vercel Production Deploy → 自動上線
```

### 發布前檢查清單

#### 程式碼品質

- [ ] 所有測試通過 (pnpm test)
- [ ] E2E 測試通過 (pnpm test:e2e)
- [ ] 型別檢查通過 (pnpm type-check)
- [ ] 建構成功 (pnpm build)

#### 內容完整性

- [ ] 所有翻譯檔案同步更新
- [ ] 新專案圖片已上傳
- [ ] 部落格文章 frontmatter 完整

#### 功能測試

- [ ] 多語言切換正常
- [ ] 響應式設計正常
- [ ] Lighthouse 分數 > 90
