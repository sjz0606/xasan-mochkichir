// Xasan Mochkichiri — 3D qozon: Gemini fotoreal rasm + chuqurlik xaritasi (WebGL parallaks)
import * as THREE from 'three';

const canvas = document.getElementById('gl');
const R = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
const IS_M = matchMedia('(max-width:820px), (pointer:coarse)').matches;
R.setPixelRatio(Math.min(devicePixelRatio, IS_M ? 1 : 1.5));
R.setClearColor(0x0b0705, 1);
const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const AR = 1376 / 768;

const U = {
  tImg: { value: null }, tDepth: { value: null }, uMouse: { value: new THREE.Vector2() }, uTime: { value: 0 },
  uScale: { value: new THREE.Vector2(1, 1) }, uOffset: { value: new THREE.Vector2() }, uRes: { value: new THREE.Vector2() },
  uFade: { value: 0 }, uZoom: { value: 1 },
};
const ph = (c) => { const t = new THREE.DataTexture(new Uint8Array(c), 1, 1); t.needsUpdate = true; return t; };
U.tImg.value = ph([11, 7, 5, 255]); U.tDepth.value = ph([0, 0, 0, 255]);

const frag = `#define OCT ${IS_M ? 3 : 4}
` + /* glsl */`
precision mediump float;
varying vec2 vUv;
uniform sampler2D tImg, tDepth;
uniform vec2 uMouse, uScale, uOffset, uRes;
uniform float uTime, uFade, uZoom;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for(int i=0;i<OCT;i++){ v += a*n(p); p *= 2.07; a *= .5; } return v; }
void main(){
  vec2 uv = (vUv - .5) * uScale / uZoom + .5 + uOffset;
  vec2 dir = uMouse * vec2(-.026, -.018);
  vec2 p = uv;
  for (int i = 0; i < 3; i++) { float d = texture2D(tDepth, p).r; p = uv + dir * (d - .4); }
  float inside = step(0., p.x) * step(p.x, 1.) * step(0., p.y) * step(p.y, 1.);
  vec3 col = texture2D(tImg, p).rgb * inside;

  // olov: issiq ranglar miltillaydi
  float warm = smoothstep(.25, .9, col.r - col.b) * smoothstep(.35, .0, p.y);
  float flick = .85 + .15 * sin(uTime * 11.) * sin(uTime * 6.7 + p.x * 9.) + .08 * n(vec2(uTime * 5., p.x * 20.));
  col *= mix(1., flick * 1.12, warm);
  col *= .96 + .04 * sin(uTime * 9.);

  // bug': qozon ustidan ko'tariladi (rasm koordinatasida)
  vec2 sp = vec2(p.x * 3.2, p.y * 2.2 - uTime * .18);
  float st = fbm(sp + fbm(sp + uTime * .05));
  float mask = smoothstep(.42, .7, p.x) * smoothstep(1.02, .78, p.x) * smoothstep(.45, 1., p.y);
  col += vec3(.85, .78, .72) * pow(st, 2.2) * mask * .55;

  float vig = smoothstep(1.3, .3, length((vUv - .5) * vec2(uRes.x / uRes.y * .8, 1.)));
  col *= mix(.55, 1., vig);
  col += (h(vUv * uRes + fract(uTime)) - .5) * .03;
  gl_FragColor = vec4(mix(vec3(.043, .027, .02), col, uFade), 1.);
}`;
scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
  uniforms: U, fragmentShader: frag, depthTest: false,
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
})));

/* uchqunlar */
const N = innerWidth < 640 ? 60 : 140, eg = new THREE.BufferGeometry(), ep = new Float32Array(N * 3), ev = [];
const sz = new Float32Array(N);
for (let i = 0; i < N; i++) { ev.push({ x: 0, y: -2, v: .15 + Math.random() * .35, w: Math.random() * 7, t: Math.random() * 3 }); sz[i] = 2 + Math.random() * 4; }
eg.setAttribute('position', new THREE.BufferAttribute(ep, 3)); eg.setAttribute('size', new THREE.BufferAttribute(sz, 1));
scene.add(new THREE.Points(eg, new THREE.ShaderMaterial({
  uniforms: { uPR: { value: R.getPixelRatio() }, uFade: U.uFade }, transparent: true, depthTest: false, blending: THREE.AdditiveBlending,
  vertexShader: 'attribute float size; uniform float uPR; varying float a; void main(){ a = clamp(1. - (position.z), 0., 1.); gl_Position = vec4(position.xy, 0., 1.); gl_PointSize = size * uPR; }',
  fragmentShader: 'varying float a; uniform float uFade; void main(){ float d = length(gl_PointCoord - .5); gl_FragColor = vec4(1., .6, .22, smoothstep(.5, 0., d) * a * uFade); }',
})));

