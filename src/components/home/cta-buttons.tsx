import { GithubAnimatedIcon } from "@/components/icons/github-icon";
import { LinkedInAnimatedIcon } from "@/components/icons/linkedin-icon";
import { Button } from "@/components/ui/button";
import type { SocialLinks as SocialLinksType } from "@/types/profile";
import Link from "next/link";

interface CtaButtonsProps {
  locale: string;
  social: SocialLinksType;
}

export function CtaButtons({ locale, social }: CtaButtonsProps) {
  const socialPlatforms = [
    {
      name: "GitHub",
      url: social.github,
      icon: GithubAnimatedIcon,
      testId: "github-link",
    },
    {
      name: "LinkedIn",
      url: social.linkedin,
      icon: LinkedInAnimatedIcon,
      testId: "linkedin-link",
    },
  ];

  const getProjectsText = () => {
    switch (locale) {
      case "zh-TW":
        return "檢視作品集";
      case "ja":
        return "ポートフォリオを見る";
      default:
        return "View Portfolio";
    }
  };

  const getAboutText = () => {
    switch (locale) {
      case "zh-TW":
        return "關於我";
      case "ja":
        return "私について";
      default:
        return "About Me";
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start"
      data-testid="cta-buttons"
    >
      <div className="flex items-center justify-center gap-4 max-sm:w-full">
        <Button asChild size="lg" variant="default" className="max-sm:flex-1">
          <Link href={`/${locale}/projects`} data-testid="view-portfolio-btn">
            {getProjectsText()}
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="max-sm:flex-1">
          <Link href={`/${locale}/about`} data-testid="view-about-btn">
            {getAboutText()}
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-center gap-4">
        {socialPlatforms.map(({ name, url, icon: Icon, testId }) => {
          if (!url) return null;

          return (
            <Link
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-foreground hover:text-foreground flex items-center justify-center transition-colors"
              aria-label={name}
              data-testid={testId}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
