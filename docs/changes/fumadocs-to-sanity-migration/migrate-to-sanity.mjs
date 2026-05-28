/**
 * Migrates MDX content to Sanity.
 * Requires SANITY_MIGRATION_TOKEN env var with Editor permissions.
 *
 * Usage:
 *   SANITY_MIGRATION_TOKEN=<editor-token> node scripts/migrate-to-sanity.mjs
 */

import { createClient } from "@sanity/client";

const PROJECT_ID = "aw50l4wo";
const DATASET = "production";
const API_VERSION = "2025-05-22";

const token = process.env.SANITY_MIGRATION_TOKEN;
if (!token) {
  console.error("ERROR: SANITY_MIGRATION_TOKEN env var is required");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  token,
});

// ─── Portable Text helpers ────────────────────────────────────────────────────

function block(text, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    children: [{ _type: "span", _key: key(), text, marks: [] }],
    markDefs: [],
  };
}

function blockBold(text, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: ["strong"] }],
  };
}

function bulletItem(text) {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [{ _type: "span", _key: key(), text, marks: [] }],
    markDefs: [],
  };
}

function card(title, href) {
  return { _type: "card", _key: key(), title, href };
}

let _keyCounter = 0;
function key() {
  return `k${++_keyCounter}`;
}

// ─── Tag documents ────────────────────────────────────────────────────────────

const TAGS = [
  { id: "tag-react", title: "React", slug: "react" },
  { id: "tag-typescript", title: "TypeScript", slug: "typescript" },
  { id: "tag-nextjs", title: "Next.js", slug: "next-js" },
  { id: "tag-tailwind", title: "Tailwind CSS", slug: "tailwind" },
  { id: "tag-sanity", title: "Sanity", slug: "sanity" },
  { id: "tag-cloudflare", title: "Cloudflare", slug: "cloudflare" },
  { id: "tag-machine-learning", title: "Machine Learning", slug: "machine-learning" },
  { id: "tag-i18n", title: "i18n", slug: "i18n" },
  { id: "tag-clean-architecture", title: "Clean Architecture", slug: "clean-architecture" },
  { id: "tag-mongodb", title: "MongoDB", slug: "mongodb" },
  { id: "tag-pwa", title: "PWA", slug: "pwa" },
  { id: "tag-isr", title: "ISR", slug: "isr" },
];

// ─── About content ────────────────────────────────────────────────────────────

const aboutBodyZhTW = [
  block("Hello, World!", "h1"),
  block("熱衷於將創意轉化為高品質的使用者體驗。我相信設計、程式碼與穩定性，是與使用者建立連結的基石。"),
  block("語文、會計與經濟的學習歷程，不僅培養了我的邏輯思維與分析能力，也讓我對商業模式有更高的理解與敏感度。我將這些跨領域的優勢應用在軟體開發中，專注於打造兼具技術深度與商業價值的解決方案。"),
  block("技能與技術", "h2"),
  block("程式語言", "h3"),
  bulletItem("JavaScript / TypeScript"),
  bulletItem("Python"),
  bulletItem("HTML / CSS"),
  block("前端開發", "h3"),
  bulletItem("React (Hooks)"),
  bulletItem("Next.js (App Router)"),
  bulletItem("Redux / Redux Toolkit"),
  bulletItem("Tailwind CSS"),
  bulletItem("Motion"),
  bulletItem("Web APIs (IntersectionObserver, ViewTransition, etc.)"),
  bulletItem("Storybook"),
  bulletItem("PWA / Serwist"),
  block("後端與雲端", "h3"),
  bulletItem("Node.js"),
  bulletItem("MongoDB / Mongoose"),
  bulletItem("Google Cloud Platform"),
  bulletItem("Vercel"),
  block("工具與其他", "h3"),
  bulletItem("Git / GitHub"),
  bulletItem("Sanity"),
  bulletItem("ESLint / Prettier"),
  block("學歷", "h2"),
  block("國立台灣大學 (2017-2023)", "h3"),
  blockBold("文學士 日本語文學主修"),
  blockBold("輔修 經濟學"),
  block("相關課程："),
  bulletItem("Web APP 開發 (A+)"),
  bulletItem("商管程式設計 (A+)"),
  bulletItem("Python 資料分析與機器學習應用 (A+)"),
  block("專業認證", "h2"),
  block("Google Cloud Platform Google 數位人才探索計畫 - Certificate of Completion (2025.09)", "h3"),
  block("TOEIC Listening and Reading Test 965 / 990 (2024.05)", "h3"),
  block("US Certified Public Accountant (USCPA) (2023.05)", "h3"),
  block("Japanese-Language Proficiency Test (JLPT) N1 (2019.07)", "h3"),
];

