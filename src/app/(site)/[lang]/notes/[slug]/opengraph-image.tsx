import { getNote } from "@/lib/data/notes";
import { urlFor } from "@/lib/sanity/image";
import type { Locale } from "@/types/article";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const note = await getNote(lang as Locale, slug);

  const fallback = (
    <div
      style={{
        fontSize: 64,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
      }}
    >
      <div>{note?.title || "Note"}</div>
      <div style={{ fontSize: 32, marginTop: 16 }}>Andrew Tseng</div>
    </div>
  );

  if (!note?.coverImage) {
    return new ImageResponse(fallback, { ...size });
  }

  const imageUrl = urlFor(note.coverImage)
    .width(1200)
    .height(630)
    .fit("crop")
    .url();

  return new ImageResponse(
    <img
      src={imageUrl}
      alt={note.title}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />,
    { ...size }
  );
}
