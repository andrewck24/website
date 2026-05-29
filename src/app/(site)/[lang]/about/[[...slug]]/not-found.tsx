"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyContent,
} from "@/components/ui/empty";

const labels: Record<string, { title: string; back: string }> = {
  "zh-TW": { title: "找不到關於頁面", back: "返回首頁" },
  en: { title: "About page not found", back: "Back to Home" },
  ja: { title: "Aboutページが見つかりません", back: "ホームに戻る" },
};

export default function NotFound() {
  const params = useParams();
  const locale = (params?.lang as string) ?? "zh-TW";
  const { title, back } = labels[locale] ?? labels["zh-TW"];

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Link href={`/${locale}`}>{back}</Link>
      </EmptyContent>
    </Empty>
  );
}
