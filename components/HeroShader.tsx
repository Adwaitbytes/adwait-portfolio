"use client";
import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uScroll;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = p * 2.02 + vec2(1.3, 2.7);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= uResolution.x / uResolution.y;

  float t = uTime * 0.055;

  // mouse warp
  vec2 m = uMouse * 2.0 - 1.0;
  m.x *= uResolution.x / uResolution.y;
  float md = length(p - m);
  vec2 warp = (p - m) * 0.15 * smoothstep(0.7, 0.0, md);

  // domain warp
  vec2 q = vec2(fbm(p + t + warp), fbm(p - t + vec2(5.2, 1.3) + warp));
  vec2 r = vec2(fbm(p + q + vec2(1.7, 9.2)), fbm(p + q + vec2(8.3, 2.8) + t * 0.5));
  float n = fbm(p + 2.4 * r + warp);

  // palette (warm → cool spectrum, Adwait brand)
  vec3 cBg    = vec3(0.020, 0.020, 0.027);
  vec3 cDeep  = vec3(0.070, 0.046, 0.105);
  vec3 cPlum  = vec3(0.478, 0.208, 0.478);
  vec3 cCoral = vec3(1.000, 0.498, 0.314);
  vec3 cGold  = vec3(0.956, 0.827, 0.369);
  vec3 cSky   = vec3(0.490, 0.827, 0.988);
  vec3 cMint  = vec3(0.447, 0.937, 0.753);

  vec3 col = cBg;
  col = mix(col, cDeep,  smoothstep(0.15, 0.55, n));
  col = mix(col, cPlum,  smoothstep(0.40, 0.70, n) * 0.85);
  col = mix(col, cSky,   smoothstep(0.55, 0.82, n) * 0.80);
  col = mix(col, cCoral, smoothstep(0.65, 0.90, n) * 0.70);
  col = mix(col, cGold,  smoothstep(0.78, 0.98, n) * 0.60);
  col = mix(col, cMint,  smoothstep(0.90, 1.02, n) * 0.30);

  // bright ribbon through the center driven by q
  float ribbon = smoothstep(0.08, 0.0, abs(q.y - 0.5 + 0.15 * sin(t * 5.0 + p.x * 1.5)));
  col += ribbon * 0.18 * vec3(1.0, 0.85, 0.5);

  // edge vignette
  float vig = smoothstep(0.2, 1.4, length(p * vec2(0.85, 1.0)));
  col *= 1.0 - vig * 0.65;

  // scroll-driven dim
  col *= 1.0 - clamp(uScroll, 0.0, 1.0) * 0.35;

  // grain
  float g = hash(gl_FragCoord.xy + uTime * 60.0) - 0.5;
  col += g * 0.020;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export default function HeroShader() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = (canvas.getContext("webgl", {
      antialias: true,
      premultipliedAlpha: false,
    }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const prog = gl.createProgram()!;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uScroll = gl.getUniformLocation(prog, "uScroll");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    let mx = 0.5;
    let my = 0.5;
    let tmx = 0.5;
    let tmy = 0.5;
    let scroll = 0;
    const start = performance.now();
    let raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      tmx = (e.clientX - rect.left) / rect.width;
      tmy = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    const onScroll = () => {
      const h = window.innerHeight;
      scroll = Math.min(1, Math.max(0, window.scrollY / h));
    };

    const draw = () => {
      mx += (tmx - mx) * 0.06;
      my += (tmy - my) * 0.06;
      const t = (performance.now() - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{ display: "block" }}
    />
  );
}
