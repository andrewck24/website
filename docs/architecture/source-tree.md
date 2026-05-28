# Source Tree Structure

## 專案目錄結構

```txt
andrewck24/
│
├── app/                          # Next.js 15 App Router
│   ├── [lang]/                   # Fumadocs i18n 多語言路由
│   │   ├── (home)/               # HomeLayout 路由群組
│   │   │   ├── layout.tsx        # 首頁佈局
│   │   │   ├── page.tsx          # 首頁內容
│   │   │   ├── portfolio/
│   │   │   │   └── page.tsx      # 作品集頁面
│   │   │   └── about/
│   │   │       └── page.tsx      # 關於我頁面
│   │   ├── blog/                 # Fumadocs 部落格
│   │   │   └── [[...slug]]/
│   │   │       └── page.tsx      # 部落格頁面
│   │   └── docs/                 # 技術文件（未來）
│   │       ├── layout.tsx        # DocsLayout
│   │       └── [[...slug]]/
│   │           └── page.tsx
│   ├── api/                      # Serverless API Routes
│   │   └── demo/                 # 未來互動功能
│   ├── layout.tsx                # 根佈局
│   ├── globals.css               # 全域樣式
│   └── sitemap.ts                # 動態 sitemap
│
├── components/                   # React 元件
│   ├── ui/                       # 基礎 UI 元件 (shadcn/ui)
│   ├── layout/                   # 佈局相關元件
│   ├── profile/                  # 個人資料相關元件
│   ├── portfolio/                # 作品集相關元件
│   └── common/                   # 通用元件
│
├── content/                      # Fumadocs 內容檔案 (多語言)
│   ├── docs/                     # 主要文件內容
│   │   ├── en/                   # 英文內容
│   │   │   ├── index.mdx
│   │   │   └── getting-started.mdx
│   │   ├── zh-TW/                # 中文內容
│   │   │   ├── index.mdx
│   │   │   └── getting-started.mdx
│   │   └── ja/                   # 日文內容
│   │       ├── index.mdx
│   │       └── getting-started.mdx
│   └── meta.json                 # 內容 metadata
│
├── store/                        # Redux Toolkit 狀態管理
│   ├── index.ts                  # Store 配置
│   └── demo-slice.ts             # 互動展示狀態
│
├── lib/                         # 共用邏輯和工具
│   ├── utils.ts                 # 工具函數
│   ├── config.ts                # 應用程式配置
│   ├── source.ts                # Fumadocs 資料來源
│   ├── i18n.ts                  # Fumadocs i18n 配置
│   └── data/                    # 靜態資料
│       └── social-links.ts      # 社群連結
│
│
├── public/                     # 靜態資源
│   ├── images/
│   │   ├── profile/            # 個人頭像
│   │   ├── projects/           # 專案截圖
│   │   └── blog/               # 文章配圖
│   ├── favicon.ico
│   └── logo.svg
│
├── __tests__/                  # 測試檔案
│   ├── components/             # 元件測試
│   ├── e2e/                    # E2E 測試
│   └── utils/                  # 測試工具
│
├── types/                      # TypeScript 類型
│   ├── global.d.ts
│   ├── profile.ts
│   └── project.ts
│
├── next.config.js              # Next.js 配置
├── source.config.ts            # Fumadocs 配置
├── middleware.ts               # Fumadocs i18n 中介軟體
├── tailwind.config.ts          # Tailwind 配置
├── tsconfig.json               # TypeScript 配置
├── package.json                # 專案依賴
└── README.md                   # 專案說明
```

## Repository Structure

**Structure:** Monorepo with Fumadocs integration  
**Package Organization:**

- `/` - Fumadocs 主應用（網站前端）
- `/components` - React 元件庫
- `/lib` - 共享工具、靜態資料和 i18n 配置
- `/content` - 多語言內容檔案

## 關鍵檔案配置

### Fumadocs i18n 配置 (lib/i18n.ts)

```typescript
import { defineI18n } from "fumadocs-core/i18n";

export const i18n = defineI18n({
  defaultLanguage: "zh-TW",
  languages: ["zh-TW", "en", "ja"],
});
```

### Fumadocs UI 翻譯配置

```typescript
// app/[lang]/layout.tsx
import { defineI18nUI } from "fumadocs-ui/i18n";
import { i18n } from "@/lib/i18n";

const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: "English",
    },
    "zh-TW": {
      displayName: "中文",
      search: "搜尋文檔",
      searchNoResult: "沒有找到結果",
      toc: "目錄",
      lastUpdate: "最後更新",
    },
    ja: {
      displayName: "日本語",
      search: "ドキュメントを検索",
      searchNoResult: "結果が見つかりません",
      toc: "目次",
      lastUpdate: "最終更新",
    },
  },
});
```

### 中介軟體配置 (middleware.ts)

```typescript
import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import { i18n } from "@/lib/i18n";

export default createI18nMiddleware(i18n);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### 路由結構

```txt
app/
├── [lang]/                    # Fumadocs i18n 多語言
│   ├── (home)/               # HomeLayout 群組
│   │   ├── layout.tsx        # 首頁佈局（包含 i18n 配置）
│   │   ├── page.tsx          # 首頁
│   │   ├── portfolio/page.tsx # 作品集
│   │   └── about/page.tsx     # 關於我
│   ├── docs/                 # Fumadocs 文件
│   │   ├── layout.tsx        # DocsLayout（包含 i18n 配置）
│   │   └── [[...slug]]/
│   │       └── page.tsx      # 動態文件頁面
│   └── layout.tsx            # 根層級佈局（RootProvider + i18n）
└── api/                      # Serverless API
    └── demo/                 # 未來互動功能
        └── route.ts          # API 處理程式
```

### 內容檔案結構

```txt
content/
└── docs/
    ├── zh-TW/                # 中文內容
    │   ├── index.mdx         # 首頁內容
    │   ├── getting-started.mdx
    │   └── portfolio.mdx
    ├── en/                   # 英文內容
    │   ├── index.mdx
    │   ├── getting-started.mdx
    │   └── portfolio.mdx
    └── ja/                   # 日文內容
        ├── index.mdx
        ├── getting-started.mdx
        └── portfolio.mdx
```
