# Tech Stack

## Core Technology Stack

### Frontend Framework

| Technology     | Version | Purpose         | Notes                                        |
| -------------- | ------- | --------------- | -------------------------------------------- |
| **TypeScript** | 5.3+    | 型別安全開發    | 必須展示企業級開發標準，減少執行時錯誤       |
| **Next.js**    | 15.0+   | React 全棧框架  | Vercel 原生支援，App Router 提供現代路由功能 |
| **Fumadocs**   | 14.0+   | 文檔/部落格框架 | PRD 指定，專為技術內容優化，內建 MDX 支援    |

### Styling & UI Components

| Technology       | Version | Purpose           | Notes                                  |
| ---------------- | ------- | ----------------- | -------------------------------------- |
| **Tailwind CSS** | 4.0+    | Utility-first CSS | 前端規格指定，支援設計系統和響應式設計 |
| **Shadcn/ui**    | Latest  | 可客製化元件庫    | 與 Tailwind 完美整合，現代設計系統標準 |

### State Management

| Technology        | Version | Purpose        | Notes                                     |
| ----------------- | ------- | -------------- | ----------------------------------------- |
| **React State**   | 18+     | 基礎狀態管理   | Phase 1 使用，滿足靜態網站需求            |
| **Redux Toolkit** | 2.0+    | 企業級狀態管理 | Phase 2 加入，用於互動功能（排球 App 等） |
| **Fumadocs i18n** | 15.0+   | 多語言管理     | 內建 i18n 支援，取代 next-intl            |

### Backend & Database

| Technology             | Version | Purpose               | Notes                                        |
| ---------------------- | ------- | --------------------- | -------------------------------------------- |
| **Node.js**            | 20 LTS  | JavaScript 伺服器環境 | Vercel Functions 標準，與前端技術棧統一      |
| **Next.js API Routes** | 15.0+   | Serverless API 端點   | 與前端框架整合，簡化部署和開發               |
| **Vercel Postgres**    | -       | 受管理 PostgreSQL     | (預計開發) Vercel 生態整合，當前使用靜態資料 |
| **Vercel KV (Redis)**  | -       | 邊緣快取              | (預計開發) API 響應快取，當前無需快取        |
| **Vercel Blob**        | -       | 雲端物件儲存          | (預計開發) 當前使用 public/ 靜態檔案         |

### Authentication & Security

| Technology      | Version | Purpose        | Notes                                     |
| --------------- | ------- | -------------- | ----------------------------------------- |
| **NextAuth.js** | 5.0+    | 認證解決方案   | (預計開發) 展示用戶系統，當前無需認證     |
| **Zod**         | 3.22+   | 執行時型別驗證 | 未來功能 - API 輸入驗證，當前使用靜態資料 |

### Development Tools

| Technology              | Version      | Purpose        | Notes                            |
| ----------------------- | ------------ | -------------- | -------------------------------- |
| **Jest + RTL**          | 29.0+ / 14+  | 元件和單元測試 | 豐富的生態系統和插件             |
| **Jest + Supertest**    | 29.0+ / 6+   | API 端點測試   | 與前端測試工具一致，減少學習成本 |
| **Playwright**          | 1.40+        | 端對端測試     | PRD 指定，支援視覺回歸測試       |
| **ESLint + Prettier**   | 8.50+ / 3.0+ | 程式碼品質控制 | 團隊開發標準，展示專業開發實務   |
| **TypeScript Compiler** | 5.3+         | 靜態型別檢查   | CI/CD 整合，確保型別安全         |

### Build & Deployment

| Technology | Version | Purpose      | Notes                                      |
| ---------- | ------- | ------------ | ------------------------------------------ |
| **pnpm**   | 8.15+   | 效率封裝管理 | 節省磁碟空間，支援 workspace，現代標準     |
| **Turbo**  | 1.10+   | 增量建構系統 | Vercel 自動處理建構，當前使用 Next.js 原生 |
| **Vercel** | -       | 自動部署平台 | Git 整合，自動預覽，零配置部署             |

### Monitoring & Analytics

| Technology            | Version | Purpose        | Notes                               |
| --------------------- | ------- | -------------- | ----------------------------------- |
| **Vercel Analytics**  | -       | 效能和使用分析 | 內建 Core Web Vitals 追蹤，免費額度 |
| **Vercel Monitoring** | -       | 錯誤和異常追蹤 | 與部署平台整合，即時錯誤報告        |

### Content & Internationalization

| Technology        | Version | Purpose      | Notes                                       |
| ----------------- | ------- | ------------ | ------------------------------------------- |
| **Fumadocs I18n** | 14.0+   | 多語言支援   | 檔案命名規則，動態路由，搜尋整合            |
| **Fumadocs MDX**  | 14.0+   | 內容管理系統 | 原生整合 - MDX 處理，類型安全，版本控制友好 |

## 技術棧簡化效益

**Fumadocs 整合優勢:**

- ✅ **減少 2 個外部依賴**: next-intl → Fumadocs I18n, Contentlayer → Fumadocs MDX
- ✅ **零配置多語言支援**: 檔案命名規則自動處理語言路由
- ✅ **自動 MDX 類型生成**: 內建搜尋和導航功能
- ✅ **統一的配置和部署**: 單一框架責任，減少版本衝突風險