const aboutBodyEn = [
  block("Hello, World!", "h1"),
  block("Passionate about transforming creativity into high-quality user experiences. I believe that design, code, and stability are the foundations for building meaningful connections with users."),
  block("My academic background in languages, accounting, and economics has not only cultivated my logical thinking and analytical skills but also enhanced my understanding of and sensitivity to business models. I apply these interdisciplinary strengths to software development, focusing on creating solutions that combine technical depth with business value."),
  block("Skills & Technologies", "h2"),
  block("Languages", "h3"),
  bulletItem("JavaScript / TypeScript"),
  bulletItem("Python"),
  bulletItem("HTML / CSS"),
  block("Frontend", "h3"),
  bulletItem("React (Hooks)"),
  bulletItem("Next.js (App Router)"),
  bulletItem("Redux / Redux Toolkit"),
  bulletItem("Tailwind CSS"),
  bulletItem("Motion"),
  bulletItem("Web APIs (IntersectionObserver, ViewTransition, etc.)"),
  bulletItem("Storybook"),
  bulletItem("PWA / Serwist"),
  block("Backend & Cloud", "h3"),
  bulletItem("Node.js"),
  bulletItem("MongoDB / Mongoose"),
  bulletItem("Google Cloud Platform"),
  bulletItem("Vercel"),
  block("Tools & Others", "h3"),
  bulletItem("Git / GitHub"),
  bulletItem("Sanity"),
  bulletItem("ESLint / Prettier"),
  block("Education", "h2"),
  block("National Taiwan University (2017-2023)", "h3"),
  blockBold("Bachelor of Arts in Japanese Language and Literature"),
  blockBold("Minor in Economics"),
  block("Relevant Coursework:"),
  bulletItem("Web Application Programming (A+)"),
  bulletItem("Programming for Business Computing (A+)"),
  bulletItem("Data Analysis and Machine Learning with Python (A+)"),
  block("Certifications", "h2"),
  block("Google Cloud Platform Google 數位人才探索計畫 - Certificate of Completion (2025)", "h3"),
  block("TOEIC Listening and Reading Test 965 / 990 (May 2024)", "h3"),
  block("US Certified Public Accountant (USCPA) (May 2023)", "h3"),
  block("Japanese-Language Proficiency Test (JLPT) N1 (July 2019)", "h3"),
];

const aboutBodyJa = [
  block("Hello, World!", "h1"),
  block("創造力を高品質なユーザー体験へと昇華することに情熱を注いでいます。デザイン、コード、そして安定性こそが、ユーザーとのつながりを築く基盤だと信じています。"),
  block("言語、会計、経済学の学習経験は、論理的思考と分析能力を培っただけでなく、ビジネスモデルへの理解と感度を高めました。これらの学際的な強みをソフトウェア開発に応用し、技術的な深さとビジネス価値を兼ね備えたソリューションの構築に専念しています。"),
  block("スキルと技術", "h2"),
  block("言語", "h3"),
  bulletItem("JavaScript / TypeScript"),
  bulletItem("Python"),
  bulletItem("HTML / CSS"),
  block("フロントエンド", "h3"),
  bulletItem("React (Hooks)"),
  bulletItem("Next.js (App Router)"),
  bulletItem("Redux / Redux Toolkit"),
  bulletItem("Tailwind CSS"),
  bulletItem("Motion"),
  bulletItem("Web APIs (IntersectionObserver, ViewTransition, etc.)"),
  bulletItem("Storybook"),
  bulletItem("PWA / Serwist"),
  block("バックエンドとクラウド", "h3"),
  bulletItem("Node.js"),
  bulletItem("MongoDB / Mongoose"),
  bulletItem("Google Cloud Platform"),
  bulletItem("Vercel"),
  block("ツールその他", "h3"),
  bulletItem("Git / GitHub"),
  bulletItem("Sanity"),
  bulletItem("ESLint / Prettier"),
  block("学歴", "h2"),
  block("国立台湾大学 (2017-2023)", "h3"),
  blockBold("文学士 日本語文学専攻"),
  blockBold("副専攻 経済学"),
  block("関連科目："),
  bulletItem("ウェブアプリケーションプログラミング (A+)"),
  bulletItem("ビジネスコンピューティングプログラミング (A+)"),
  bulletItem("Python によるデータ分析と機械学習 (A+)"),
  block("技術認定", "h2"),
  block("Google Cloud Platform Google 數位人才探索計畫 - Certificate of Completion (2025.09)", "h3"),
  block("TOEIC Listening and Reading Test 965 / 990 (2024.05)", "h3"),
  block("US Certified Public Accountant (USCPA) (2023.05)", "h3"),
  block("Japanese-Language Proficiency Test (JLPT) N1 (2019.07)", "h3"),
];

