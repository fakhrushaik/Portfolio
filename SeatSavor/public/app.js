/* SeatSavor frontend — Three.js isometric floor, gentle zoom, presets, themes, a11y. */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const FALLBACK_TABLES = [
  { id: "T1", seats: 2, shape: "Round", dimensions: "0.90 m diameter", status: "free", zone: "Window", note: "Quiet window spot for two, good morning light.", x: -9, z: -5.5 },
  { id: "T2", seats: 4, shape: "Rectangle", dimensions: "1.20 m × 0.80 m", status: "free", zone: "Window", note: "Window row, easy to watch the street.", x: -3, z: -5.5 },
  { id: "T3", seats: 6, shape: "Rectangle", dimensions: "2.00 m × 1.00 m", status: "occupied", zone: "Window", note: "Large window table, currently in use.", x: 3, z: -5.5 },
  { id: "T4", seats: 4, shape: "Square", dimensions: "1.00 m × 1.00 m", status: "free", zone: "Centre", note: "Central, easy to reach from the entrance.", x: 3, z: 5.5 },
  { id: "T5", seats: 2, shape: "Round", dimensions: "0.90 m diameter", status: "occupied", zone: "Centre", note: "Cosy centre table for two.", x: 9, z: -5.5 },
  { id: "T6", seats: 4, shape: "Rectangle", dimensions: "1.40 m × 0.85 m", status: "free", zone: "Centre", note: "Near the plants, a little quieter.", x: -9, z: 0 },
  { id: "T7", seats: 4, shape: "Rectangle", dimensions: "1.40 m × 0.85 m", status: "free", zone: "Centre", note: "Open centre table, good for groups of four.", x: -3, z: 0 },
  { id: "T8", seats: 8, shape: "Rectangle", dimensions: "2.40 m × 1.00 m", status: "free", zone: "Centre", note: "Long table for celebrations and big groups.", x: 3, z: 0 },
  { id: "T9", seats: 2, shape: "Round", dimensions: "0.90 m diameter", status: "occupied", zone: "Bar", note: "Close to the bar, lively in the evening.", x: 9, z: 0 },
  { id: "T10", seats: 4, shape: "Square", dimensions: "1.00 m × 1.00 m", status: "free", zone: "Garden", note: "Near the garden side, plants all around.", x: -9, z: 5.5 },
  { id: "T11", seats: 6, shape: "Rectangle", dimensions: "2.00 m × 1.00 m", status: "occupied", zone: "Garden", note: "Garden-side table for six, currently in use.", x: -3, z: 5.5 },
  { id: "T12", seats: 4, shape: "Rectangle", dimensions: "1.20 m × 0.80 m", status: "free", zone: "Bar", note: "Bar corner, easy to order and chat.", x: 9, z: 5.5 },
];

let tables = FALLBACK_TABLES;
try {
  const res = await fetch("/api/tables");
  if (res.ok) tables = await res.json();
} catch { /* offline / file:// fallback keeps the demo working */ }

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = null;
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.6;
controls.panSpeed = 0.6;
controls.minDistance = 6;
controls.maxDistance = 45;
controls.zoomSpeed = 0.35;

const reducedMotion = () =>
  document.body.classList.contains("a11y") || matchMedia("(prefers-reduced-motion: reduce)").matches;

scene.add(new THREE.AmbientLight(0xfff6e8, 0.9));
const sun = new THREE.DirectionalLight(0xffffff, 1.1);
sun.position.set(8, 14, 6); sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);
const fill = new THREE.PointLight(0xffe8c8, 0.5, 30); fill.position.set(0, 6, 0); scene.add(fill);

function mat(color) { return new THREE.MeshStandardMaterial({ color, roughness: 0.9 }); }
function box(w, h, d, color, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; scene.add(m); return m;
}
const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 18), mat(0xf3ead9));
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
box(26, 0.2, 0.3, 0xffffff, 0, 0.1, -9.1);
box(0.3, 0.2, 18, 0xffffff, -13.1, 0.1, 0);
box(5.0, 1.0, 0.7, 0xb08968, 9.0, 0.5, 8.6);
for (let i = 0; i < 3; i++) box(0.45, 0.65, 0.45, 0x8a6d4b, 7.6 + i * 1.4, 0.32, 7.8);
[[-12.2, -8.2], [12.2, -8.2], [-12.2, 8.2]].forEach(([x, z]) => {
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.5, 12), mat(0xc97b5a));
  pot.position.set(x, 0.25, z); pot.castShadow = true; scene.add(pot);
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 10), mat(0x7fb069));
  leaf.position.set(x, 0.9, z); leaf.castShadow = true; scene.add(leaf);
});
for (let i = 0; i < 4; i++) {
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 0.4, 16), mat(0xf2c14e));
  lamp.position.set(-9 + i * 6, 3.2, 0); scene.add(lamp);
}

