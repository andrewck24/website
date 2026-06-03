"use client";

import { CakeIcon } from "@/components/icons/cake-icon";
import { GithubIcon } from "@/components/icons/github-icon";
import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ResumeDialogWithParams } from "./resume-dialog-with-params";

type Lang = "zh-TW" | "en" | "ja";

interface BusinessCardProps {
  lang: Lang;
  pdfUrls: { zh: string | null; en: string | null };
}

const hasPdf = (pdfUrls: BusinessCardProps["pdfUrls"]) =>
  pdfUrls.zh !== null || pdfUrls.en !== null;

export function BusinessCard({ lang, pdfUrls }: BusinessCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const sentinel = sentinelRef.current;
    if (!wrapper || !sentinel) return;

    const navBottom =
      document.querySelector("nav")?.getBoundingClientRect().bottom ?? 72;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          wrapper.setAttribute("data-collapsed", "true");
        } else {
          wrapper.removeAttribute("data-collapsed");
        }
      },
      { rootMargin: `-${navBottom}px 0px 0px 0px`, threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    if (wrapperRef.current?.hasAttribute("data-collapsed")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={wrapperRef}
      data-testid="about-business-card"
      onClick={handleClick}
      className={[
        "from-gradient-3 to-gradient-5 w-full rounded-2xl bg-linear-to-br transition-all duration-200",
        "px-4 pt-12 pb-4",
        "data-[collapsed]:sticky data-[collapsed]:top-[calc(var(--navbar-top-gap,1rem)+var(--navbar-height,3.5rem))] data-[collapsed]:z-50",
        "data-[collapsed]:cursor-pointer",
        "data-[collapsed]:flex data-[collapsed]:flex-row data-[collapsed]:items-center data-[collapsed]:gap-3",
        "data-[collapsed]:px-4 data-[collapsed]:pt-4 data-[collapsed]:pb-4",
      ].join(" ")}
    >
      <div ref={sentinelRef} data-sentinel className="h-0" />
      <h1 className="mb-6 scroll-m-20 text-4xl font-bold tracking-tight text-[oklch(0.984_0.003_247.858)] in-data-collapsed:mb-0 in-data-collapsed:text-xl">
        Andrew Tseng
      </h1>
      <p className="mb-4 text-[oklch(0.704_0.04_256.788)] in-data-collapsed:mb-0 max-lg:in-data-collapsed:hidden">
        Software Engineer
      </p>
      <div className="flex flex-row items-center justify-end gap-1 in-data-collapsed:ml-auto max-lg:in-data-collapsed:hidden">
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
          <ResumeDialogWithParams lang={lang} pdfUrls={pdfUrls} />
        )}
      </div>
    </div>
  );
}
