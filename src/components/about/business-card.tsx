"use client";

import { ResumeDialogTrigger } from "@/components/about/resume-dialog-trigger";
import { CakeIcon } from "@/components/icons/cake-icon";
import { GithubIcon } from "@/components/icons/github-icon";
import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/types/article";
import Link from "next/link";

interface BusinessCardProps {
  lang: Locale;
  pdfUrls: { tw: string | null; en: string | null; ja: string | null };
}

const hasPdf = (pdfUrls: BusinessCardProps["pdfUrls"]) =>
  pdfUrls.tw !== null || pdfUrls.en !== null || pdfUrls.ja !== null;

export function BusinessCard({ lang, pdfUrls }: BusinessCardProps) {
  return (
    <div
      data-testid="about-business-card"
      className="from-gradient-3 to-gradient-5 w-full rounded-2xl bg-linear-to-br px-4 pt-12 pb-4"
    >
      <h1 className="mb-6 scroll-m-20 text-4xl font-bold tracking-tight text-[oklch(0.984_0.003_247.858)]">
        Andrew Tseng
      </h1>
      <p className="mb-4 text-[oklch(0.704_0.04_256.788)]">Software Engineer</p>
      <div className="flex flex-row items-center justify-end gap-1">
        <Button variant="ghost" size="icon" asChild>
          <Link href="https://github.com/andrewck24">
            <GithubIcon />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="https://www.linkedin.com/in/andrewck24/">
            <LinkedinIcon />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="https://www.cake.me/me/andrewck24">
            <CakeIcon className="text-foreground" />
          </Link>
        </Button>
        {hasPdf(pdfUrls) && (
          <ResumeDialogTrigger lang={lang} pdfUrls={pdfUrls} />
        )}
      </div>
    </div>
  );
}
