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
uniform float uVelocity; // smoothed scroll speed, 0..1

float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
  vec2 u=f*f*(3.0-2.0*f);
  return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v=0.0, a=0.5;
  for(int i=0;i<6;i++){ v+=a*noise(p); p=p*2.03+vec2(1.7,3.1); a*=0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= uResolution.x / uResolution.y;

  float t = uTime * (0.12 + uVelocity * 0.35);
  vec2 m = uMouse * 2.0 - 1.0;
  vec2 dir = p - m;
  float md = length(dir);
  vec2 warp = dir * 0.35 * smoothstep(1.2, 0.0, md);

  // Scroll-velocity ripple: a radial wave pulsing outward when you scroll fast.
  float rscroll = length(p);
  float ripple = sin(rscroll * 10.0 - uTime * 6.0) * uVelocity * 0.35;
  warp += normalize(p + 0.0001) * ripple;

  vec2 q = vec2(fbm(p + t + warp), fbm(p - t + vec2(4.3, 1.1) + warp));
  vec2 r = vec2(fbm(p + q*(1.5 + uVelocity*0.8) + vec2(1.7,9.2)), fbm(p + q + vec2(8.3,2.8) + t*0.6));
  float n = fbm(p + (2.6 + uVelocity) * r + warp);

  // swirly rings via angle
  float ang = atan(p.y, p.x);
  float rad = length(p);
  float rings = sin(rad * 8.0 - t * 3.0 + n * 4.0) * 0.5 + 0.5;
  float swirl = sin(ang * 3.0 + rad * 4.0 - t * 2.0) * 0.5 + 0.5;

  vec3 gold  = vec3(0.988, 0.827, 0.369);
  vec3 coral = vec3(1.000, 0.498, 0.314);
  vec3 plum  = vec3(0.729, 0.333, 0.718);
  vec3 sky   = vec3(0.490, 0.827, 0.988);
  vec3 mint  = vec3(0.447, 0.937, 0.753);
  vec3 deep  = vec3(0.055, 0.035, 0.090);

  vec3 col = deep;
  col = mix(col, plum,  smoothstep(0.2,0.6,n) * 0.9);
  col = mix(col, sky,   smoothstep(0.45,0.78,n) * 0.8 * (0.7 + 0.3 * rings));
  col = mix(col, coral, smoothstep(0.60,0.88,n) * 0.85 * (0.6 + 0.4 * swirl));
  col = mix(col, gold,  smoothstep(0.80,0.98,n) * 0.7);
  col = mix(col, mint,  smoothstep(0.92,1.02,n) * 0.4);

  // bright core glow
  float core = smoothstep(0.5, 0.0, md);
  col += core * 0.28 * vec3(1.0, 0.92, 0.75);

  // subtle grain
  float g = hash(gl_FragCoord.xy + uTime*30.0) - 0.5;
  col += g * 0.02;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export default function Medallion({ size = 520 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = (canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    }) || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
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
    const uVelocity = gl.getUniformLocation(prog, "uVelocity");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const start = performance.now();
    let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;
    // scroll velocity tracking — smoothed into 0..1
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let lastScrollAt = performance.now();
    let targetVel = 0;
    let vel = 0;
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
      // mouse relative to window but normalized by medallion rect center
      tmx = Math.min(1.5, Math.max(-0.5, (e.clientX - rect.left) / rect.width));
      tmy = Math.min(1.5, Math.max(-0.5, 1 - (e.clientY - rect.top) / rect.height));
    };

    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastScrollY);
      const dt = Math.max(1, now - lastScrollAt);
      // px/ms -> normalize. 4 px/ms of scroll ~ full warp.
      targetVel = Math.min(1, (dy / dt) / 4);
      lastScrollY = window.scrollY;
      lastScrollAt = now;
    };

    const draw = () => {
      mx += (tmx - mx) * 0.08;
      my += (tmy - my) * 0.08;
      // Velocity decays toward 0; target only overrides when higher.
      targetVel *= 0.92;
      vel += (targetVel - vel) * 0.18;
      const t = (performance.now() - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uVelocity, vel);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
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