// ─── Note content ─────────────────────────────────────────────────────────────

const noteBodyZhTW = [
  block("歡迎來到我的筆記！"),
  block("Next 是什麼？", "h2"),
  card("Next.js 介紹", "https://nextjs.org/docs"),
  card("Fumadocs 介紹", "https://fumadocs.vercel.app"),
];

const noteBodyEn = [
  block("Welcome to my notes!"),
  block("What is Next?", "h2"),
  card("Learn more about Next.js", "https://nextjs.org/docs"),
  card("Learn more about Fumadocs", "https://fumadocs.vercel.app"),
];

const noteBodyJa = [
  block("私のノートへようこそ！"),
  block("Nextとは？", "h2"),
  card("Next.js についてもっと知る", "https://nextjs.org/docs"),
  card("Fumadocs についてもっと知る", "https://fumadocs.vercel.app"),
];

// ─── Project content ──────────────────────────────────────────────────────────

const volleybroBodyZhTW = [
  block("專案起源與核心價值", "h2"),
  block("專案構思過程", "h3"),
  block("過去在大學系隊或社區排球隊的比賽中，球隊管理者與記錄員通常使用紙筆記錄比賽數據。這種傳統方式存在多項問題：記錄速度較慢，容易因為比賽節奏緊湊而記錯或遺漏關鍵數據，且賽後需要花費額外時間整理統計資料。"),
  block("我們觀察到現代排球比賽記錄應該能夠利用數位化工具來大幅提升效率。VolleyBro 採用現代化的 Web 技術架構，打造一個兼具易用性與專業性的排球隊伍管理與比賽記錄平台。"),
  block("採用方案", "h3"),
  block("技術層面上，我們選擇 Next.js 15 作為前端框架，搭配 React 19 實現流暢的使用者介面；採用 MongoDB 作為資料庫；遵循 Clean Architecture 原則，並透過 InversifyJS 實現依賴注入。"),
  block("技術架構", "h3"),
  bulletItem("Next.js 15, React 19, TypeScript"),
  bulletItem("Tailwind CSS, Motion"),
  bulletItem("MongoDB / Mongoose"),
  bulletItem("NextAuth.js + Google OAuth"),
  bulletItem("Clean Architecture + InversifyJS"),
  bulletItem("PWA / Serwist"),
  bulletItem("Storybook"),
  block("專案願景", "h2"),
  bulletItem("多語系支援（進行中）"),
  bulletItem("智慧分析引擎：AI 驅動的戰術建議與球員表現預測"),
  bulletItem("原生行動應用程式（iOS / Android）"),
  bulletItem("社群與賽事管理功能"),
];

const musicHitsBodyZhTW = [
  block("專案背景", "h2"),
  block("本專案是我在修習台大資管系「Python 資料分析與機器學習應用」課程時，用於呈現期末專題研究成果的前端專案。研究主題是利用音樂特徵與串流媒體上的人氣度資料，透過資料分析與機器學習技術，預測該作品的流行趨勢。"),
  block("採用方案", "h2"),
  block("核心功能", "h3"),
  bulletItem("歌曲資料庫搜尋系統：使用 Fuse.js 對前端靜態資源進行模糊搜尋"),
  bulletItem("音樂特徵視覺化：使用 Recharts 套件以互動式圖表呈現"),
  block("技術架構", "h3"),
  block("前端", "h3"),
  bulletItem("React 19, Vite, TypeScript"),
  bulletItem("Tailwind CSS"),
  bulletItem("i18next"),
  bulletItem("Recharts"),
  bulletItem("Fuse.js"),
  block("後端與基礎設施", "h3"),
  bulletItem("Hono.js"),
  bulletItem("Spotify API, ReccoBeats API"),
  bulletItem("Cloudflare Workers"),
  block("未來規劃", "h2"),
  bulletItem("擴展資料來源：整合更多音樂平台"),
  bulletItem("即時計算功能"),
  bulletItem("社群互動功能"),
  bulletItem("串接 Spotify 帳號"),
];

