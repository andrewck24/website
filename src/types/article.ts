import type { PortableTextBlock } from "@portabletext/react";

// ============================================================================
// Locale Types
// ============================================================================

export const SUPPORTED_LOCALES = ["zh-TW", "en", "ja"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// ============================================================================
// Sanity Image Type
// ============================================================================

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

// ============================================================================
// Tag Type (Sanity reference expansion)
// ============================================================================

export interface ArticleTag {
  title: string;
  slug: string;
}

// ============================================================================
// Article Interfaces
// ============================================================================

export interface BaseArticle {
  title: string;
  description?: string;
  date: string;
  tags: ArticleTag[];
  featured: boolean;
  coverImage?: SanityImage;
}

export interface ProjectArticle extends BaseArticle {
  githubUrl?: string;
  demoUrl?: string;
  order?: number;
}

export type NoteArticle = BaseArticle;

// ============================================================================
// Data Layer Types
// ============================================================================

export type ArticleCardData<T extends BaseArticle = BaseArticle> = T & {
  slug: string;
  locale: Locale;
  url: string;
};

export type ArticlePageData<T extends BaseArticle = BaseArticle> = T & {
  slug: string;
  locale: Locale;
  url: string;
  body: PortableTextBlock[];
};
