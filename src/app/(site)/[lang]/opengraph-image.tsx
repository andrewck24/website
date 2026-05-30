import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const subtitles: Record<string, string> = {
    "zh-TW": "軟體工程師",
    en: "Software Engineer",
    ja: "ソフトウェアエンジニア",
  };

  const subtitle = subtitles[lang] ?? subtitles["en"];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
        color: "white",
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: "bold",
          letterSpacing: "-2px",
        }}
      >
        Andrew Tseng
      </div>
      <div
        style={{
          fontSize: 36,
          marginTop: 24,
          color: "#94a3b8",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          marginTop: 48,
          width: 60,
          height: 4,
          background: "linear-gradient(90deg, #667eea, #764ba2)",
          borderRadius: 2,
        }}
      />
    </div>,
    { ...size }
  );
}
