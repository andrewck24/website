/**
 * 方案 C：CSS filter:blur() 取代 SVG feGaussianBlur
 *
 * 原理：
 * - 原始方案：SVG feGaussianBlur 套用在「含有動畫內容的群組」上
 *   → 每幀動畫 = 濾鏡輸入改變 = 整個 blur 重算
 *
 * - 方案 C：CSS filter:blur() 套用在一個 div wrapper 上
 *   → 動畫形狀在 SVG 裡自由移動（無 SVG filter 屬性）
 *   → CSS blur 在 div 層級運算，瀏覽器可能走不同的優化路徑
 *   → 在行動裝置（尤其 iOS Safari）CSS blur 有時可以走 GPU Metal 加速路徑
 *     而 SVG feGaussianBlur 容易退回 CPU 軟體渲染
 *
 * 結構：
 * - Layer 1（z-20）：背景底色 div
 * - Layer 2（z-10）：CSS blur wrapper → SVG 含動畫形狀（無 SVG filter）
 * - Layer 3（z-10，DOM 後）：靜態噪點 SVG（feTurbulence 輸出可被永久快取）
 *
 * 邊緣處理：
 * - blur wrapper 延伸視窗外 80px → 形狀靠近邊緣時有足夠空間淡出，不被硬切
 * - 外層 overflow:hidden → 裁切回視窗範圍
 */
export function MeshGradientBackgroundC() {
  return (
    <>
      {/* Layer 1：背景底色（在所有效果層下方） */}
      <div
        className="fixed inset-0 -z-20"
        style={{ background: "var(--alt-mesh-bg)" }}
      />

      {/* Layer 2：CSS blur 包住動畫形狀 */}
      {/* 外層：裁切至視窗範圍 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* 內層：延伸至視窗外 80px
            讓靠近邊緣的形狀在被裁切前有足夠距離完成模糊淡出
            效果等同原始 SVG filter 的 x="-1200" 超大 filter region */}
        <div
          style={{
            position: "absolute",
            inset: "-200px",
            filter: "blur(66px)",
          }}
        >
          <svg
            style={{ position: "absolute", inset: "80px" }}
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1400 600"
            aria-hidden="true"
          >
            {/* 6 個動畫形狀：與原始完全相同，但移除所有 SVG filter 相關屬性
                動畫本身（CSS @keyframes + transform）完全保留 */}
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
          </svg>
        </div>
      </div>

      {/* Layer 3：靜態噪點覆蓋（DOM 順序在 Layer 2 之後，疊在最上方）
          feTurbulence 套用在完全不動的 <rect> 上
          → 瀏覽器可以永久快取此 filter 輸出，只計算一次 */}
      <svg
        className="pointer-events-none fixed inset-0 -z-10 size-full"
        viewBox="0 0 1400 600"
        aria-hidden="true"
      >
        <defs>
          <filter id="home-mesh-noise-c">
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
        <rect
          width="1400"
          height="600"
          fill="#888"
          filter="url(#home-mesh-noise-c)"
          style={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mixBlendMode: "var(--alt-mesh-blend)" as any,
            opacity: "var(--alt-mesh-noise-opacity)",
          }}
        />
      </svg>
    </>
  );
}
