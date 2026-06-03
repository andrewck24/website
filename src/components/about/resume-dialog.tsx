"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Lang = "zh-TW" | "en" | "ja";

interface ResumeDialogProps {
  lang: Lang;
  pdfUrls: { zh: string | null; en: string | null };
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const i18n: Record<
  Lang,
  { title: string; description: string; zh: string; en: string }
> = {
  "zh-TW": {
    title: "下載履歷 PDF",
    description: "選擇語言版本",
    zh: "中文",
    en: "英文",
  },
  en: {
    title: "Download Resume PDF",
    description: "Choose your preferred language",
    zh: "Traditional Chinese",
    en: "English",
  },
  ja: {
    title: "履歴書PDFをダウンロード",
    description: "言語を選択してください",
    zh: "台湾華語",
    en: "英語",
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
  );
}
