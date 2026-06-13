/**
 * Home hero 背景：stripe-like swoosh shader（WebGL hybrid per-vertex/per-pixel，OGL）
 *
 * 參考 Stripe hero 的做法：動畫不填滿 canvas，而是侷限在一條
 * 自上緣偏左俯衝、往右下掃出的曲線帶（swoosh）內：
 * - 二次曲線中軸 xc(t) 定義帶的位置；crossDist = pa.x - xc(t) 為橫越帶寬的有號距離
 * - bandMask 對 |crossDist| 做 smoothstep 衰減 → 帶內顯色、帶緣柔和漸出、帶外全透明
 * - 彩帶以 crossDist 為 sin 相位 → 條紋與帶軸平行，沿帶流動
 *
 * Hybrid 分工（避免 Gouraud 內插鋸齒）：
 * - vertex：只計算平滑場——帶座標 (crossDist, along) 與各層低頻 noise warp，經 varying 傳遞
 * - fragment：逐像素做 sin → smoothstep → pow 的銳利彩帶成形與混色，
 *   邊緣品質不再依賴網格解析度
 *
 * 帶寬與中軸以參考寬高比（16:10）座標定義，跨裝置厚度一致；
 * 窄螢幕只會被帶切過部分區域，不會整面被動畫佔滿。
 */

export const vertexShader = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vBand;  // x = crossDist、y = along
varying float vT;    // 沿帶參數（0=上緣、1=下緣），供帶寬上窄下寬漸變
varying vec3 vWarpA; // 第 0-2 層的 noise warp
varying vec3 vWarpB; // 第 3-5 層的 noise warp

// --- Ashima Arts 3D simplex noise ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// 各層的低頻 warp：沿帶取樣、隨時間演化 → 彩帶邊緣有機波動
float layerWarp(float along, vec2 offset, float speed, float amp) {
  return snoise(vec3(along * 1.4 + offset.x, offset.y, uTime * speed)) * amp;
}

void main() {
  vec2 p = uv;

  // 參考寬高比校正：帶寬與中軸以 16:10（桌面核可基準）座標定義，跨裝置厚度一致。
  // 以「右緣」為錨點（p.x=1 → px=1 固定對齊右邊）→ 窄螢幕時截斷左上、
  // 保留右下角的 swoosh 收尾（aspect=1.6 時 px=p.x，桌面基準不變）。
  float aspect = uResolution.x / uResolution.y;
  float px = 1.0 - (1.0 - p.x) * (aspect / 1.6);
  float t = 1.0 - p.y; // 沿帶參數：0 = 上緣、1 = 下緣

  // swoosh 中軸：自上緣偏左進入、往右下掃出（二次曲線）
  float xc = 0.16 + 0.50 * t + 0.50 * t * t;
  vBand = vec2(px - xc, t + px * 0.35);
  vT = t;

  vWarpA = vec3(
    layerWarp(vBand.y, vec2(0.10, 0.35), 0.07, 0.05),
    layerWarp(vBand.y, vec2(0.55, 0.80), 0.063, 0.06),
    layerWarp(vBand.y, vec2(0.95, 1.60), 0.056, 0.045)
  );
  vWarpB = vec3(
    layerWarp(vBand.y, vec2(1.35, 0.30), 0.077, 0.07),
    layerWarp(vBand.y, vec2(1.75, 2.40), 0.084, 0.055),
    layerWarp(vBand.y, vec2(2.15, 1.10), 0.07, 0.06)
  );

  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform float uOpacity0;
uniform float uOpacity1;
uniform float uOpacity2;
uniform float uOpacity3;
uniform float uOpacity4;
uniform float uOpacity5;
uniform float uSaturation; // light>1 提高彩度補償白底去飽和；dark=1 恆等

varying vec2 vBand;  // x = crossDist、y = along
varying float vT;
varying vec3 vWarpA;
varying vec3 vWarpB;

// 逐像素彩帶成形：sin 波帶 → smoothstep → pow，邊緣銳利但無網格鋸齒；
// 相位含 -uTime * speed → 彩帶沿帶軸明顯流動
void ribbon(
  float warp,
  vec3 layerColor,
  float opacity,
  float freq,
  float speed,
  float phase,
  float noiseFloor,
  float noiseCeil,
  inout vec3 color,
  inout float coverage
) {
  float c = vBand.x + warp;
  float band = sin(c * freq * 6.28318 + vBand.y * 0.8 - uTime * speed + phase) * 0.5 + 0.5;
  float shaped = smoothstep(noiseFloor, noiseCeil, band);
  float a = pow(shaped, 1.5) * opacity;
  color = mix(color, layerColor, a);
  coverage = max(coverage, a);
}

void main() {
  vec3 color = vec3(0.0);
  float coverage = 0.0;

  ribbon(vWarpA.x, uColor0, uOpacity0, 1.8, 0.28, 0.6, 0.40, 0.62, color, coverage);
  ribbon(vWarpA.y, uColor1, uOpacity1, 2.6, 0.22, 3.3, 0.44, 0.66, color, coverage);
  ribbon(vWarpA.z, uColor2, uOpacity2, 1.4, 0.18, 5.7, 0.38, 0.60, color, coverage);
  ribbon(vWarpB.x, uColor3, uOpacity3, 3.2, 0.34, 8.1, 0.48, 0.70, color, coverage);
  ribbon(vWarpB.y, uColor4, uOpacity4, 2.0, 0.25, 10.5, 0.50, 0.72, color, coverage);
  ribbon(vWarpB.z, uColor5, uOpacity5, 2.4, 0.21, 12.9, 0.46, 0.68, color, coverage);

  // swoosh 帶狀 mask：帶內顯色、帶緣柔和漸出、帶外全透明
  // 帶寬上窄下寬：半寬 w 隨 vT（上→下）由 0.18 增至 0.46
  float w = mix(0.18, 0.46, vT);
  float bandMask = 1.0 - smoothstep(w * 0.45, w, abs(vBand.x));

  // un-premultiply：color 經 mix 已含 coverage 權重，GL blending 會再乘一次
  // alpha，不除回會變成 alpha 平方 → 成色灰暗（dark mode 無濾鏡補償時特別明顯）
  vec3 outColor = color / max(coverage, 1e-3);

  // 飽和度提升（取代 light 模式原本的 CSS saturate filter，移進 fragment 逐像素計算，
  // 省去每幀對全螢幕 canvas 重套 CSS filter 的 compositor 成本）
  float luma = dot(outColor, vec3(0.2126, 0.7152, 0.0722));
  outColor = mix(vec3(luma), outColor, uSaturation);

  gl_FragColor = vec4(outColor, coverage * bandMask);
}
`;
