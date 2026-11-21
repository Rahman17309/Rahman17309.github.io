// Background: a 3D "data terrain", a grid of bars whose heights flow like a live chart.
// Fixed behind the page; the camera orbits slowly and drifts with scroll and mouse.
import * as THREE from "three";

const canvas = document.getElementById("bg-canvas");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch { return false; }
}

if (canvas && supportsWebGL()) init();

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 16, 44);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const camBase = new THREE.Vector3(14, 13, 20);
  camera.position.copy(camBase);
  const target = new THREE.Vector3(3, 0, 0);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(8, 18, 10);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x64d2ff, 0.9);
  rim.position.set(-12, 6, -10);
  scene.add(rim);

  // Grid of bars
  const isSmall = window.innerWidth < 760;
  const N = isSmall ? 26 : 40;
  const SP = 0.62;
  const count = N * N;
  const geo = new THREE.BoxGeometry(0.46, 1, 0.46);
  geo.translate(0, 0.5, 0); // grow from the floor
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.15 });
  const bars = new THREE.InstancedMesh(geo, mat, count);
  bars.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(bars);

  const low = new THREE.Color(0x061a33);
  const mid = new THREE.Color(0x0a84ff);
  const high = new THREE.Color(0xbfe3ff);
  const tmpColor = new THREE.Color();
  const dummy = new THREE.Object3D();
  const offset = ((N - 1) * SP) / 2;

  // Floor grid lines for a "chart" feel
  const grid = new THREE.GridHelper(N * SP + 4, N + 6, 0x14243a, 0x0b1526);
  grid.position.y = -0.01;
  scene.add(grid);

  // Floating data points
  const pCount = isSmall ? 140 : 260;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 34;
    pPos[i * 3 + 1] = Math.random() * 12 + 1;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 34;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const points = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x64d2ff, size: 0.06, transparent: true, opacity: 0.55, depthWrite: false }));
  scene.add(points);

  // Interactive ripples: click/tap the background to drop a "data shock" into the terrain.
  const ripples = [];
  const raycaster = new THREE.Raycaster();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  const pointerNDC = new THREE.Vector2(9, 9);
  const hover = { x: 0, z: 0, on: false };
  function groundPoint(clientX, clientY) {
    pointerNDC.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(pointerNDC, camera);
    return raycaster.ray.intersectPlane(ground, hit) ? hit.clone() : null;
  }
  window.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button, input, textarea, dialog, .glass, .nav")) return;
    const p = groundPoint(e.clientX, e.clientY);
    if (p) { ripples.push({ x: p.x, z: p.z, t0: clock.getElapsedTime() }); if (ripples.length > 6) ripples.shift(); }
  });
  window.addEventListener("pointermove", (e) => {
    const p = groundPoint(e.clientX, e.clientY);
    if (p) { hover.x = p.x; hover.z = p.z; hover.on = true; }
  }, { passive: true });

  function rippleAt(x, z, now) {
    let h = 0;
    for (const r of ripples) {
      const age = now - r.t0;
      if (age > 4) continue;
      const d = Math.hypot(x - r.x, z - r.z);
      const front = age * 7;
      h += 2.6 * Math.exp(-age * 0.9) * Math.exp(-Math.pow(d - front, 2) * 0.35);
    }
    if (hover.on) {
      const d2 = (x - hover.x) ** 2 + (z - hover.z) ** 2;
      h += 1.4 * Math.exp(-d2 / 6);
    }
    return h;
  }

  function heightAt(x, z, t) {
    // a few travelling waves + a slow "trend" ridge, like overlapping time series
    const d = Math.sqrt(x * x + z * z);
    let h = Math.sin(x * 0.45 + t * 0.9) * 0.9
          + Math.cos(z * 0.38 - t * 0.7) * 0.8
          + Math.sin(d * 0.55 - t * 1.3) * 1.1
          + Math.sin((x + z) * 0.22 + t * 0.4) * 0.7;
    h = h * 0.55 + 1.9 + Math.max(0, 3.2 - d * 0.28);
    return Math.max(0.08, h + rippleAt(x, z, clock.getElapsedTime()));
  }

  function update(t) {
    let i = 0;
    for (let ix = 0; ix < N; ix++) {
      for (let iz = 0; iz < N; iz++) {
        const x = ix * SP - offset;
        const z = iz * SP - offset;
        const h = heightAt(x, z, t);
        dummy.position.set(x, 0, z);
        dummy.scale.set(1, h, 1);
        dummy.updateMatrix();
        bars.setMatrixAt(i, dummy.matrix);
        const k = Math.min(1, h / 5.2);
        if (k < 0.6) tmpColor.copy(low).lerp(mid, k / 0.6);
        else tmpColor.copy(mid).lerp(high, (k - 0.6) / 0.4);
        bars.setColorAt(i, tmpColor);
        i++;
      }
    }
    bars.instanceMatrix.needsUpdate = true;
    if (bars.instanceColor) bars.instanceColor.needsUpdate = true;
  }

  // Resize
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    target.set(0, 0.5, 0);
    camera.fov = w < 760 ? 50 : 38;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // Mouse parallax with damped follow (feels alive, never snaps)
  const mouse = { x: 0, y: 0 }, eased = { x: 0, y: 0 };
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    window.addEventListener("pointermove", (e) => {
      mouse.x = e.clientX / window.innerWidth - 0.5;
      mouse.y = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }

  // Only render while visible
  let visible = true;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 }).observe(canvas);

  const clock = new THREE.Clock();
  let scrollY = 0;
  window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });

  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const t = clock.getElapsedTime();
    update(t * 0.8);
    eased.x += (mouse.x - eased.x) * 0.04;
    eased.y += (mouse.y - eased.y) * 0.04;
    const orbit = t * 0.05;
    const r = 25;
    const sp = scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight); // 0..1
    camera.position.x = Math.sin(orbit + 0.6 + sp * 2.4) * r + eased.x * 4;
    camera.position.z = Math.cos(orbit + 0.6 + sp * 2.4) * r;
    camera.position.y = camBase.y - eased.y * 3 + sp * 6;
    camera.lookAt(target);
    points.rotation.y = t * 0.02;
    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    update(2.0);
    camera.lookAt(target);
    renderer.render(scene, camera);
    window.addEventListener("resize", () => renderer.render(scene, camera));
  } else {
    frame();
  }
  document.documentElement.classList.add("has-3d");
}
