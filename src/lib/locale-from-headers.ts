import { headers } from "next/headers";

export async function getLocaleFromHeaders(): Promise<string> {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  return pathname.split("/")[1] || "zh-TW";
}
