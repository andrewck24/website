import { LangSetter } from "@/components/lang-setter";
import { NavLayout } from "@/components/layout";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const SUPPORTED_LOCALES = ["zh-TW", "en", "ja"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<string, string> = {
    "zh-TW": "Andrew Tseng - Software Engineer",
    en: "Andrew Tseng - Software Engineer",
    ja: "Andrew Tseng - Software Engineer",
  };

  const descriptions: Record<string, string> = {
    "zh-TW":
      "專精於 React、Node.js 和現代網頁技術的軟體工程師。個人作品集與技術部落格。",
    en: "Software developer specializing in React, Node.js, and modern web technologies. Portfolio and technical blog.",
    ja: "React、Node.js、モダンウェブ技術を専門とするソフトウェア開発者。ポートフォリオと技術ブログ。",
  };

  const title = titles[lang] || titles["zh-TW"];
  const description = descriptions[lang] || descriptions["zh-TW"];

  return {
    metadataBase: new URL("https://andrewck24.vercel.app"),
    title: { template: `%s | ${title}`, default: title },
    description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        "zh-TW": "/zh-TW",
        en: "/en",
        ja: "/ja",
        "x-default": "/zh-TW",
      },
    },
    keywords: [
      "Full-stack Developer",
      "React",
      "Node.js",
      "TypeScript",
      "Next.js",
      "Front-end Development",
      "Portfolio",
      "Taiwan",
    ],
    authors: [{ name: "Andrew Tseng", url: "https://andrewck24.vercel.app" }],
    creator: "Andrew Tseng",
    openGraph: {
      type: "website",
      locale: lang === "zh-TW" ? "zh_TW" : lang === "ja" ? "ja_JP" : "en_US",
      title,
      description,
      siteName: title,
      url: "https://andrewck24.vercel.app",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@andrewck24",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((language) => ({ lang: language }));
}

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

const jsonLd = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Andrew Tseng",
    jobTitle: "Software Engineer",
    url: "https://andrewck24.vercel.app",
    sameAs: [
      "https://github.com/andrewck24",
      "https://www.linkedin.com/in/andrewck24",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Andrew Tseng",
    url: "https://andrewck24.vercel.app",
  },
]);

export default async function Layout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <LangSetter lang={lang} />
      <div className="flex min-h-dvh flex-col items-center">
        <NavLayout lang={lang}>{children}</NavLayout>
      </div>
    </div>
  );
}
