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
  "zh-TW": { title: "找不到這個專案", back: "返回專案列表" },
  en: { title: "Project not found", back: "Back to Projects" },
  ja: {
    title: "このプロジェクトは見つかりません",
    back: "プロジェクト一覧に戻る",
  },
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
        <Link href={`/${locale}/projects`}>{back}</Link>
      </EmptyContent>
    </Empty>
  );
}
