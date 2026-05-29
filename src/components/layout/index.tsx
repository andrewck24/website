"use client";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";

export function NavLayout({
  lang,
  children,
}: {
  lang: string;
  children: ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar lang={lang} isScrolled={isScrolled} />
      <main className="flex w-full max-w-7xl flex-1 flex-col items-center justify-start px-6 lg:px-12">
        <div
          id="nav-sentinel"
          ref={sentinelRef}
          className="h-[88px] shrink-0"
        />
        {children}
      </main>
    </>
  );
}
