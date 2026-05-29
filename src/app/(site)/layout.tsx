import "@/app/globals.css";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/provider";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
