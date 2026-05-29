import { getProject } from "@/lib/data/projects";
import { urlFor } from "@/lib/sanity/image";
import type { Locale } from "@/types/article";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 675 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const project = await getProject(lang as Locale, slug);

  const fallback = (
    <div
      style={{
        fontSize: 64,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
      }}
    >
      {project?.title || "Project"}
    </div>
  );

  if (!project?.coverImage) {
    return new ImageResponse(fallback, { ...size });
  }

  const imageUrl = urlFor(project.coverImage)
    .width(1200)
    .height(675)
    .fit("crop")
    .url();

  return new ImageResponse(
    <img
      src={imageUrl}
      alt={project.title}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />,
    { ...size }
  );
}
