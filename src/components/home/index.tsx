import { CtaButtons } from "@/components/home/cta-buttons";
import { MeshGradientBackground } from "@/components/home/mesh-gradient";
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
      className="my-auto size-full px-4 pb-(--navbar-scroll-offset)"
    >
      <MeshGradientBackground />
      <div className="relative flex size-full flex-col items-center justify-start gap-8 md:flex-row md:items-center md:gap-12">
        {/* Main Content */}
        <div className="flex grow-2 flex-col justify-center gap-6 text-center md:h-full md:text-left">
          <div className="space-y-4">
            <p className="text-alt-hairline-strong font-mono text-xs tracking-widest uppercase">
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
              className="text-alt-hairline-strong text-base md:text-lg lg:text-xl"
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
      </div>
    </section>
  );
}