function labelSprite(text) {
  const c = document.createElement("canvas"); c.width = 128; c.height = 64;
  const g = c.getContext("2d");
  g.fillStyle = "rgba(255,255,255,0.95)"; g.beginPath(); g.roundRect(14, 6, 100, 52, 14); g.fill();
  g.fillStyle = "#22252b"; g.font = "bold 30px system-ui"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(text, 64, 34);
  const tex = new THREE.CanvasTexture(c);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  s.scale.set(1.1, 0.55, 1); return s;
}

const FREE = 0x3b82f6, OCCUPIED = 0xf26d6d;
const groups = new Map();
tables.forEach((t) => {
  const group = new THREE.Group();
  const isRound = t.shape === "Round";
  const top = isRound
    ? new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.12, 24), mat(t.status === "free" ? FREE : OCCUPIED))
    : new THREE.Mesh(new THREE.BoxGeometry(t.shape === "Square" ? 1.1 : 1.6, 0.12, 1.0), mat(t.status === "free" ? FREE : OCCUPIED));
  top.position.y = 0.75; top.castShadow = true; group.add(top);
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.7, 10), mat(0x9a8f7a));
  leg.position.y = 0.35; group.add(leg);
  const chairGeo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
  const chairMat = mat(0xffffff);
  const offsets = [[0, -1.05], [0, 1.05], [-1.15, 0], [1.15, 0], [-0.7, -1.05], [0.7, 1.05], [-0.7, 1.05], [0.7, -1.05]];
  for (let i = 0; i < Math.min(t.seats, 8); i++) {
    const ch = new THREE.Mesh(chairGeo, chairMat);
    ch.position.set(offsets[i][0], 0.22, offsets[i][1]); ch.castShadow = true; group.add(ch);
  }
  const glow = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.15, 32),
    new THREE.MeshBasicMaterial({ color: t.status === "free" ? FREE : OCCUPIED, transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
  glow.rotation.x = -Math.PI / 2; glow.position.y = 0.02; group.add(glow);
  const label = labelSprite(t.id); label.position.y = 1.7; group.add(label);
  group.position.set(t.x, 0, t.z);
  group.userData = { table: t, top, glow };
  scene.add(group); groups.set(t.id, group);
});

let selected = null;
let camAnim = null;
function flyTo(pos, target) {
  if (reducedMotion()) { camera.position.set(...pos); controls.target.set(...target); controls.update(); return; }
  camAnim = { fromPos: camera.position.clone(), toPos: new THREE.Vector3(...pos), fromT: controls.target.clone(), toT: new THREE.Vector3(...target), start: performance.now(), dur: 900 };
}
const PRESETS = {
  poster: [[15, 15, 15], [0, 0, 0]],
  top: [[0, 28, 0.01], [0, 0, 0]],
  window: [[-9, 9, -13], [-2, 0, -3]],
  bar: [[13, 8, 13], [5, 0, 5]],
};
function applyPreset(name) { const p = PRESETS[name]; if (p) flyTo(p[0], p[1]); }
document.querySelectorAll("[data-preset],[data-view]").forEach((b) =>
  b.addEventListener("click", () => applyPreset(b.dataset.preset || b.dataset.view)));

