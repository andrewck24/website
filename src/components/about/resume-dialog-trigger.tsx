"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/types/article";
import React, { Component, Suspense, useState } from "react";
import { ResumeDialog } from "./resume-dialog";

interface Props {
  lang: Locale;
  pdfUrls: { tw: string | null; en: string | null; ja: string | null };
}

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

function ResumeDialogTriggerInner({ lang, pdfUrls }: Props) {
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
        <Download className="mr-1 size-4" /> resume
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

export function ResumeDialogTrigger(props: Props) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ResumeTriggerSkeleton />}>
        <ResumeDialogTriggerInner {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
