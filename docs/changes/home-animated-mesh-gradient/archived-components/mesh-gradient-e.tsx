"use client";

import { Mesh, Plane, Program, Renderer } from "ogl";
import { useEffect, useRef } from "react";

import { fragmentShader, vertexShader } from "./mesh-gradient-e-shaders";

// CSS var 名稱對應到 shader 的 uColor{i} / uOpacity{i} uniforms
const LAYERS = [
  { color: "--alt-grad-dev-s", opacity: "--alt-mesh-op-1" },
  { color: "--alt-grad-prev-s", opacity: "--alt-mesh-op-2" },
  { color: "--alt-grad-dev-e", opacity: "--alt-mesh-op-3" },
  { color: "--alt-grad-prev-e", opacity: "--alt-mesh-op-4" },
  { color: "--alt-grad-ship-e", opacity: "--alt-mesh-op-5" },
  { color: "--alt-grad-ship-s", opacity: "--alt-mesh-op-6" },
] as const;

// 將任意 CSS 顏色（含 oklch()）轉換為 0..1 的 RGB
function readCssColor(
  ctx2d: CanvasRenderingContext2D,
  varName: string
): [number, number, number] {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  ctx2d.fillStyle = value;
  ctx2d.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx2d.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

function readCssNumber(varName: string): number {
  return parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(varName)
  );
}

export function MeshGradientBackgroundE() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let teardown = () => {};

    // WebGL 首幀畫出後才把 canvas 從透明淡入（gate 在首幀，確保淡入的是真實內容
    // 而非空白 canvas）。期間容器的 var(--background) 提供主題正確的底色，無空白閃爍。
    function reveal() {
      canvas!.style.opacity = "1";
    }

    function init() {
      if (!container || !canvas) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      // 觸控裝置（手機/平板）GPU 較弱且多為 retina，fill-rate 是主要瓶頸：
      // dpr 壓到 1（桌面維持 1.5）。fill-rate ∝ dpr²，1.5→1 省約 56% 像素。
      const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

      const renderer = new Renderer({
        canvas,
        alpha: true,
        // 無幾何硬邊（邊緣皆由 fragment alpha 羽化）故關閉 MSAA／深度／模板緩衝
        dpr: Math.min(window.devicePixelRatio || 1, isCoarsePointer ? 1 : 1.5),
        antialias: false,
        depth: false,
        stencil: false,
      });
      const gl = renderer.gl;

      const colorCtx = document.createElement("canvas").getContext("2d", {
        willReadFrequently: true,
      });
      if (!colorCtx) return;
      colorCtx.canvas.width = 1;
      colorCtx.canvas.height = 1;

      const initialUniforms: Record<string, { value: unknown }> = {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uSaturation: { value: 1 },
      };
      LAYERS.forEach((_, i) => {
        initialUniforms[`uColor${i}`] = { value: [0, 0, 0] };
        initialUniforms[`uOpacity${i}`] = { value: 0 };
      });

      const geometry = new Plane(gl, {
        width: 2,
        height: 2,
        // 成形已在 fragment 逐像素計算，vertex 只承載平滑場（帶座標 + 低頻 noise）；
        // 96² 足以平滑內插這些低頻內容，較 128² 省約 44% vertex 階段運算
        widthSegments: 96,
        heightSegments: 96,
      });
      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: initialUniforms,
        transparent: true,
      });
      const mesh = new Mesh(gl, { geometry, program });

      // 防護：dev StrictMode 重新掛載沿用同一 canvas、或導航往返間 context 遺失時，
      // program 連結失敗、program.uniformLocations 為 undefined，後續 render() 會丟
      // "Cannot read properties of undefined (reading 'forEach')"。優雅降級中止。
      if (gl.isContextLost() || !program.uniformLocations) return;

      // 顏色與透明度 uniform 為「主題無關」（`--alt-grad-*` 只在 :root、`--alt-mesh-op-*`
      // 已統一），只需讀一次，不需 MutationObserver。
      function applyColors() {
        LAYERS.forEach((layer, i) => {
          program.uniforms[`uColor${i}`].value = readCssColor(
            colorCtx!,
            layer.color
          );
          program.uniforms[`uOpacity${i}`].value = readCssNumber(layer.opacity);
        });
        renderer.render({ scene: mesh });
      }

      // 飽和度是唯一主題相依的 uniform（light 提高彩度補償白底去飽和、dark=1 恆等），
      // 改用 shader 內逐像素飽和取代 CSS `filter: saturate()`（後者在每幀重繪的全螢幕
      // canvas 上被 compositor 反覆套用）。以廉價 classList 判斷偵測切換，僅在真正翻轉時
      // 讀一次 CSS 變數上傳一個 float（無 getImageData readback），免 observer。
      let lastIsDark: boolean | null = null;
      function syncSaturation() {
        const isDark = document.documentElement.classList.contains("dark");
        if (isDark === lastIsDark) return;
        lastIsDark = isDark;
        program.uniforms.uSaturation.value = readCssNumber(
          "--alt-mesh-saturation"
        );
      }

      function resize() {
        const { clientWidth, clientHeight } = container!;
        renderer.setSize(clientWidth, clientHeight);
        program.uniforms.uResolution.value = [clientWidth, clientHeight];
        renderer.render({ scene: mesh });
      }

      applyColors();
      syncSaturation();
      resize();
      // 首幀已畫出 → 從透明淡入 canvas
      reveal();

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      let rafId = 0;
      let paused = reduceMotion;
      const start = performance.now();

      function loop(now: number) {
        rafId = requestAnimationFrame(loop);
        syncSaturation();
        program.uniforms.uTime.value = (now - start) / 1000;
        renderer.render({ scene: mesh });
      }

      function handleVisibilityChange() {
        if (reduceMotion) return;
        if (document.hidden) {
          paused = true;
          cancelAnimationFrame(rafId);
        } else if (paused) {
          paused = false;
          rafId = requestAnimationFrame(loop);
        }
      }
      document.addEventListener("visibilitychange", handleVisibilityChange);

      if (!reduceMotion) {
        rafId = requestAnimationFrame(loop);
      }

      teardown = () => {
        cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        // 不主動 loseContext()：dev StrictMode 會在 cleanup 後以同一 canvas 重新掛載，
        // 若此時把 context 弄丟，重新掛載的 program 會連結失敗而崩潰。卸載後 canvas
        // 脫離 DOM，瀏覽器會自行回收其 WebGL context。
      };
    }

    // 立即初始化（不再用 requestIdleCallback 延後）——延後到 idle 反而讓漸層更晚出現，
    // 而頁面其餘部分本就先完成 paint（useEffect 在 paint 後才跑，不擋首屏）。
    init();

    return () => teardown();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 top-0 -z-10 h-dvh overflow-hidden"
      style={{ background: "var(--background)" }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full"
        style={{ opacity: 0, transition: "opacity 600ms ease-out" }}
      />
      <svg
        className="pointer-events-none absolute inset-0 size-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1400 600"
        aria-hidden="true"
      >
        <defs>
          <filter id="home-mesh-noise-e">
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
          filter="url(#home-mesh-noise-e)"
          style={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mixBlendMode: "var(--alt-mesh-blend)" as any,
            opacity: "var(--alt-mesh-noise-opacity)",
          }}
        />
      </svg>
    </div>
  );
}
