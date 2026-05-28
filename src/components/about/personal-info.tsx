import { CakeIcon } from "@/components/icons/cake-icon";
import { GithubIcon } from "@/components/icons/github-icon";
import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { Button } from "@/components/ui/button";
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
        <h1 className="mb-6 scroll-m-20 text-4xl font-bold tracking-tight text-[oklch(0.984_0.003_247.858)]">
          Andrew Tseng
        </h1>
        <p className="mb-10 text-[oklch(0.704_0.04_256.788)]">
          Software Engineer
        </p>
      </div>
      <div
        data-testid="about-social-links"
        className="flex w-full flex-1 flex-row items-end justify-end gap-1 px-4"
      >
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
      </div>
    </div>
  );
}
