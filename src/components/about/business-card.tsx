"use client";

import { CakeIcon } from "@/components/icons/cake-icon";
import { GithubIcon } from "@/components/icons/github-icon";
import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

type Lang = "zh-TW" | "en" | "ja";

interface BusinessCardProps {
  lang: Lang;
  pdfUrls: { zh: string | null; en: string | null };
}

const pdfI18n: Record<
  Lang,
  {
    trigger: string;
    title: string;
    description: string;
    zh: string;
    en: string;
  }
> = {
  "zh-TW": {
    trigger: "履歷 PDF",
    title: "下載履歷 PDF",
    description: "選擇語言版本",
    zh: "中文",
    en: "英文",
  },
  en: {
    trigger: "Resume PDF",
    title: "Download Resume PDF",
    description: "Choose your preferred language",
    zh: "Traditional Chinese",
    en: "English",
  },
  ja: {
    trigger: "履歴書PDF",
    title: "履歴書PDFをダウンロード",
    description: "言語を選択してください",
    zh: "台湾華語",
    en: "英語",
  },
};

const hasPdf = (pdfUrls: BusinessCardProps["pdfUrls"]) =>
  pdfUrls.zh !== null || pdfUrls.en !== null;

export function BusinessCard({ lang, pdfUrls }: BusinessCardProps) {
  const t = pdfI18n[lang];

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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                {t.trigger}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.title}</DialogTitle>
                <DialogDescription>{t.description}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3 pt-2">
                {pdfUrls.zh && (
                  <a
                    href={pdfUrls.zh}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline"
                  >
                    {t.zh}
                  </a>
                )}
                {pdfUrls.en && (
                  <a
                    href={pdfUrls.en}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline"
                  >
                    {t.en}
                  </a>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
