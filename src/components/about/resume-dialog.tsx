"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Locale } from "@/types/article";

interface ResumeDialogProps {
  lang: Locale;
  pdfUrls: { tw: string | null; en: string | null; ja: string | null };
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const i18n: Record<
  Locale,
  { title: string; description: string; tw: string; en: string; ja: string }
> = {
  "zh-TW": {
    title: "下載履歷 PDF",
    description: "選擇語言版本",
    tw: "中文",
    en: "英文",
    ja: "日文",
  },
  en: {
    title: "Download Resume PDF",
    description: "Choose your preferred language",
    tw: "Traditional Chinese",
    en: "English",
    ja: "Japanese",
  },
  ja: {
    title: "履歴書PDFをダウンロード",
    description: "言語を選択してください",
    tw: "台湾華語",
    en: "英語",
    ja: "日本語",
  },
};

export function ResumeDialog({
  lang,
  pdfUrls,
  defaultOpen = false,
  open,
  onOpenChange,
}: ResumeDialogProps) {
  const t = i18n[lang];
  const controlledProps =
    open !== undefined ? { open, onOpenChange } : { defaultOpen };

  return (
    <Dialog {...controlledProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          {pdfUrls.tw && (
            <a
              href={pdfUrls.tw}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              {t.tw}
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
          {pdfUrls.ja && (
            <a
              href={pdfUrls.ja}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              {t.ja}
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