// Task 4.4: portfolio-website — updated to reflect Sanity + ISR, all three locales
const portfolioBodyZhTW = [
  block("此網站以 Next.js 與 Sanity.io 為核心架構，透過 ISR（Incremental Static Regeneration）與 Sanity Webhook 實現近即時的內容更新，無需重新部署即可反映最新內容。結合 ViewTransition 等 Web API 提升整體互動體驗。在開發過程中，採用 SDD 流程，確保程式碼品質與長期可維護性。內容方面，運用 Sanity Studio 管理多語系內容，並透過 Portable Text 進行結構化渲染，同時以此網站呈現個人作品集與技術筆記，展現開發能力。"),
];

const portfolioBodyEn = [
  block("This website is built with Next.js and Sanity.io as its core architecture. It leverages ISR (Incremental Static Regeneration) with Sanity Webhooks to enable near-realtime content updates without redeployment. ViewTransition and other Web APIs enhance the overall interactive experience. The development process follows an SDD workflow to ensure code quality and long-term maintainability. Content is managed via Sanity Studio with multilingual support, rendered through Portable Text with structured components."),
];

const portfolioBodyJa = [
  block("このウェブサイトは Next.js と Sanity.io をコアアーキテクチャとして構築されています。ISR（Incremental Static Regeneration）と Sanity Webhook を組み合わせることで、再デプロイなしでほぼリアルタイムのコンテンツ更新を実現しています。ViewTransition などの Web API を活用して全体的なインタラクティブ体験を向上させています。開発プロセスでは SDD ワークフローを採用し、コード品質と長期的な保守性を確保しています。"),
];

// ─── Main migration ───────────────────────────────────────────────────────────

async function createTagDocs() {
  console.log("\n📌 Creating tags...");
  const tx = client.transaction();
  for (const t of TAGS) {
    tx.createOrReplace({
      _id: t.id,
      _type: "tag",
      title: t.title,
      slug: { _type: "slug", current: t.slug },
    });
  }
  await tx.commit();
  console.log(`  ✓ ${TAGS.length} tags created`);
}

function tagRef(id) {
  return { _key: key(), _type: "reference", _ref: id, _weak: true };
}

async function createI18nDocSet({ baseId, type, locales }) {
  const tx = client.transaction();

  for (const [lang, data] of locales) {
    const docId = lang === locales[0][0] ? baseId : `${baseId}__i18n_${lang}`;
    tx.createOrReplace({ _id: docId, _type: type, language: lang, ...data });
  }

  // translation.metadata document
  tx.createOrReplace({
    _id: `i18n.${baseId}`,
    _type: "translation.metadata",
    translations: locales.map(([lang]) => ({
      _key: lang,
      value: {
        _type: "reference",
        _weak: true,
        _ref: lang === locales[0][0] ? baseId : `${baseId}__i18n_${lang}`,
      },
    })),
  });

  await tx.commit();
}

async function createAboutDocs() {
  console.log("\n📖 Creating about documents...");

  const locales = [
    ["zh-TW", { title: "關於", body: aboutBodyZhTW }],
    ["en", { title: "About", body: aboutBodyEn }],
    ["ja", { title: "私について", body: aboutBodyJa }],
  ];

  // About uses fixed IDs defined in sanity.config.ts structure
  const tx = client.transaction();
  tx.createOrReplace({ _id: "about-zh-TW", _type: "about", language: "zh-TW", title: "關於", body: aboutBodyZhTW });
  tx.createOrReplace({ _id: "about-en", _type: "about", language: "en", title: "About", body: aboutBodyEn });
  tx.createOrReplace({ _id: "about-ja", _type: "about", language: "ja", title: "私について", body: aboutBodyJa });
  tx.createOrReplace({
    _id: "i18n.about",
    _type: "translation.metadata",
    translations: [
      { _key: "zh-TW", value: { _type: "reference", _weak: true, _ref: "about-zh-TW" } },
      { _key: "en", value: { _type: "reference", _weak: true, _ref: "about-en" } },
      { _key: "ja", value: { _type: "reference", _weak: true, _ref: "about-ja" } },
    ],
  });
  await tx.commit();
  console.log("  ✓ about (zh-TW, en, ja)");
}

async function createNoteDocs() {
  console.log("\n📝 Creating note documents...");
  await createI18nDocSet({
    baseId: "note-hello-world",
    type: "note",
    locales: [
      ["zh-TW", {
        title: "Hello World",
        slug: { _type: "slug", current: "hello-world" },
        description: "My first note",
        date: "2024-10-01",
        tags: [],
        featured: false,
        body: noteBodyZhTW,
      }],
      ["en", {
        title: "Hello World",
        slug: { _type: "slug", current: "hello-world" },
        description: "My first note",
        date: "2024-10-01",
        tags: [],
        featured: false,
        body: noteBodyEn,
      }],
      ["ja", {
        title: "Hello World",
        slug: { _type: "slug", current: "hello-world" },
        description: "My first note",
        date: "2024-10-01",
        tags: [],
        featured: false,
        body: noteBodyJa,
      }],
    ],
  });
  console.log("  ✓ note: hello-world (zh-TW, en, ja)");
}