const detailEl = document.getElementById("detail");
const footprintEl = document.getElementById("footprint");
function footprintSVG(t) {
  const round = t.shape === "Round";
  const table = round
    ? `<circle cx="60" cy="55" r="32" fill="#3b82f6" opacity="0.85"/>`
    : `<rect x="25" y="30" width="70" height="50" rx="8" fill="#3b82f6" opacity="0.85"/>`;
  let chairs = "";
  for (let i = 0; i < Math.min(t.seats, 8); i++) {
    const a = (i / Math.max(t.seats, 1)) * Math.PI * 2;
    chairs += `<circle cx="${60 + Math.cos(a) * 48}" cy="${55 + Math.sin(a) * 42}" r="7" fill="#fff" stroke="#999"/>`;
  }
  return `<svg viewBox="0 0 120 110" role="img" aria-label="Top-down footprint of ${t.id}">${chairs}${table}<text x="60" y="59" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold">${t.id}</text></svg>`;
}
function selectTable(id, { fly = true } = {}) {
  const t = tables.find((x) => x.id === id); if (!t) return;
  selected = t;
  groups.forEach((g, gid) => {
    const isSel = gid === id;
    g.userData.top.material.color.setHex(isSel ? 0x1d4ed8 : (g.userData.table.status === "free" ? FREE : OCCUPIED));
    g.userData.top.scale.setScalar(isSel ? 1.08 : 1);
    g.userData.glow.material.opacity = isSel ? 0.8 : 0.35;
  });
  document.querySelectorAll("#tableList button").forEach((b) => b.classList.toggle("selected", b.dataset.id === id));
  detailEl.innerHTML = `<p class="big">${t.id} — ${t.zone}</p>
    <p><span class="badge ${t.status}">${t.status === "free" ? "✓ Free" : "● Occupied"}</span></p>
    <p>${t.seats} seats • ${t.shape} • ${t.dimensions}<br>${t.note}</p>`;
  footprintEl.innerHTML = footprintSVG(t);
  if (fly) {
    const g = groups.get(id);
    flyTo([g.position.x + 4.5, 6.5, g.position.z + 5.5], [g.position.x, 0, g.position.z]);
  }
}

const listEl = document.getElementById("tableList");
let filter = "all";
function renderList() {
  listEl.innerHTML = "";
  tables.filter((t) => filter === "all" || t.status === filter).forEach((t) => {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.id = t.id; b.setAttribute("role", "option");
    b.innerHTML = `<span><strong>${t.id}</strong> · ${t.seats} seats · ${t.zone}</span><span class="badge ${t.status}">${t.status}</span>`;
    b.addEventListener("click", () => selectTable(t.id));
    listEl.appendChild(b);
  });
  if (selected) document.querySelectorAll("#tableList button").forEach((b) => b.classList.toggle("selected", b.dataset.id === selected.id));
}
document.querySelectorAll(".filter").forEach((b) => b.addEventListener("click", () => {
  filter = b.dataset.filter;
  document.querySelectorAll(".filter").forEach((x) => x.classList.toggle("active", x === b));
  renderList();
}));
renderList();

listEl.addEventListener("keydown", (e) => {
  const btns = [...listEl.querySelectorAll("button")]; const i = btns.indexOf(document.activeElement);
  if (e.key === "ArrowDown" && i >= 0) { e.preventDefault(); btns[(i + 1) % btns.length].focus(); }
  if (e.key === "ArrowUp" && i >= 0) { e.preventDefault(); btns[(i - 1 + btns.length) % btns.length].focus(); }
});
canvas.addEventListener("keydown", (e) => {
  if (!tables.length) return;
  const i = selected ? tables.findIndex((t) => t.id === selected.id) : -1;
  if (e.key === "ArrowRight") selectTable(tables[(i + 1 + tables.length) % tables.length].id);
  if (e.key === "ArrowLeft") selectTable(tables[(i - 1 + tables.length) % tables.length].id);
});

const ray = new THREE.Raycaster(); const ptr = new THREE.Vector2(); let downPos = null;
canvas.addEventListener("pointerdown", (e) => { downPos = [e.clientX, e.clientY]; });
canvas.addEventListener("pointerup", (e) => {
  if (!downPos) return;
  const moved = Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1]); downPos = null;
  if (moved > 5) return;
  const r = canvas.getBoundingClientRect();
  ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects([...groups.values()], true);
  if (hits.length) {
    let o = hits[0].object;
    while (o && !o.userData.table) o = o.parent;
    if (o) selectTable(o.userData.table.id);
  }
});

