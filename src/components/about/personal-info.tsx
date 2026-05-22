import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

export function PersonalInfo() {
  return (
    <div
      data-testid="about-personal-info"
      className="top-26 flex w-full flex-1 flex-col items-center justify-start gap-4 lg:sticky lg:h-[calc(100vh-6.5rem)] lg:pb-12"
    >
      <div
        data-testid="about-name-section"
        className="from-gradient-3 to-gradient-5 w-full rounded-2xl bg-linear-to-br px-4 pt-12"
      >
        <h1 className="mb-6 scroll-m-20 text-4xl font-bold tracking-tight">
          Andrew Tseng
        </h1>
        <p className="text-muted-foreground mb-10">Software Engineer</p>
      </div>
      <div
        data-testid="about-social-links"
        className="flex w-full flex-1 flex-row items-end justify-end gap-1 px-4"
      >
        <Button variant="ghost" size="icon" asChild>
          <Link href="https://github.com/andrewck24">
            <Github />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="https://www.linkedin.com/in/li-wei-tseng-andrew/">
            <Linkedin />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="https://www.cake.me/me/andrewHB614">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(-2, 4) scale(1.2, 1.2)">
                <path
                  d="M22.5217 7.07507V17.0435C16.8406 16.4368 11.1594 15.8281 5.47827 15.2194V5.25913C5.47827 5.25913 5.47827 5.2571 5.4803 5.25507C6.45016 3.07594 9.12436 1.20725 12.7846 0L22.5217 7.07507Z"
                  fill="#FFFFFF"
                />
              </g>
            </svg>
          </Link>
        </Button>
      </div>
    </div>
  );
}
