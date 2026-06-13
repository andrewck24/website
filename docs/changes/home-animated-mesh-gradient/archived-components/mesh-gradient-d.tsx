"use client";

import { Mesh, Plane, Program, Renderer } from "ogl";
import { useEffect, useRef } from "react";

import { fragmentShader, vertexShader } from "./mesh-gradient-d-shaders";

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

export function MeshGradientBackgroundD() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const renderer = new Renderer({
      canvas,
      alpha: true,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
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
    };
    LAYERS.forEach((_, i) => {
      initialUniforms[`uColor${i}`] = { value: [0, 0, 0] };
      initialUniforms[`uOpacity${i}`] = { value: 0 };
    });

    const geometry = new Plane(gl, {
      width: 2,
      height: 2,
      widthSegments: 64,
      heightSegments: 64,
    });
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: initialUniforms,
      transparent: true,
    });
    const mesh = new Mesh(gl, { geometry, program });

    // 防護：dev StrictMode 重新掛載會沿用同一 canvas，而瀏覽器同時 WebGL context
    // 有數量上限——導航往返多次後，新掛載拿到的 context 可能已遺失。此時 OGL 的
    // program 連結失敗、program.uniformLocations 為 undefined，後續 render() 會丟
    // "Cannot read properties of undefined (reading 'forEach')"。改為優雅降級中止。
    if (gl.isContextLost() || !program.uniformLocations) return;

    function updateTheme() {
      LAYERS.forEach((layer, i) => {
        program.uniforms[`uColor${i}`].value = readCssColor(
          colorCtx!,
          layer.color
        );
        program.uniforms[`uOpacity${i}`].value = readCssNumber(layer.opacity);
      });
      renderer.render({ scene: mesh });
    }

    function resize() {
      const { clientWidth, clientHeight } = container!;
      renderer.setSize(clientWidth, clientHeight);
      program.uniforms.uResolution.value = [clientWidth, clientHeight];
      renderer.render({ scene: mesh });
    }

    updateTheme();
    resize();

    const themeObserver = new MutationObserver(updateTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let rafId = 0;
    let paused = reduceMotion;
    const start = performance.now();

    function loop(now: number) {
      rafId = requestAnimationFrame(loop);
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

    return () => {
      cancelAnimationFrame(rafId);
      themeObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // 不主動 loseContext()：dev StrictMode 會在 cleanup 後以同一 canvas 重新掛載，
      // 若此時把 context 弄丟，重新掛載的 program 會連結失敗而崩潰。卸載後 canvas
      // 脫離 DOM，瀏覽器會自行回收其 WebGL context。
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 top-0 -z-10 h-dvh overflow-hidden"
      style={{ background: "var(--background)" }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      <svg
        className="pointer-events-none absolute inset-0 size-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1400 600"
        aria-hidden="true"
      >
        <defs>
          <filter id="home-mesh-noise-d">
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
          filter="url(#home-mesh-noise-d)"
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
