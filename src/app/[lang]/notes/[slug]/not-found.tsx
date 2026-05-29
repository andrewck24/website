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
  "zh-TW": { title: "找不到這篇筆記", back: "返回筆記列表" },
  en: { title: "Note not found", back: "Back to Notes" },
  ja: { title: "このノートは見つかりません", back: "ノート一覧に戻る" },
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
        <Link href={`/${locale}/notes`}>{back}</Link>
      </EmptyContent>
    </Empty>
  );
}
