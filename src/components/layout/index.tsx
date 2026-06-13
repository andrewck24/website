"use client";
import { Navbar } from "@/components/layout/navbar";
import { useEffect, useState, type ReactNode } from "react";

export function NavLayout({
  lang,
  children,
}: {
  lang: string;
  children: ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  // 直接以 scrollY 判定捲動狀態，取代原本的 IntersectionObserver + sentinel：
  // mobile 動態網址列收合/展開會改變 visual viewport，使 sentinel 在「捲回頂端」時
  // 不一定再回報 isIntersecting → isScrolled 卡在 true。scrollY 在頂端必為 0，保證重置。
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Navbar lang={lang} isScrolled={isScrolled} />
      <main className="flex w-full max-w-7xl flex-1 flex-col items-center justify-start px-6 lg:px-12">
        {/* navbar 下方間距：把內容推到固定 navbar 之下 */}
        <div className="mb-[calc(var(--navbar-scroll-offset)-1px)] h-px shrink-0" />
        {children}
      </main>
    </>
  );
}
