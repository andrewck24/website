/**
 * Tag Utility Functions (T013)
 *
 * 標籤處理工具函式，用於標籤正規化、驗證和過濾
 *
 * @see specs/004-mdx-frontmatter-1/contracts/tag-system.ts
 */

// ============================================================================
// Constants
// ============================================================================

/**
 * 建議的標籤列表
 * 與 contracts/tag-system.ts 中的 SUGGESTED_TAGS 相同
 */
export const SUGGESTED_TAGS = [
  // Frontend Frameworks & Libraries
  "next.js",
  "react",
  "vue",
  "svelte",

  // Languages
  "typescript",
  "javascript",
  "python",
  "rust",

  // Styling
  "tailwind",
  "css",
  "scss",

  // Backend & APIs
  "node.js",
  "api",
  "graphql",
  "rest",

  // Database & Storage
  "database",
  "postgresql",
  "mongodb",
  "redis",

  // DevOps & Tools
  "docker",
  "ci-cd",
  "git",

  // Testing
  "testing",
  "jest",
  "playwright",

  // Content Types
  "tutorial",
  "guide",
  "reference",
  "case-study",

  // Topics
  "architecture",
  "performance",
  "security",
  "accessibility",
] as const;

/**
 * 建議標籤型別（用於型別檢查）
 */
export type SuggestedTag = (typeof SUGGESTED_TAGS)[number];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * 正規化標籤字串為統一格式
 *
 * 規則：
 * - 轉換為小寫
 * - 將空格替換為連字號
 * - 修剪前後空白
 *
 * @param tag - 原始標籤字串
 * @returns 正規化後的標籤字串
 *
 * @example
 * ```typescript
 * normalizeTag("Next.js") // => "next.js"
 * normalizeTag("Type Script") // => "type-script"
 * normalizeTag(" react ") // => "react"
 * ```
 */
export function normalizeTag(tag: string): string {
  return tag
    .trim() // 移除前後空白
    .toLowerCase() // 轉換為小寫
    .replace(/\s+/g, "-"); // 將空格替換為連字號
}

/**
 * 檢查標籤是否為建議標籤
 *
 * @param tag - 要檢查的標籤
 * @returns 是否為建議標籤
 *
 * @example
 * ```typescript
 * isSuggestedTag("next.js") // => true
 * isSuggestedTag("my-custom-tag") // => false
 * ```
 */
export function isSuggestedTag(tag: string): tag is SuggestedTag {
  return (SUGGESTED_TAGS as readonly string[]).includes(tag);
}

/**
 * 過濾有效標籤
 *
 * 規則：
 * - 移除空字串
 * - 移除僅包含空白的字串
 * - 對每個標籤套用正規化
 * - 移除重複標籤
 *
 * @param tags - 標籤陣列
 * @returns 過濾和正規化後的標籤陣列
 *
 * @example
 * ```typescript
 * filterValidTags(["next.js", "", " ", "typescript"]) // => ["next.js", "typescript"]
 * filterValidTags(["Next.js", "next.js"]) // => ["next.js"]
 * ```
 */
export function filterValidTags(tags: string[]): string[] {
  const normalized = tags
    .filter((tag) => tag.trim().length > 0) // 移除空字串和僅空白字串
    .map((tag) => normalizeTag(tag)); // 正規化每個標籤

  // 使用 Set 移除重複項，然後轉回陣列
  return Array.from(new Set(normalized));
}
