import { ProfileHero } from "@/components/home/hero";

interface HomeProps {
  lang: string;
}

export function Home({ lang }: HomeProps) {
  return <ProfileHero locale={lang} />;
}
