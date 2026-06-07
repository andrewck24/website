export function MeshGradientBackground() {
  return (
    <svg
      className="fixed inset-0 -z-10 size-full"
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
            result="t"
          />
          <feBlend in="SourceGraphic" in2="t" mode="overlay" />
        </filter>
      </defs>
      <g filter="url(#home-mesh-blur)">
        <path
          d="M654,290 C718,158 898,114 1028,172 C1126,216 1152,316 1152,346 C1152,428 1088,494 898,476 C692,454 604,382 664,316 C724,258 654,290 654,290 Z"
          fill="var(--alt-grad-dev-s)"
          style={{
            opacity: "var(--alt-mesh-op-1)",
            transformBox: "fill-box",
            transformOrigin: "center",
            willChange: "transform",
            animation: "var(--animate-mesh-a)",
          }}
        />
        <path
          d="M798,254 C870,160 1034,150 1124,226 C1188,280 1172,366 1106,394 C1028,420 966,376 922,320 C888,282 798,254 798,254 Z"
          fill="var(--alt-grad-prev-s)"
          style={{
            opacity: "var(--alt-mesh-op-2)",
            transformBox: "fill-box",
            transformOrigin: "center",
            willChange: "transform",
            animation: "var(--animate-mesh-b)",
          }}
        />
        <path
          d="M460,432 L1024,132 L1168,232 L604,532 Z"
          fill="var(--alt-grad-dev-e)"
          style={{
            opacity: "var(--alt-mesh-op-3)",
            transformBox: "fill-box",
            transformOrigin: "center",
            willChange: "transform",
            animation: "var(--animate-mesh-c)",
          }}
        />
        <path
          d="M858,278 C922,210 1044,228 1100,292 C1160,360 1096,426 988,416 C888,408 804,336 858,278 Z"
          fill="var(--alt-grad-prev-e)"
          style={{
            opacity: "var(--alt-mesh-op-4)",
            transformBox: "fill-box",
            transformOrigin: "center",
            willChange: "transform",
            animation: "var(--animate-mesh-d)",
          }}
        />
        <polygon
          points="916,186 1110,190 1150,308 1070,406 898,360 844,254"
          fill="var(--alt-grad-ship-e)"
          style={{
            opacity: "var(--alt-mesh-op-5)",
            transformBox: "fill-box",
            transformOrigin: "center",
            willChange: "transform",
            animation: "var(--animate-mesh-e)",
          }}
        />
        <ellipse
          cx="758"
          cy="238"
          rx="178"
          ry="76"
          transform="rotate(-34 758 238)"
          fill="var(--alt-grad-ship-s)"
          style={{
            opacity: "var(--alt-mesh-op-6)",
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
        style={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mixBlendMode: "var(--alt-mesh-blend)" as any,
          opacity: "var(--alt-mesh-noise-opacity)",
        }}
      />
    </svg>
  );
}
