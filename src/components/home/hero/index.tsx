import { MeshGradientBackground } from "@/components/home/mesh-gradient";
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
      className="relative z-10 flex size-full min-h-[65vh] flex-col items-center justify-start overflow-hidden p-4 pt-16 md:p-6"
    >
      <MeshGradientBackground />
      <div className="flex h-full flex-1 flex-col items-center justify-start gap-8 md:grid md:grid-cols-2 md:items-start md:gap-12">
        {/* Main Content */}
        <div className="flex flex-col justify-center gap-6 text-center md:h-full md:text-left">
          <div className="space-y-4">
            <p className="font-mono text-xs tracking-widest text-(--alt-hairline-strong) uppercase">
              Portfolio · Taipei, Taiwan
            </p>
            <h1
              className="font-bold tracking-tight text-(--alt-ink)"
              style={{
                fontSize: "clamp(36px, 10vw, 56px)",
              }}
              data-testid="profile-name"
            >
              <span className="md:hidden">{profile.name}</span>
              <span
                className="hidden md:inline"
                style={{ fontSize: "clamp(48px, 5.5vw, 80px)" }}
              >
                {profile.name}
              </span>
            </h1>
            <h2
              className="text-xl font-semibold text-(--alt-hairline-strong) md:text-2xl lg:text-3xl"
              data-testid="profile-title"
            >
              {profile.title}
            </h2>
          </div>
          <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
            <p
              className="text-foreground text-lg/relaxed md:text-xl"
              data-testid="profile-bio"
            >
              {profile.bio}
            </p>
          </div>
          <CtaButtons locale={locale} social={socialLinks} />
        </div>
        <div className="hidden md:block">
          <TerminalAnimation />
        </div>
      </div>
    </section>
  );
}
