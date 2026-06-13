/**
 * 方案 B：純 CSS radial-gradient 色塊，完全不使用任何 filter
 *
 * 核心改動：
 * - 移除所有 SVG filter（feGaussianBlur、feTurbulence）
 * - 每個色塊是一個 <div> 搭配 radial-gradient，邊緣自然淡出 transparent
 * - 動畫直接套用在 div 的 transform 上 → 走 GPU 合成器路徑，每幀零 paint 成本
 * - 色塊位置、大小對應原始 SVG 座標（viewBox 1400×600）的右焦點佈局
 *
 * 視覺差異：
 * - 沒有 feGaussianBlur 的「形狀邊緣模糊融合」→ 改由 radial-gradient 的放射狀淡出取代
 * - 沒有 feTurbulence 噪點紋理（靜態版本可另外疊加一張 PNG grain 紋理）
 * - 動畫更流暢（無 filter 重算開銷）
 */

interface Blob {
  color: string;
  opacityVar: string;
  width: string;
  height: string;
  top: string;
  left: string;
  animationVar: string;
}

const blobs: Blob[] = [
  {
    // outer loop（dev-s 藍色）：大型有機迴圈，右側中央
    color: "var(--alt-grad-dev-s)",
    opacityVar: "var(--alt-mesh-op-1)",
    width: "58%",
    height: "95%",
    top: "2%",
    left: "40%",
    animationVar: "var(--animate-mesh-a)",
  },
  {
    // inner loop（prev-s 紫羅蘭）：較小巢狀迴圈，右側偏上
    color: "var(--alt-grad-prev-s)",
    opacityVar: "var(--alt-mesh-op-2)",
    width: "36%",
    height: "65%",
    top: "10%",
    left: "54%",
    animationVar: "var(--animate-mesh-b)",
  },
  {
    // cross-sweep（dev-e 青色）：斜向對角帶，横跨中右
    color: "var(--alt-grad-dev-e)",
    opacityVar: "var(--alt-mesh-op-3)",
    width: "68%",
    height: "80%",
    top: "8%",
    left: "24%",
    animationVar: "var(--animate-mesh-c)",
  },
  {
    // focal core（prev-e 洋紅）：焦點核心，右側中下
    color: "var(--alt-grad-prev-e)",
    opacityVar: "var(--alt-mesh-op-4)",
    width: "24%",
    height: "52%",
    top: "22%",
    left: "64%",
    animationVar: "var(--animate-mesh-d)",
  },
  {
    // amber polygon（ship-e 琥珀）：焦點區塊，右側偏上
    color: "var(--alt-grad-ship-e)",
    opacityVar: "var(--alt-mesh-op-5)",
    width: "22%",
    height: "42%",
    top: "12%",
    left: "65%",
    animationVar: "var(--animate-mesh-e)",
  },
  {
    // coral ellipse（ship-s 珊瑚）：暖色橢圓，中右偏上
    color: "var(--alt-grad-ship-s)",
    opacityVar: "var(--alt-mesh-op-6)",
    width: "32%",
    height: "52%",
    top: "5%",
    left: "38%",
    animationVar: "var(--animate-mesh-f)",
  },
];

export function MeshGradientBackgroundB() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background: "var(--alt-mesh-bg)",
        isolation: "isolate",
      }}
    >
      {blobs.map((blob, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: blob.width,
            height: blob.height,
            top: blob.top,
            left: blob.left,
            background: `radial-gradient(ellipse at center, ${blob.color} 0%, transparent 65%)`,
            opacity: blob.opacityVar,
            willChange: "transform",
            transformOrigin: "center",
            animation: blob.animationVar,
          }}
        />
      ))}
    </div>
  );
}
