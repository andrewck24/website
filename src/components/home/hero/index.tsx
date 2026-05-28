import { CtaButtons } from "@/components/home/hero/cta-buttons";
import { TerminalAnimation } from "@/components/home/hero/terminal-animation";
import { profileData } from "@/lib/data/profile";
import { socialLinks } from "@/lib/data/social-links";

interface ProfileHeroProps {
  locale: string;
}

export function ProfileHero({ locale }: ProfileHeroProps) {
  const profile =
    profileData[locale as keyof typeof profileData] || profileData["zh-TW"];
  return (
    <section
      data-testid="profile-hero-section"
      className="relative z-10 flex size-full min-h-[65vh] flex-col items-center justify-start p-4 pt-16 md:p-6"
    >
      <div className="flex h-full flex-1 flex-col items-center justify-start gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
        {/* Main Content */}
        <div className="flex flex-col justify-center gap-6 text-center lg:h-full lg:text-left">
          <div className="space-y-4">
            <h1
              className="from-foreground to-foreground/70 bg-linear-to-b bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl xl:text-8xl"
              data-testid="profile-name"
            >
              {profile.name}
            </h1>
            <h2
              className="from-primary via-primary/80 to-primary/60 bg-linear-to-r bg-clip-text text-xl font-semibold text-transparent md:text-2xl lg:text-3xl"
              data-testid="profile-title"
            >
              {profile.title}
            </h2>
          </div>
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <p
              className="text-foreground/80 text-lg/relaxed md:text-xl"
              data-testid="profile-bio"
            >
              {profile.bio}
            </p>
          </div>
          <CtaButtons locale={locale} social={socialLinks} />
        </div>
        <TerminalAnimation />
      </div>
    </section>
  );
}
