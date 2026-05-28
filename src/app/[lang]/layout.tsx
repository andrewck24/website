import "@/app/globals.css";
import { LangSetter } from "@/components/lang-setter";
import { NavLayout } from "@/components/layout/home";
import { Provider } from "@/components/provider";
import { baseOptions } from "@/lib/layout.shared";
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
      images: [
        {
          url: "/images/profile/avatar.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@andrewck24",
      images: ["/images/profile/avatar.jpg"],
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

export default async function Layout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  return (
    <div>
      <LangSetter lang={lang} />
      <Provider>
        <div className="flex min-h-screen flex-col items-center">
          <NavLayout {...baseOptions(lang)}>{children}</NavLayout>
        </div>
      </Provider>
    </div>
  );
}
