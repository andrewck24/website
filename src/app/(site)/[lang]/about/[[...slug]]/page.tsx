import { BusinessCard } from "@/components/about/business-card";
import { portableTextComponents } from "@/components/mdx/portable-text";
import { client } from "@/lib/sanity/client";
import { getAboutQuery } from "@/lib/sanity/queries";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/article";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ lang: string; slug?: string[] }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  const about = await client.fetch(getAboutQuery, { locale: lang as Locale });

  if (!about) notFound();

  return (
    <div
      data-testid="about-page"
      className={cn(
        "relative backdrop-blur-lg",
        "flex flex-col items-center justify-start gap-4"
      )}
    >
      <BusinessCard
        lang={lang as "zh-TW" | "en" | "ja"}
        pdfUrls={{
          zh: about.resumePdfZhUrl ?? null,
          en: about.resumePdfEnUrl ?? null,
        }}
      />
      <article className="prose bg-background/50 prose-neutral dark:prose-invert my-4 flex-2 rounded-2xl px-0 py-6 lg:px-8 lg:py-12">
        {about?.body && (
          <PortableText
            value={about.body}
            components={portableTextComponents}
          />
        )}
      </article>
    </div>
  );
}

export function generateStaticParams() {
  return [{ lang: "zh-TW" }, { lang: "en" }, { lang: "ja" }];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const titles: Record<string, string> = {
    "zh-TW": "關於我",
    en: "About",
    ja: "私について",
  };
  return {
    title: titles[lang] ?? "About",
    alternates: {
      canonical: `/${lang}/about`,
      languages: {
        "zh-TW": "/zh-TW/about",
        en: "/en/about",
        ja: "/ja/about",
        "x-default": "/zh-TW/about",
      },
    },
  };
}
