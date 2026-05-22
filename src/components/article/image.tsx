import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/types/article";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ViewTransition } from "react";

export interface ArticleImageProps {
  slug: string;
  title: string;
  coverImage?: SanityImage;
  className?: string;
  priority?: boolean;
}

export function ArticleImage({
  slug,
  title,
  coverImage,
  className,
  priority = false,
}: ArticleImageProps) {
  const viewTransitionName = `article-image-${slug}`;
  const imageUrl = coverImage
    ? urlFor(coverImage).width(896).height(504).fit("crop").url()
    : null;

  return (
    <ViewTransition name={viewTransitionName}>
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-lg",
          className
        )}
        data-testid="article-image-container"
        style={{ viewTransitionName }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title || "Article image"}
            fill
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : "lazy"}
            className="m-0 object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        ) : (
          <FallbackGradient />
        )}
      </div>
    </ViewTransition>
  );
}

function FallbackGradient() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    />
  );
}
