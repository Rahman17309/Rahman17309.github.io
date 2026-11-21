// Background: thousands of glowing data points that morph into a new shape for each part of the page
// (globe → ring → wave → bar chart → helix → galaxy) as you scroll. The mouse pushes points away,
// and a click sends a shockwave through them.
import * as THREE from "three";

const canvas = document.getElementById("bg-canvas");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const small = window.innerWidth < 760;

function supportsWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); }
  catch { return false; }
}
if (canvas && supportsWebGL()) init();

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
  camera.position.set(0, 0, 34);

  const N = small ? 2600 : 5200;
  const R = 11;

  /* ---------- Target shapes ---------- */
  const shapes = [];
  const make = (fn) => { const a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const p = fn(i, i / N); a[i * 3] = p[0]; a[i * 3 + 1] = p[1]; a[i * 3 + 2] = p[2]; } shapes.push(a); };
  const golden = Math.PI * (3 - Math.sqrt(5));
  // 0 · globe (intro)
  make((i) => { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i; return [Math.cos(th) * r * R, y * R, Math.sin(th) * r * R]; });
  // 1 · ring / torus (about)
  make((i, t) => { const u = t * Math.PI * 2 * 24, v = (i * 0.618) % 1 * Math.PI * 2, a = 12, b = 3.2; return [(a + b * Math.cos(v)) * Math.cos(u), b * Math.sin(v), (a + b * Math.cos(v)) * Math.sin(u)]; });
  // 2 · wave surface (services)
  make((i) => { const side = Math.ceil(Math.sqrt(N)), gx = i % side, gz = Math.floor(i / side); const x = (gx / side - 0.5) * 34, z = (gz / side - 0.5) * 24; return [x, Math.sin(x * 0.35) * 2.6 + Math.cos(z * 0.4) * 2.2 - 2, z]; });
  // 3 · bar chart (work)
  make((i) => { const bars = 12, col = i % bars, k = Math.floor(i / bars), per = Math.floor(N / bars); const h = [4, 7, 5.5, 9, 6.5, 11, 8, 13, 10, 15, 12, 17][col]; const y = (k / per) * h; return [(col - (bars - 1) / 2) * 2.4 + (Math.random() - 0.5) * 1.1, y - 7, (Math.random() - 0.5) * 1.6]; });
  // 4 · helix / timeline (experience)
  make((i, t) => { const strand = i % 2, a = t * Math.PI * 10 + strand * Math.PI; return [Math.cos(a) * 6 + (Math.random() - 0.5) * 0.8, (t - 0.5) * 30, Math.sin(a) * 6 + (Math.random() - 0.5) * 0.8]; });
  // 5 · spiral galaxy (skills & contact)
  make((i, t) => { const arm = i % 3, r = Math.pow(t, 0.6) * 16, a = r * 0.45 + arm * (Math.PI * 2 / 3); const s = (1 - t) * 1.6 + 0.3; return [Math.cos(a) * r + (Math.random() - 0.5) * s, (Math.random() - 0.5) * s * 0.8, Math.sin(a) * r + (Math.random() - 0.5) * s]; });

  /* ---------- Particles ---------- */
  const pos = new Float32Array(N * 3), vel = new Float32Array(N * 3), col = new Float32Array(N * 3), seed = new Float32Array(N);
  pos.set(shapes[0]);
  const palette = [new THREE.Color(0xd83f87), new THREE.Color(0x8a5cf6), new THREE.Color(0xe98074), new THREE.Color(0xf5d0e0)];
  const c = new THREE.Color();
  for (let i = 0; i < N; i++) {
    const t = Math.random();
    if (t < 0.45) c.copy(palette[0]).lerp(palette[1], Math.random());
    else if (t < 0.8) c.copy(palette[1]).lerp(palette[2], Math.random());
    else c.copy(palette[3]);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    seed[i] = Math.random() * Math.PI * 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));

  // soft round sprite
  const sprite = document.createElement("canvas"); sprite.width = sprite.height = 64;
  const g = sprite.getContext("2d"), grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)"); grd.addColorStop(0.35, "rgba(255,255,255,0.55)"); grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  const mat = new THREE.PointsMaterial({ size: small ? 0.42 : 0.36, map: new THREE.CanvasTexture(sprite), vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group(); group.add(points); scene.add(group);

  /* ---------- Interaction ---------- */
  const mouse = new THREE.Vector2(9, 9), mouseWorld = new THREE.Vector3(999, 999, 0), eased = { x: 0, y: 0 };
  const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), tmp = new THREE.Vector3();
  const inv = new THREE.Matrix4();
  function toWorld(cx, cy, out) {
    mouse.set((cx / window.innerWidth) * 2 - 1, -(cy / window.innerHeight) * 2 + 1);
    ray.setFromCamera(mouse, camera);
    if (ray.ray.intersectPlane(plane, tmp)) { inv.copy(group.matrixWorld).invert(); out.copy(tmp).applyMatrix4(inv); return true; }
    return false;
  }
  window.addEventListener("pointermove", (e) => { if (!reduceMotion) toWorld(e.clientX, e.clientY, mouseWorld); eased.tx = e.clientX / window.innerWidth - 0.5; eased.ty = e.clientY / window.innerHeight - 0.5; }, { passive: true });
  window.addEventListener("pointerleave", () => mouseWorld.set(999, 999, 0));
  window.addEventListener("pointerdown", (e) => {
    if (reduceMotion || e.target.closest("a, button, input, textarea, dialog, .glass, .lg, .nav")) return;
    const p = new THREE.Vector3();
    if (!toWorld(e.clientX, e.clientY, p)) return;
    for (let i = 0; i < N; i++) {
      const dx = pos[i * 3] - p.x, dy = pos[i * 3 + 1] - p.y, dz = pos[i * 3 + 2] - p.z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.001;
      const f = 3.2 * Math.exp(-d * 0.18) / d;
      vel[i * 3] += dx * f; vel[i * 3 + 1] += dy * f; vel[i * 3 + 2] += dz * f;
    }
  });

  /* ---------- Resize / visibility ---------- */
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 760 ? 44 : 34;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize); resize();

  let scrollY = window.scrollY;
  window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });
  const ease = (x) => x * x * (3 - 2 * x);
  const clock = new THREE.Clock();
  eased.tx = 0; eased.ty = 0;

  function step() {
    const t = clock.getElapsedTime();
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const sp = Math.min(1, scrollY / max) * (shapes.length - 1);
    const a = Math.floor(Math.min(sp, shapes.length - 1.0001)), f = ease(sp - a);
    const A = shapes[a], B = shapes[a + 1];
    const mx = mouseWorld.x, my = mouseWorld.y, mz = mouseWorld.z;
    for (let i = 0; i < N; i++) {
      const k = i * 3, s = seed[i];
      // target = morph between two shapes + gentle breathing
      const tx = A[k] + (B[k] - A[k]) * f + Math.sin(t * 0.8 + s) * 0.12;
      const ty = A[k + 1] + (B[k + 1] - A[k + 1]) * f + Math.cos(t * 0.7 + s) * 0.12;
      const tz = A[k + 2] + (B[k + 2] - A[k + 2]) * f;
      // spring toward target
      vel[k] += (tx - pos[k]) * 0.035; vel[k + 1] += (ty - pos[k + 1]) * 0.035; vel[k + 2] += (tz - pos[k + 2]) * 0.035;
      // mouse repel
      const dx = pos[k] - mx, dy = pos[k + 1] - my, dz = pos[k + 2] - mz, d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < 16) { const fr = (16 - d2) * 0.012; vel[k] += dx * fr; vel[k + 1] += dy * fr; vel[k + 2] += dz * fr; }
      vel[k] *= 0.86; vel[k + 1] *= 0.86; vel[k + 2] *= 0.86;
      pos[k] += vel[k]; pos[k + 1] += vel[k + 1]; pos[k + 2] += vel[k + 2];
    }
    geo.attributes.position.needsUpdate = true;
    eased.x += (eased.tx - eased.x) * 0.05; eased.y += (eased.ty - eased.y) * 0.05;
    group.rotation.y = t * 0.06 + sp * 0.9 + eased.x * 0.5;
    group.rotation.x = 0.25 + eased.y * 0.3 - sp * 0.05;
    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    renderer.render(scene, camera);
    window.addEventListener("resize", () => renderer.render(scene, camera));
  } else {
    (function frame() { requestAnimationFrame(frame); if (!document.hidden) step(); })();
  }
  document.documentElement.classList.add("has-3d");
}