async function createProjectDocs() {
  console.log("\n🚀 Creating project documents...");

  // volleybro — zh-TW only
  await createI18nDocSet({
    baseId: "project-volleybro",
    type: "project",
    locales: [
      ["zh-TW", {
        title: "VolleyBro",
        slug: { _type: "slug", current: "volleybro" },
        description: "一款專為排球愛好者設計、簡單上手的比賽數據追蹤程式",
        date: "2023-09-15",
        tags: [tagRef("tag-react"), tagRef("tag-typescript"), tagRef("tag-clean-architecture"), tagRef("tag-mongodb"), tagRef("tag-pwa")],
        featured: true,
        order: 1,
        githubUrl: "https://github.com/andrewck24/volleybro",
        demoUrl: "https://volleybro.vercel.app",
        body: volleybroBodyZhTW,
      }],
    ],
  });
  console.log("  ✓ project: volleybro (zh-TW)");

  // portfolio-website — three locales (task 4.4: updated content)
  await createI18nDocSet({
    baseId: "project-portfolio-website",
    type: "project",
    locales: [
      ["zh-TW", {
        title: "個人作品集網站",
        slug: { _type: "slug", current: "portfolio-website" },
        description: "以 Next.js 16、Sanity.io 與 TypeScript 打造的全端作品集，展示專案、技能與職涯歷程",
        date: "2025-09-06",
        tags: [tagRef("tag-nextjs"), tagRef("tag-typescript"), tagRef("tag-sanity"), tagRef("tag-tailwind"), tagRef("tag-isr")],
        featured: true,
        order: 2,
        githubUrl: "https://github.com/andrewck24/andrewck24",
        demoUrl: "https://andrewck24.vercel.app",
        body: portfolioBodyZhTW,
      }],
      ["en", {
        title: "Personal Portfolio Website",
        slug: { _type: "slug", current: "portfolio-website" },
        description: "A full-stack portfolio built with Next.js 16, Sanity.io, and TypeScript",
        date: "2025-09-06",
        tags: [tagRef("tag-nextjs"), tagRef("tag-typescript"), tagRef("tag-sanity"), tagRef("tag-tailwind"), tagRef("tag-isr")],
        featured: true,
        order: 2,
        githubUrl: "https://github.com/andrewck24/andrewck24",
        demoUrl: "https://andrewck24.vercel.app",
        body: portfolioBodyEn,
      }],
      ["ja", {
        title: "個人ポートフォリオサイト",
        slug: { _type: "slug", current: "portfolio-website" },
        description: "Next.js 16、Sanity.io、TypeScript で構築されたフルスタックポートフォリオ",
        date: "2025-09-06",
        tags: [tagRef("tag-nextjs"), tagRef("tag-typescript"), tagRef("tag-sanity"), tagRef("tag-tailwind"), tagRef("tag-isr")],
        featured: true,
        order: 2,
        githubUrl: "https://github.com/andrewck24/andrewck24",
        demoUrl: "https://andrewck24.vercel.app",
        body: portfolioBodyJa,
      }],
    ],
  });
  console.log("  ✓ project: portfolio-website (zh-TW, en, ja) [task 4.4: Sanity+ISR content]");

  // music-hits — zh-TW only
  await createI18nDocSet({
    baseId: "project-music-hits",
    type: "project",
    locales: [
      ["zh-TW", {
        title: "Music Hits",
        slug: { _type: "slug", current: "music-hits" },
        description: "音樂特徵與流行趨勢預測平台",
        date: "2025-12-03",
        tags: [tagRef("tag-react"), tagRef("tag-cloudflare"), tagRef("tag-machine-learning"), tagRef("tag-i18n")],
        featured: true,
        order: 3,
        githubUrl: "https://github.com/andrewck24/music-hits",
        demoUrl: "https://music-hits.andrewck24.workers.dev",
        body: musicHitsBodyZhTW,
      }],
    ],
  });
  console.log("  ✓ project: music-hits (zh-TW)");
}

async function main() {
  console.log("🌿 Starting Sanity content migration...");
  console.log(`  Project: ${PROJECT_ID} / ${DATASET}`);

  await createTagDocs();
  await createAboutDocs();
  await createNoteDocs();
  await createProjectDocs();

  console.log("\n✅ Migration complete!");
  console.log("   Remember to delete the andrewck24-migration token from Sanity settings.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