/* joylashuv */
let pose = { x: 0, y: 0, z: 1 }, firePt = new THREE.Vector2(.62, .14); // olov nuqtasi (rasm uv)
const base = new THREE.Vector2(1, 1);
function resize() {
  const w = innerWidth, h = innerHeight, A = w / h;
  R.setSize(w, h, false); U.uRes.value.set(w, h);
  if (A > AR) base.set(1, AR / A); else base.set(A / AR, 1);
  if (A > 1.1) pose = { x: -.06, y: .0, z: 1 };
  else { const z = Math.min(4, .64 * AR / A); pose = { x: .18, y: -.2 * z, z }; }
  U.uScale.value.copy(base).multiplyScalar(pose.z); U.uOffset.value.set(pose.x, pose.y);
}
addEventListener('resize', resize); resize();
// rasm uv → ekran (-1..1)
function uvToClip(u) {
  const s = U.uScale.value, o = U.uOffset.value, z = U.uZoom.value;
  return new THREE.Vector2(((u.x - .5 - o.x) * z / s.x + .5) * 2 - 1, ((u.y - .5 - o.y) * z / s.y + .5) * 2 - 1);
}

const mouse = new THREE.Vector2(), mT = new THREE.Vector2();
addEventListener('pointermove', e => mT.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1));
// telefon: barmoq bilan surish + giroskop (iOS ruxsatni birinchi teginishda so'raydi)
let gyro = false, tStart = null, asked = false;
addEventListener('touchstart', e => { const t = e.touches[0]; tStart = { x: t.clientX, y: t.clientY, m: mT.clone() }; askGyro(); }, { passive: true });
addEventListener('touchmove', e => { if (gyro || !tStart) return; const t = e.touches[0];
  mT.set(THREE.MathUtils.clamp(tStart.m.x + (t.clientX - tStart.x) / innerWidth * 2.5, -1, 1), THREE.MathUtils.clamp(tStart.m.y - (t.clientY - tStart.y) / innerHeight * 1.2, -1, 1)); }, { passive: true });
function onGyro(e) { if (e.gamma == null) return; gyro = true;
  mT.set(THREE.MathUtils.clamp(e.gamma / 22, -1, 1), THREE.MathUtils.clamp((e.beta - 50) / 22, -1, 1)); }
function askGyro() { if (asked) return; asked = true;
  const D = window.DeviceOrientationEvent;
  if (D && typeof D.requestPermission === 'function') D.requestPermission().then(s => s === 'granted' && addEventListener('deviceorientation', onGyro)).catch(() => {});
}
if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') addEventListener('deviceorientation', onGyro);

const hero = document.getElementById('top');
let ready = false, fade = 0;
const clock = new THREE.Clock();
(function tick() {
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  U.uTime.value = t;
  const idle = new THREE.Vector2(Math.sin(t * .4) * .4, Math.sin(t * .31) * .25);
  mouse.lerp(mT.lengthSq() > .0001 ? mT.clone().add(idle.multiplyScalar(.25)) : idle, dt * 3);
  U.uMouse.value.copy(mouse);
  const r = hero.getBoundingClientRect(), k = THREE.MathUtils.clamp(-r.top / r.height, 0, 1);
  U.uZoom.value = 1 + k * .25;
  fade += ((ready ? 1 - k * .85 : 0) - fade) * dt * 3;
  U.uFade.value = fade;
  const f = uvToClip(firePt);
  for (let i = 0; i < N; i++) {
    const e = ev[i]; e.t += dt * e.v;
    if (e.t > 1.6 || e.y < -1.5) { e.t = 0; e.x = (Math.random() - .5) * .25; }
    ep[i * 3] = f.x + e.x + Math.sin(t * 1.5 + e.w) * .05 * e.t + mouse.x * .01;
    ep[i * 3 + 1] = f.y + e.t * .9; ep[i * 3 + 2] = e.t / 1.6;
  }
  eg.attributes.position.needsUpdate = true;
  // hero ko'rinmasa — chizmaymiz (batareya va tezlik)
  const visible = r.bottom > 0 && !document.hidden;
  canvas.style.visibility = visible ? 'visible' : 'hidden';
  if (visible) R.render(scene, cam);
  requestAnimationFrame(tick);
})();

const L = new THREE.TextureLoader();
const load = u => new Promise(res => L.load(u, x => { x.minFilter = THREE.LinearFilter; res(x); }));
Promise.all([load('assets/img/hero.jpg'), load('assets/img/hero_depth.jpg')]).then(([a, b]) => {
  a.colorSpace = THREE.SRGBColorSpace; U.tImg.value = a; U.tDepth.value = b; ready = true;
  dispatchEvent(new Event('scene-ready'));
});
