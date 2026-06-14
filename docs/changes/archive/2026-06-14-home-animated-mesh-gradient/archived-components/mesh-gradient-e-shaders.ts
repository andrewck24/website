/**
 * 方案 E：aurora-like swoosh shader（WebGL hybrid per-vertex/per-pixel，OGL）
 *
 * 參考 Stripe hero 的做法：動畫不填滿 canvas，而是侷限在一條
 * 自上緣偏左俯衝、往右下掃出的曲線帶（swoosh）內（中軸與方案 F 共用）：
 * - 二次曲線中軸 xc(t) 定義帶的位置；crossDist = pa.x - xc(t) 為橫越帶寬的有號距離
 * - bandMask 對 |crossDist| 做 smoothstep 衰減 → 帶內顯色、帶緣柔和漸出、帶外全透明
 * - aurora noise 以 (along, crossDist) 帶座標取樣 → 低頻沿帶／高頻橫帶，
 *   色帶順著 swoosh 蜿蜒；along 隨時間漂移 → 色帶沿帶軸明顯流動
 *
 * Hybrid 分工（避免 Gouraud 內插鋸齒）：
 * - vertex：只計算平滑場——帶座標與各層 aurora noise 原始值，經 varying 傳遞
 * - fragment：逐像素做 smoothstep → pow 的銳利成形與混色，
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

varying float vCross; // crossDist：橫越帶寬的有號距離
varying float vT;     // 沿帶參數（0=上緣、1=下緣），供帶寬上窄下寬漸變
varying vec3 vNoiseA; // 第 0-2 層的 aurora noise（0..1）
varying vec3 vNoiseB; // 第 3-5 層的 aurora noise（0..1）

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

// 非等向 aurora noise（0..1）：低頻沿帶／高頻橫帶 + domain warp；
// along 隨時間漂移（flow）→ 色帶沿帶軸流動、邊緣波浪飄移
float auroraNoise(
  float along,
  float crossDist,
  float freqX,
  float freqY,
  vec2 offset,
  float flow,
  float evolve,
  float warpAmp
) {
  float a = along - uTime * flow;
  float warp = snoise(vec3(a * freqX * 0.4 + offset.x, offset.y * 0.7, uTime * evolve * 0.6)) * warpAmp;
  float c = crossDist + warp;
  return snoise(vec3(a * freqX + offset.x, c * freqY + offset.y, uTime * evolve)) * 0.5 + 0.5;
}

void main() {
  vec2 p = uv;

  // 參考寬高比校正：帶寬與中軸以 16:10（桌面核可基準）座標定義，跨裝置厚度一致。
  // 以「右緣」為錨點（p.x=1 → px=1 固定對齊右邊）→ 窄螢幕時截斷左上、
  // 保留右下角的 swoosh 收尾（aspect=1.6 時 px=p.x，桌面基準不變）。
  float aspect = uResolution.x / uResolution.y;
  float px = 1.0 - (1.0 - p.x) * (aspect / 1.6);
  float t = 1.0 - p.y; // 沿帶參數：0 = 上緣、1 = 下緣

  // swoosh 中軸：自上緣偏左進入、往右下掃出（二次曲線），與方案 F 相同
  float xc = 0.16 + 0.50 * t + 0.50 * t * t;
  float crossDist = px - xc;   // 橫越帶寬的有號距離（ref 單位）
  float along = t + px * 0.35; // 沿帶弧長近似

  vCross = crossDist;
  vT = t;
  vNoiseA = vec3(
    auroraNoise(along, crossDist, 0.6, 6.4, vec2(0.10, 0.35), 0.063, 0.084, 0.06),
    auroraNoise(along, crossDist, 0.9, 5.2, vec2(1.40, 0.80), 0.049, 0.07, 0.075),
    auroraNoise(along, crossDist, 0.5, 7.2, vec2(0.70, 1.60), 0.077, 0.063, 0.055)
  );
  vNoiseB = vec3(
    auroraNoise(along, crossDist, 1.1, 4.4, vec2(2.10, 0.30), 0.056, 0.091, 0.08),
    auroraNoise(along, crossDist, 0.7, 6.0, vec2(0.40, 2.40), 0.07, 0.098, 0.07),
    auroraNoise(along, crossDist, 0.8, 5.6, vec2(1.80, 1.10), 0.042, 0.077, 0.07)
  );

  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

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

varying float vCross;
varying float vT;
varying vec3 vNoiseA;
varying vec3 vNoiseB;

// 逐像素極光帶成形：smoothstep → pow，邊緣柔和但無網格鋸齒
void aurora(
  float n,
  vec3 layerColor,
  float opacity,
  float noiseFloor,
  float noiseCeil,
  inout vec3 color,
  inout float coverage
) {
  float shaped = smoothstep(noiseFloor, noiseCeil, n);
  float a = pow(shaped, 1.5) * opacity;
  color = mix(color, layerColor, a);
  coverage = max(coverage, a);
}

void main() {
  vec3 color = vec3(0.0);
  float coverage = 0.0;

  aurora(vNoiseA.x, uColor0, uOpacity0, 0.42, 0.62, color, coverage);
  aurora(vNoiseA.y, uColor1, uOpacity1, 0.46, 0.66, color, coverage);
  aurora(vNoiseA.z, uColor2, uOpacity2, 0.40, 0.60, color, coverage);
  aurora(vNoiseB.x, uColor3, uOpacity3, 0.48, 0.70, color, coverage);
  aurora(vNoiseB.y, uColor4, uOpacity4, 0.50, 0.72, color, coverage);
  aurora(vNoiseB.z, uColor5, uOpacity5, 0.48, 0.68, color, coverage);

  // swoosh 帶狀 mask：帶內顯色、帶緣柔和漸出、帶外全透明
  // 帶寬上窄下寬：半寬 w 隨 vT（上→下）由 0.18 增至 0.46
  float w = mix(0.18, 0.46, vT);
  float bandMask = 1.0 - smoothstep(w * 0.45, w, abs(vCross));

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
