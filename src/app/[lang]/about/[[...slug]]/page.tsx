import { PersonalInfo } from "@/components/about/personal-info";
import { portableTextComponents } from "@/components/mdx/portable-text";
import { client } from "@/lib/sanity/client";
import { getAboutQuery } from "@/lib/sanity/queries";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/article";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ lang: string; slug?: string[] }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  const about = await client.fetch(getAboutQuery, { locale: lang as Locale });

  return (
    <div
      data-testid="about-page"
      className={cn(
        "relative backdrop-blur-lg",
        "flex flex-col items-center justify-start gap-4 lg:flex-row lg:items-start lg:justify-center"
      )}
    >
      <PersonalInfo />
      <article className="prose border-border bg-background/50 prose-neutral dark:prose-invert my-4 flex-2 rounded-2xl border px-4 py-12 lg:px-8">
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
  return { title: titles[lang] ?? "About" };
}