const themeBtn = document.getElementById("themeBtn");
const a11yBtn = document.getElementById("a11yBtn");
function applyTheme() {
  const dark = document.body.dataset.theme === "dark";
  themeBtn.textContent = dark ? "☀️ Light mode" : "🌙 Dark mode";
  themeBtn.setAttribute("aria-pressed", String(dark));
}
function applyA11y() {
  const on = document.body.classList.contains("a11y");
  a11yBtn.textContent = on ? "♿ Accessibility: on" : "♿ Accessibility mode";
  a11yBtn.setAttribute("aria-pressed", String(on));
}
try {
  if (localStorage.getItem("seatsavor-theme")) document.body.dataset.theme = localStorage.getItem("seatsavor-theme");
  if (localStorage.getItem("seatsavor-a11y") === "1") document.body.classList.add("a11y");
} catch {}
applyTheme(); applyA11y();
themeBtn.addEventListener("click", () => {
  document.body.dataset.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("seatsavor-theme", document.body.dataset.theme); } catch {}
  applyTheme();
});
a11yBtn.addEventListener("click", () => {
  document.body.classList.toggle("a11y");
  try { localStorage.setItem("seatsavor-a11y", document.body.classList.contains("a11y") ? "1" : "0"); } catch {}
  applyA11y();
});
document.getElementById("rotateBtn").addEventListener("click", (e) => {
  controls.autoRotate = !controls.autoRotate; controls.autoRotateSpeed = 0.8;
  e.currentTarget.setAttribute("aria-pressed", String(controls.autoRotate));
});
document.getElementById("editBtn").addEventListener("click", () => {
  document.getElementById("bookingMsg").textContent = "Edit Layout is a v1.1 placeholder in SeatSavor — tables cannot be dragged yet.";
});
document.getElementById("openBtn").addEventListener("click", (e) => {
  const msg = document.getElementById("bookingMsg");
  msg.textContent = "OPEN/CLOSED toggle is visual only in this demo.";
});

const zoomSpeedEl = document.getElementById("zoomSpeed");
const zoomSpeedVal = document.getElementById("zoomSpeedVal");
function applyZoomSpeed() {
  controls.zoomSpeed = Number(zoomSpeedEl.value);
  zoomSpeedVal.textContent = zoomSpeedEl.value;
}
zoomSpeedEl.addEventListener("input", () => {
  applyZoomSpeed();
  try { localStorage.setItem("seatsavor-zoom", zoomSpeedEl.value); } catch {}
});
try { if (localStorage.getItem("seatsavor-zoom")) zoomSpeedEl.value = localStorage.getItem("seatsavor-zoom"); } catch {}
applyZoomSpeed();
function stepZoom(dir) {
  const v = camera.position.clone().sub(controls.target).multiplyScalar(dir > 0 ? 0.88 : 1.14);
  const len = THREE.MathUtils.clamp(v.length(), controls.minDistance, controls.maxDistance);
  camera.position.copy(controls.target).add(v.setLength(len));
}
document.getElementById("zoomIn").addEventListener("click", () => stepZoom(1));
document.getElementById("zoomOut").addEventListener("click", () => stepZoom(-1));

document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("bookingMsg");
  if (!selected) { msg.textContent = "Pick a table first."; return; }
  const body = {
    tableId: selected.id,
    date: document.getElementById("bkDate").value,
    time: document.getElementById("bkTime").value,
    party: Number(document.getElementById("bkParty").value),
    name: document.getElementById("bkName").value,
  };
  try {
    const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    msg.textContent = res.ok ? `Demo booking saved: ${data.booking.tableId} on ${data.booking.date} at ${data.booking.time} for ${data.booking.party}. (In-memory only.)`
      : `Could not book: ${(data.errors || ["Unknown error"]).join("; ")}`;
  } catch { msg.textContent = "Backend not reachable — run the server (npm start) to use demo bookings."; }
});
document.getElementById("resetBookings").addEventListener("click", async () => {
  const msg = document.getElementById("bookingMsg");
  try { await fetch("/api/bookings/reset", { method: "POST" }); msg.textContent = "Demo bookings cleared."; }
  catch { msg.textContent = "Backend not reachable."; }
});

function resize() {
  const w = canvas.clientWidth || 800, h = canvas.clientHeight || 520;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener("resize", resize); resize();
applyPreset("poster");
function animate(now) {
  requestAnimationFrame(animate);
  if (camAnim) {
    const t = Math.min((now - camAnim.start) / camAnim.dur, 1);
    const e = 1 - Math.pow(1 - t, 3);
    camera.position.lerpVectors(camAnim.fromPos, camAnim.toPos, e);
    controls.target.lerpVectors(camAnim.fromT, camAnim.toT, e);
    if (t >= 1) camAnim = null;
  }
  controls.update(); renderer.render(scene, camera);
}
requestAnimationFrame(animate);
