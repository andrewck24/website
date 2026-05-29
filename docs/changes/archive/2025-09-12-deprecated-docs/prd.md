# 個人形象網站 Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- 建立專業的個人品牌形象，提升在台灣、遠端及日本市場的求職競爭力
- 展示從前端到全端工程師的技術能力和產品思維
- 透過原創排球 app 專案，證明獨立解決問題和產品開發的能力
- 建立技術內容平台，持續展現專業深度和學習成長
- 獲得更多高品質的面試機會和工作邀請

### Background Context

作為專注於 React 和 Node.js 技術棧的工程師，隨著技能從前端擴展到全端開發，以及雲端技術學習（已完成 GCP 課程證書，正在準備 AWS 認證），需要一個能夠綜合展示這些能力的平台。

現有的履歷和作品集形式無法有效展現實際的開發能力和技術深度。特別是對於國際市場（如日本），雇主更重視技術文章和實際的專案展示。透過建立一個功能完整的個人網站，不僅展示技術實力，網站本身就是一個技術作品。

### Change Log

| Date       | Version | Description   | Author |
| ---------- | ------- | ------------- | ------ |
| 2025-09-06 | 1.0     | 初始 PRD 建立 | PM     |

## Requirements

### Functional

- FR1: 網站首頁展示個人基本資料、技能摘要，以及 GitHub、LinkedIn 等專業平台連結
- FR2: 作品集頁面完整展示排球 app 專案，包含專案背景、解決的問題、技術架構和實作細節
- FR3: 作品集頁面嵌入排球 app 的關鍵前端元件，訪客可直接互動體驗功能
- FR4: 作品集頁面提供即時的 API 請求展示，類似 Vercel 後台的 logs 展示器
- FR5: 技術部落格支援多語言內容（中文、英文、日文），包含分類和標籤系統
- FR6: 技術架構圖表使用 Mermaid 視覺化展示，幫助技術主管理解專案內容
- FR7: 整站支援響應式設計，在桌面、平板和手機上都有良好的瀏覽體驗
- FR8: 首頁加入 CSS transitions 動畫效果，特別是 blurry floating elements 增強視覺效果
- FR9: 技術關鍵字標註系統，方便 HR 比對職缺 JD 中的技術需求
- FR10: SEO 優化配置，包含 meta tags、sitemap 和結構化資料

### Non Functional

- NFR1: 網站載入時間在 2 秒內完成，確保良好的第一印象
- NFR2: 雲端服務使用量控制在免費額度內，或月費用低於 $10 USD
- NFR3: 支援多瀏覽器相容性，包含 Chrome、Firefox、Safari 和 Edge
- NFR4: 多語言內容保持品質一致性，避免機翻低品質內容
- NFR5: 即時功能的 API 回應時間低於 500ms，確保展示效果流暢
- NFR6: 所有使用者互動都有適當的載入狀態和錯誤處理
- NFR7: 技術部落格文章支援 MDX 格式，包含程式碼語法 Highlight 和互動元件

## User Interface Design Goals

### Overall UX Vision

個人網站應該展現專業、現代且技術導向的形象。整體設計要平衡專業性和親和力，讓 HR 人員能快速獲取基本資訊，技術主管能深入了解技術能力。視覺設計要體現前端工程師的設計敏感度。

### Key Interaction Paradigms

- **漸進式資訊揭露**：首頁簡潔明瞭，詳細資訊透過點擊展開
- **互動式展示**：作品集採用可操作的元件展示，而非靜態截圖
- **引導式瀏覽**：從基本資料 → 專案展示 → 技術深度的自然流程
- **即時回饋**：所有互動都有即時的視覺回饋和狀態顯示

### Core Screens and Views

- **首頁 (Landing Page)**：個人介紹、技能概要、快速導航
- **作品集展示 (Portfolio)**：排球 app 專案的完整展示和互動體驗
- **技術部落格 (Blog)**：文章列表、分類瀏覽、多語言切換
- **關於我 (About)**：詳細經歷、技術成長軌跡、認證展示

### Accessibility

WCAG AA 等級，確保良好的對比度、鍵盤導航支援和螢幕閱讀器相容性

### Branding

現代簡潔的設計風格，採用深色主題配上藍色系 accent 顏色，體現技術專業性。字體選用 system fonts 確保跨平台一致性。

### Target Device and Platforms

Web Responsive，支援桌面和行動裝置，重點優化桌面瀏覽體驗（主要目標受眾在桌面環境瀏覽）

## Technical Assumptions

### Repository Structure

Monorepo - 將所有功能整合在單一 repository 中，方便管理和部署

### Service Architecture

Jamstack 架構：靜態站點生成 + Serverless Functions。主要網站使用 Static Site Generation，動態功能透過 Serverless Functions 實現。

### Testing Requirements

Unit + Integration testing。前端元件使用 Jest + React Testing Library，E2E 使用 Playwright，並包含視覺回歸測試確保 UI 品質。

### Additional Technical Assumptions and Requests

- **主要框架選擇**：Fumadocs 作為主要框架，善用其對於 blog 功能的整合性和文檔站點優化
- **替代方案**：如果 Fumadocs 不適合，則使用 Next.js 15+ App Router + next-intl
- **樣式方案**：Tailwind CSS 配合 CSS Modules，確保樣式的可維護性
- **動畫實作**：CSS transitions 和 transforms，避免 heavy animation libraries
- **部署策略**：主站點部署到 GitHub Pages，Serverless Functions 部署到 GCP Cloud Run Functions
- **雲端服務**：優先使用 GCP Cloud Run Functions，備選 Vercel Functions
- **內容管理**：MDX 支援，可在文章中嵌入 React 元件
- **圖片優化**：使用 Next.js Image Optimization 或類似方案
- **字體載入**：Google Fonts 或 system fonts，注重載入效能
- **資料庫需求**：展示用的後端功能可使用輕量級解決方案（如 GCP 免費方案）

## Epic 概述與開發階段

專案分為四個主要 Epic，採用分階段開發策略：

### Phase 1: MVP 核心功能 (Epic 1-3)

**Epic 1: 基礎網站建立與首頁** - 建立專案基礎架構、部署管道，以及吸引人的首頁
**Epic 2: 排球 App 作品集展示** - 建立完整的專案展示頁面，展現技術思維過程
**Epic 3: 技術部落格與內容平台** - 建立多語言的技術文章平台

**Phase 1 預估時程**: 72-94 小時  
**Phase 1 目標**: 建立功能完整的個人品牌網站，包含作品集展示和技術部落格

### Phase 2: 進階互動功能 (Epic 4)

**Epic 4: 互動展示與後端整合** - 實作可互動的前端元件和即時的 API 展示功能

**Phase 2 預估時程**: 26-34 小時  
**Phase 2 目標**: 提升網站互動性，展現全端開發和後端整合能力

詳細的 Epic 文件和 Story 定義請參考 `docs/epics/` 資料夾中的個別文件。
