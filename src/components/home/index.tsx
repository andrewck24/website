import { CtaButtons } from "@/components/home/cta-buttons";
import { MeshGradientBackground } from "@/components/home/mesh-gradient";
import { TerminalAnimation } from "@/components/home/terminal-animation";
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
      className="relative z-10 my-auto size-full overflow-hidden px-4 pb-(--navbar-scroll-offset)"
    >
      <MeshGradientBackground />
      <div className="relative flex size-full flex-col items-center justify-start gap-8 md:flex-row md:items-center md:gap-12">
        {/* Main Content */}
        <div className="flex grow-2 flex-col justify-center gap-6 text-center md:h-full md:text-left">
          <div className="space-y-4">
            <p className="font-mono text-xs tracking-widest text-(--alt-hairline-strong) uppercase">
              {profile.location}
            </p>
            <h1
              className="text-foreground font-medium tracking-tight"
              style={{
                fontSize: "clamp(36px, 10vw, 56px)",
              }}
              data-testid="profile-name"
            >
              <span className="md:hidden">{profile.name}</span>
              <span
                className="hidden leading-none md:inline"
                style={{ fontSize: "clamp(48px, 5.5vw, 80px)" }}
              >
                {profile.name}
              </span>
            </h1>
            <h2
              className="text-base text-(--alt-hairline-strong) md:text-lg lg:text-xl"
              data-testid="profile-title"
            >
              {profile.title}
            </h2>
          </div>
          <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
            <p
              className="text-foreground text-base/relaxed md:text-lg"
              data-testid="profile-bio"
            >
              {profile.bio}
            </p>
          </div>
          <CtaButtons locale={locale} social={socialLinks} />
        </div>
        <TerminalAnimation className="min-h-75 w-full grow-3 md:h-full" />
      </div>
    </section>
  );
}
