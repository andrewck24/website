"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Component, Suspense, useState } from "react";
import { ResumeDialog } from "./resume-dialog";

type Lang = "zh-TW" | "en" | "ja";

interface Props {
  lang: Lang;
  pdfUrls: { zh: string | null; en: string | null };
}

const triggerLabel: Record<Lang, string> = {
  "zh-TW": "履歷 PDF",
  en: "Resume PDF",
  ja: "履歴書PDF",
};

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

export function ResumeTriggerSkeleton() {
  return <Skeleton className="h-9 w-24 rounded-md" />;
}

function ResumeDialogWithParamsInner({ lang, pdfUrls }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const openedViaParam = searchParams.get("resume") === "open";
  const [open, setOpen] = useState(openedViaParam);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && openedViaParam) {
      router.replace(pathname, { scroll: false });
    }
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        {triggerLabel[lang]}
      </Button>
      <ResumeDialog
        lang={lang}
        pdfUrls={pdfUrls}
        open={open}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}

export function ResumeDialogWithParams(props: Props) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ResumeTriggerSkeleton />}>
        <ResumeDialogWithParamsInner {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
