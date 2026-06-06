export function MeshGradientBackground() {
  return (
    <svg
      className="absolute inset-0 size-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1400 600"
      aria-hidden="true"
    >
      <rect width="1400" height="600" fill="var(--alt-mesh-bg)" />
      <defs>
        <filter
          id="home-mesh-blur"
          filterUnits="userSpaceOnUse"
          x="-1200"
          y="-1200"
          width="3800"
          height="3000"
        >
          <feGaussianBlur stdDeviation="66" />
        </filter>
        <filter id="home-mesh-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.74"
            numOctaves={3}
            stitchTiles="stitch"
          />
          <feBlend in="SourceGraphic" mode="overlay" />
        </filter>
      </defs>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <g
        filter="url(#home-mesh-blur)"
        style={{ mixBlendMode: "var(--alt-mesh-blend)" as any }}
      >
        {/* outer loop — blue, 13 s */}
        <ellipse
          cx="980"
          cy="320"
          rx="440"
          ry="300"
          fill="var(--alt-grad-dev-s)"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            willChange: "transform",
            animation: "var(--animate-mesh-a)",
          }}
        />
        {/* inner loop — violet, 11 s */}
        <ellipse
          cx="940"
          cy="290"
          rx="300"
          ry="210"
          fill="var(--alt-grad-prev-s)"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            willChange: "transform",
            animation: "var(--animate-mesh-b)",
          }}
        />
        {/* cross-sweep — teal rotated rect, 10 s */}
        <rect
          x="660"
          y="50"
          width="640"
          height="260"
          rx="90"
          fill="var(--alt-grad-dev-e)"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            willChange: "transform",
            animation: "var(--animate-mesh-c)",
          }}
        />
        {/* focal core — magenta, 9 s */}
        <ellipse
          cx="970"
          cy="295"
          rx="175"
          ry="130"
          fill="var(--alt-grad-prev-e)"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            willChange: "transform",
            animation: "var(--animate-mesh-d)",
          }}
        />
        {/* amber polygon — ship-e, 12 s */}
        <polygon
          points="820,95 1260,75 1390,360 1120,520 730,450 700,220"
          fill="var(--alt-grad-ship-e)"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            willChange: "transform",
            animation: "var(--animate-mesh-e)",
          }}
        />
        {/* coral ellipse — ship-s, 11 s */}
        <ellipse
          cx="860"
          cy="470"
          rx="320"
          ry="170"
          fill="var(--alt-grad-ship-s)"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            willChange: "transform",
            animation: "var(--animate-mesh-f)",
          }}
        />
      </g>
      <rect
        width="1400"
        height="600"
        fill="#888"
        filter="url(#home-mesh-noise)"
        style={{ mixBlendMode: "overlay", opacity: 0.055 }}
      />
    </svg>
  );
}
