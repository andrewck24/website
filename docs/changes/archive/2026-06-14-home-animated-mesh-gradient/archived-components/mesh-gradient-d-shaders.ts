/**
 * 方案 D：WebGL per-vertex shader（OGL）
 *
 * Vertex shader 對細分平面網格的每個頂點（~1000 個）計算：
 * - 6 層 3D simplex noise（snoise，Ashima Arts 實作）→ smoothstep + pow 整形
 *   → blendNormal 疊色，產生「中心濃郁、邊緣銳利」的色塊（mesh-gradient 套件技法）
 * - 右焦點 alpha falloff mask → 背景透出、色塊集中右側（本專案佈局需求）
 *
 * Rasterizer 將 vColor / vAlpha 插值到每個像素，fragment shader 直接輸出，
 * per-pixel 成本趨近於零。
 */

export const vertexShader = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;

uniform float uTime;
uniform vec2 uResolution;
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

varying vec3 vColor;
varying float vAlpha;

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

// 將一層噪聲整形為「中心濃郁、邊緣銳利」並疊色到 color/coverage
void applyLayer(
  vec2 p,
  vec3 layerColor,
  float opacity,
  float freq,
  vec2 offset,
  float speed,
  float noiseFloor,
  float noiseCeil,
  inout vec3 color,
  inout float coverage
) {
  float n = snoise(vec3(p * freq + offset, uTime * speed)) * 0.5 + 0.5;
  float shaped = smoothstep(noiseFloor, noiseCeil, n);
  float a = pow(shaped, 2.0) * opacity;
  color = mix(color, layerColor, a);
  coverage = max(coverage, a);
}

void main() {
  vec2 p = uv;
  vec3 color = vec3(0.0);
  float coverage = 0.0;

  // 參考寬高比校正：noise 取樣座標以 16:10（桌面核可基準）為準，
  // 避免色塊寬度在不同螢幕寬高比下發生變化（窄螢幕變窄等問題）
  float aspect = uResolution.x / uResolution.y;
  vec2 pa = vec2(p.x * (aspect / 1.6), p.y);

  applyLayer(pa, uColor0, uOpacity0, 1.8, vec2(0.10, 0.35), 0.05, 0.45, 0.62, color, coverage);
  applyLayer(pa, uColor1, uOpacity1, 2.4, vec2(1.40, 0.80), 0.045, 0.48, 0.64, color, coverage);
  applyLayer(pa, uColor2, uOpacity2, 1.4, vec2(0.70, 1.60), 0.04, 0.42, 0.60, color, coverage);
  applyLayer(pa, uColor3, uOpacity3, 2.8, vec2(2.10, 0.30), 0.055, 0.50, 0.66, color, coverage);
  applyLayer(pa, uColor4, uOpacity4, 3.2, vec2(0.40, 2.40), 0.06, 0.52, 0.68, color, coverage);
  applyLayer(pa, uColor5, uOpacity5, 2.2, vec2(1.80, 1.10), 0.05, 0.50, 0.66, color, coverage);

  vColor = color;

  // 右焦點 alpha falloff：背景透出、色塊集中右側
  vec2 focal = vec2(0.66, 0.48);
  vec2 d = p - focal;
  d.x *= aspect;
  float dist = length(d);
  float falloff = 1.0 - smoothstep(0.35, 1.1, dist);

  vAlpha = coverage * falloff;

  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

varying vec3 vColor;
varying float vAlpha;

void main() {
  gl_FragColor = vec4(vColor, vAlpha);
}
`;
