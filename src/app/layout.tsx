import { Inter, Ubuntu_Mono } from "next/font/google";
import { getLocaleFromHeaders } from "@/lib/locale-from-headers";
import type { ReactNode } from "react";

const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ubuntu-mono",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const lang = await getLocaleFromHeaders();

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${ubuntuMono.variable} ${inter.variable}`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
