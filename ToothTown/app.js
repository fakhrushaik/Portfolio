// ToothTown v2 — frontend. Static-first: tries /api, falls back to localStorage.
// Same field names as server/db/schema.sql and server/db/seed.json.
// Fictional demo data only. No patient figures in any view.
const LS_KEY = 'toothtown-v2';
const SERVICES = [
  {id:'checkup', name:'Checkup', duration_minutes:30},
  {id:'cleaning', name:'Cleaning', duration_minutes:45},
  {id:'filling', name:'Filling', duration_minutes:45},
  {id:'root-canal', name:'Root Canal', duration_minutes:60},
  {id:'kids-checkup', name:'Kids Checkup', duration_minutes:30},
  {id:'xray-check', name:'X-Ray Check', duration_minutes:30},
];
const ROOM_GEO = [
  {id:'xray', n:6, name:'X-Ray', x:30, y:30, w:140, h:180, door:'south', thick:true},
  {id:'storage', n:5, name:'Storage', x:170, y:30, w:180, h:180, door:'south'},
  {id:'op1', n:1, name:'OP1', sub:'Children & Heavy', x:350, y:30, w:270, h:180, door:'south'},
  {id:'doc1', n:7, name:'Doctor Office 1', x:620, y:30, w:240, h:180, door:'south'},
  {id:'op4', n:4, name:'OP4', x:30, y:270, w:180, h:170, door:'north'},
  {id:'op3', n:3, name:'OP3', x:210, y:270, w:180, h:170, door:'north'},
  {id:'op2', n:2, name:'OP2', x:390, y:270, w:180, h:170, door:'north'},
  {id:'doc2', n:8, name:'Doctor Office 2', x:570, y:270, w:160, h:170, door:'north'},
  {id:'it', n:9, name:'IT Office', x:730, y:270, w:130, h:170, door:'north'},
  {id:'play', n:12, name:'Child Play Area', x:30, y:440, w:160, h:120, door:'south'},
  {id:'snacks', n:11, name:'Snacks & Info', sub:'Brochure counter', x:190, y:440, w:240, h:120, door:'south'},
  {id:'wash1', n:13, name:'Washroom 1', x:430, y:440, w:130, h:120, door:'south'},
  {id:'wash2', n:14, name:'Washroom 2', x:560, y:440, w:130, h:120, door:'south'},
  {id:'reception', n:10, name:'Reception', sub:'Printers & scanners', x:690, y:440, w:170, h:120, door:'south'},
];
function todayStr(d){ const x=d||new Date(); return x.toISOString().slice(0,10); }
function seedData(){
  const t = todayStr();
  return {
    rooms: [
      {id:'op1',number:1,name:'OP1 — Children & Heavy Dental',type:'operatory',bookable:1,notes:'Doc chair, patient chair, wash basin — see room detail panel only.'},
      {id:'op2',number:2,name:'OP2',type:'operatory',bookable:1,notes:'Doc chair, patient chair, wash basin — see room detail panel only.'},
      {id:'op3',number:3,name:'OP3',type:'operatory',bookable:1,notes:'Doc chair, patient chair, wash basin — see room detail panel only.'},
      {id:'op4',number:4,name:'OP4',type:'operatory',bookable:1,notes:'Doc chair, patient chair, wash basin — see room detail panel only.'},
      {id:'storage',number:5,name:'Storage',type:'support',bookable:0,notes:'Supplies storage. Not bookable.'},
      {id:'xray',number:6,name:'X-Ray',type:'support',bookable:0,notes:'Thicker walls for protection. Not a bookable operatory.'},
      {id:'doc1',number:7,name:'Doctor Office 1',type:'office',bookable:0,notes:'Doctor office. Not bookable.'},
      {id:'doc2',number:8,name:'Doctor Office 2',type:'office',bookable:0,notes:'Doctor office. Not bookable.'},
      {id:'it',number:9,name:'IT Office',type:'office',bookable:0,notes:'IT Admin base. Not bookable.'},
      {id:'reception',number:10,name:'Reception',type:'support',bookable:0,notes:'Reception with printers and scanners.'},
      {id:'snacks',number:11,name:'Snacks & Information / Brochure',type:'support',bookable:0,notes:'Counter in the waiting zone.'},
      {id:'play',number:12,name:'Child Play Area',type:'waiting',bookable:0,notes:'Waiting-zone play area.'},
      {id:'wash1',number:13,name:'Washroom 1',type:'utility',bookable:0,notes:'Closed labelled room only.'},
      {id:'wash2',number:14,name:'Washroom 2',type:'utility',bookable:0,notes:'Closed labelled room only.'},
      {id:'tvs',number:15,name:'TVs x2',type:'feature',bookable:0,notes:'Wall-mounted screens in Waiting, on walls only.'},
      {id:'seating',number:16,name:'Seating',type:'feature',bookable:0,notes:'Individual chairs in Waiting.'},
      {id:'plants',number:17,name:'Plants',type:'feature',bookable:0,notes:'Small potted plants in Waiting and lobby.'},
      {id:'coat',number:18,name:'Coat Rack',type:'feature',bookable:0,notes:'Coat rack in the southeast lobby.'},
      {id:'doors',number:19,name:'Doors',type:'feature',bookable:0,notes:'Door system: a gap in a wall plus a leaf and swing arc, anchored in that wall.'},
    ],
    staff: [
      {id:'dr-john',name:'Dr John',role:'doctor',access_level:'approve',room_id:'doc1'},
      {id:'dr-mary',name:'Dr Mary',role:'doctor',access_level:'approve',room_id:'doc2'},
      {id:'anna',name:'Anna',role:'receptionist',access_level:'schedule',room_id:'reception'},
      {id:'shaik',name:'Shaik',role:'it_admin',access_level:'full',room_id:'it'},
    ],
    patients: [
      {id:'p1',name:'Ava Brooks',phone:'555-0101',preference:'Morning'},
      {id:'p2',name:'Mia Chen',phone:'555-0102',preference:'Kids room'},
      {id:'p3',name:'Liam Patel',phone:'555-0103',preference:'Any doctor'},
      {id:'p4',name:'Noah Kim',phone:'555-0104',preference:'Afternoon'},
      {id:'p5',name:'Emma Wilson',phone:'555-0105',preference:'Dr Mary'},
      {id:'p6',name:'Oliver Reed',phone:'555-0106',preference:'Any doctor'},
    ],
    services: SERVICES,
    appointments: [
      {id:'a1',patient_id:'p1',doctor_id:'dr-john',room_id:'op1',service_id:'checkup',date:t,start_time:'09:00',end_time:'09:30',status:'approved',kind:'scheduled',reject_reason:'',created_by_role:'receptionist'},
      {id:'a2',patient_id:'p2',doctor_id:'dr-john',room_id:'op4',service_id:'kids-checkup',date:t,start_time:'10:00',end_time:'10:30',status:'approved',kind:'scheduled',reject_reason:'',created_by_role:'receptionist'},
      {id:'a3',patient_id:'p5',doctor_id:'dr-mary',room_id:'op2',service_id:'cleaning',date:t,start_time:'11:00',end_time:'11:45',status:'approved',kind:'scheduled',reject_reason:'',created_by_role:'receptionist'},
    ],
    waitlist: [],
  };
}
let data = null, apiMode = false, selectedDate = todayStr(), selectedRoom = 'op1', book = {step:1, patient:'', service:'checkup', doctor:'dr-john', room:'op1', date:todayStr(), time:'', duration:30};
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s==null?'':s).replace(/[&<>"]/g, (c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pat = (id) => data.patients.find((p)=>p.id===id) || {name:'—'};
const docName = (id) => (data.staff.find((s)=>s.id===id)||{name:'—'}).name;
const roomName = (id) => (data.rooms.find((r)=>r.id===id)||{name:id}).name;
const svcName = (id) => (SERVICES.find((s)=>s.id===id)||{name:id}).name;
function toMin(t){ const [h,m]=t.split(':').map(Number); return h*60+m; }
function addMin(t, mins){ const v=toMin(t)+mins; return String(Math.floor(v/60)).padStart(2,'0')+':'+String(v%60).padStart(2,'0'); }
function overlaps(aS,aE,bS,bE){ return toMin(aS)<toMin(bE) && toMin(aE)>toMin(bS); }
function isActive(a){ return !['cancelled','rejected','waitlist'].includes(a.status); }
function findConflict(c, ignoreId){
  return data.appointments.find((a)=> a.id!==ignoreId && a.date===c.date && isActive(a) && (a.doctor_id===c.doctor_id || a.room_id===c.room_id) && overlaps(c.start_time,c.end_time,a.start_time,a.end_time));
}
function slotsFor(date, doctor, room){
  const out=[]; for(let m=540;m<=990;m+=30){ const t=String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'); const taken=data.appointments.some((a)=>a.date===date && isActive(a) && (a.doctor_id===doctor || a.room_id===room) && a.start_time===t); out.push({time:t, free:!taken}); } return out;
}
function showBanner(msg, kind){
  const el=$('banner'); el.innerHTML = msg ? `<div class="banner ${kind||'info'}">${esc(msg)}</div>` : '';
}
async function loadData(){
  try{
    const r = await fetch('/api/appointments');
    if(!r.ok) throw new Error('no api');
    const [rooms, staff, patients, services, appointments] = await Promise.all([
      fetch('/api/rooms').then(x=>x.json()), fetch('/api/staff').then(x=>x.json()),
      fetch('/api/patients').then(x=>x.json()), fetch('/api/services').then(x=>x.json()), r.json(),
    ]);
    data = {rooms, staff, patients, services, appointments, waitlist:[]}; apiMode = true;
  }catch(e){
    try{ const saved = JSON.parse(localStorage.getItem(LS_KEY)||'null'); data = saved && saved.patients ? saved : seedData(); }
    catch(err){ data = seedData(); }
    if(!localStorage.getItem(LS_KEY)) localStorage.setItem(LS_KEY, JSON.stringify(data));
    apiMode = false;
  }
}
function saveLocal(){ if(!apiMode) localStorage.setItem(LS_KEY, JSON.stringify(data)); }
async function apiCall(method, url, body){
  if(!apiMode) return null;
  const r = await fetch(url, {method, headers:{'Content-Type':'application/json','x-demo-role':currentRole()}, body: body?JSON.stringify(body):undefined});
  const j = await r.json().catch(()=>({})); if(!r.ok) throw new Error(j.error || 'Request failed'); return j;
}
function currentRole(){
  const v = $('roleSel').value;
  if(v==='doctor-mary') return 'doctor';
  if(v==='doctor') return 'doctor';
  if(v==='it_admin') return 'it_admin';
  return 'receptionist';
}
function currentDoctorId(){
  const v = $('roleSel').value;
  return v==='doctor-mary' ? 'dr-mary' : v==='doctor' ? 'dr-john' : null;
}
function canApprove(){
  const r = currentRole(); return r==='doctor' || r==='it_admin';
}

// ---------- Floor plan: walls with real gaps, never floating frames ----------
function wallWithDoor(x1,y1,x2,y2, doorSide, room, gap){
  // doorSide: which side of THIS room the door is on; wall line is x1,y1->x2,y2.
  // Returns SVG for wall segments + leaf + arc, or a plain line.
  const horiz = y1===y2;
  const len = horiz ? Math.abs(x2-x1) : Math.abs(y2-y1);
  const gc = len/2; // centre gap, keeps doors centred in each wall
  if(!doorSide) return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#12212B" stroke-width="${room.thick?6:2.5}" />`;
  const dir = horiz ? Math.sign(x2-x1) : Math.sign(y2-y1);
  const g1 = horiz ? x1 + dir*(gc-gap/2) : x1;
  const g1y = horiz ? y1 : y1 + dir*(gc-gap/2);
  const g2 = horiz ? x1 + dir*(gc+gap/2) : x1;
  const g2y = horiz ? y1 : y1 + dir*(gc+gap/2);
  // Interior direction: north wall -> interior below (+y), south wall -> above (-y),
  // west wall -> interior right (+x), east wall -> interior left (-x).
  let leafEnd, arcSweep;
  if(horiz){
    const inY = room.door==='north' ? 1 : -1;
    leafEnd = [g1 + dir*30, y1 + inY*30]; arcSweep = inY===1 ? 0 : 1;
    return `<line x1="${x1}" y1="${y1}" x2="${g1}" y2="${y1}" stroke="#12212B" stroke-width="${room.thick?6:2.5}" />`+
      `<line x1="${g2}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#12212B" stroke-width="${room.thick?6:2.5}" />`+
      `<line x1="${g1}" y1="${y1}" x2="${leafEnd[0]}" y2="${leafEnd[1]}" stroke="#0F766E" stroke-width="2.5" />`+
      `<path d="M ${leafEnd[0]} ${leafEnd[1]} A ${gap} ${gap} 0 0 ${arcSweep} ${g2} ${y1}" fill="none" stroke="#0F766E" stroke-width="1.5" stroke-dasharray="4 3" opacity=".7" />`;
  } else {
    const inX = room.door==='west' ? 1 : -1;
    leafEnd = [x1 + inX*30, g1y + dir*30]; arcSweep = inX===1 ? 1 : 0;
    return `<line x1="${x1}" y1="${y1}" x2="${x1}" y2="${g1y}" stroke="#12212B" stroke-width="${room.thick?6:2.5}" />`+
      `<line x1="${x1}" y1="${g2y}" x2="${x2}" y2="${y2}" stroke="#12212B" stroke-width="${room.thick?6:2.5}" />`+
      `<line x1="${x1}" y1="${g1y}" x2="${leafEnd[0]}" y2="${leafEnd[1]}" stroke="#0F766E" stroke-width="2.5" />`+
      `<path d="M ${leafEnd[0]} ${leafEnd[1]} A ${gap} ${gap} 0 0 ${arcSweep} ${x1} ${g2y}" fill="none" stroke="#0F766E" stroke-width="1.5" stroke-dasharray="4 3" opacity=".7" />`;
  }
}
function roomWalls(r){
  const {x,y,w,h} = r; const gap=42;
  return wallWithDoor(x,y,x+w,y, r.door==='north'? 'north':null, r, gap) +
    wallWithDoor(x+w,y,x+w,y+h, r.door==='east'? 'east':null, r, gap) +
    wallWithDoor(x,y+h,x+w,y+h, r.door==='south'? 'south':null, r, gap) +
    wallWithDoor(x,y,x,y+h, r.door==='west'? 'west':null, r, gap);
}
function inUseToday(roomId){
  return data.appointments.some((a)=>a.room_id===roomId && a.date===selectedDate && a.status==='approved');
}
function renderPlan(){
  const bg = {Morning:'#F6F8F7', Sunrise:'#FFF7ED', Sunset:'#FEF3C7', Rain:'#E0F2FE', Snow:'#F8FAFC', Night:'#1F2A33'}[$('bgTheme').value] || '#F6F8F7';
  const night = $('bgTheme').value==='Night';
  let s = `<svg viewBox="0 0 1000 720" width="100%" role="img" aria-label="Top-down clinic floor plan" style="background:${bg};border:1px solid #D9E2E3;border-radius:14px;display:block">`;
  // Waiting area fill (open area, no north wall: that wall is the lower rooms' south walls, with their door gaps)
  s += `<rect x="30" y="560" width="670" height="130" fill="#FFFFFF" />`;
  s += `<rect x="700" y="560" width="160" height="130" fill="#E0F2FE" />`;
  s += `<rect x="860" y="30" width="110" height="660" fill="#F6F8F7" />`;
  s += `<text x="915" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="#12212B">Leads to</text><text x="915" y="78" text-anchor="middle" font-size="13" font-weight="700" fill="#12212B">Basement</text>`;
  // Hallway band label
  s += `<text x="445" y="242" text-anchor="middle" font-size="13" fill="#5B6B76" font-weight="700">HALLWAY</text>`;
  // Waiting label
  s += `<text x="365" y="580" text-anchor="middle" font-size="15" font-weight="800" fill="#12212B">Waiting Area</text>`;
  s += `<text x="780" y="580" text-anchor="middle" font-size="13" font-weight="800" fill="#12212B">Entrance Lobby</text>`;
  // Main rooms
  ROOM_GEO.forEach((r)=>{
    const used = inUseToday(r.id);
    const fill = used ? '#1F2A33' : '#FFFFFF';
    const txt = used ? '#FFFFFF' : '#12212B';
    s += `<g class="plan-room" data-room="${r.id}" tabindex="0" role="button" aria-label="${esc(r.name)}${used?', in use':', available'}" style="cursor:pointer">`;
    s += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${fill}" />`;
    s += roomWalls(r);
    const cy = r.y + r.h/2;
    s += `<text x="${r.x+r.w/2}" y="${cy-2}" text-anchor="middle" font-size="14" font-weight="800" fill="${txt}">${r.n} · ${esc(r.name)}</text>`;
    if(r.sub) s += `<text x="${r.x+r.w/2}" y="${cy+16}" text-anchor="middle" font-size="11" fill="${used?'#D7EFE6':'#5B6B76'}">${esc(r.sub)}</text>`;
    if(used) s += `<text x="${r.x+r.w/2}" y="${cy+32}" text-anchor="middle" font-size="11" font-weight="700" fill="#FFFFFF">IN USE</text>`;
    s += `</g>`;
  });
  // Waiting outer walls: west, south, and east (lobby) wall with a door gap to the lobby.
  // West and south are plain; east wall is split at the lobby door (y 604-646).
  s += `<line x1="30" y1="560" x2="30" y2="690" stroke="#12212B" stroke-width="2.5" />`;
  s += `<line x1="30" y1="690" x2="700" y2="690" stroke="#12212B" stroke-width="2.5" />`;
  s += `<line x1="700" y1="560" x2="700" y2="604" stroke="#12212B" stroke-width="2.5" /><line x1="700" y1="646" x2="700" y2="690" stroke="#12212B" stroke-width="2.5" />`;
  s += `<line x1="700" y1="604" x2="730" y2="634" stroke="#0F766E" stroke-width="2.5" /><path d="M 730 634 A 42 42 0 0 1 700 646" fill="none" stroke="#0F766E" stroke-width="1.5" stroke-dasharray="4 3" opacity=".7" />`;
  // Lobby walls: south wall with main entrance gap (x 759-801), east wall with basement gap (y 604-646).
  s += `<line x1="700" y1="690" x2="759" y2="690" stroke="#12212B" stroke-width="2.5" /><line x1="801" y1="690" x2="860" y2="690" stroke="#12212B" stroke-width="2.5" />`;
  s += `<line x1="759" y1="690" x2="759" y2="660" stroke="#0F766E" stroke-width="2.5" /><path d="M 759 660 A 42 42 0 0 1 801 690" fill="none" stroke="#0F766E" stroke-width="1.5" stroke-dasharray="4 3" opacity=".7" />`;
  s += `<text x="780" y="706" text-anchor="middle" font-size="11" font-weight="700" fill="#12212B">Main Entrance</text>`;
  s += `<line x1="860" y1="560" x2="860" y2="604" stroke="#12212B" stroke-width="2.5" /><line x1="860" y1="646" x2="860" y2="690" stroke="#12212B" stroke-width="2.5" />`;
  s += `<line x1="860" y1="604" x2="890" y2="634" stroke="#0F766E" stroke-width="2.5" /><path d="M 890 634 A 42 42 0 0 1 860 646" fill="none" stroke="#0F766E" stroke-width="1.5" stroke-dasharray="4 3" opacity=".7" />`;
  // Basement outer walls: north, east, south; west wall is the rooms' east walls plus the lobby gap above.
  s += `<line x1="860" y1="30" x2="970" y2="30" stroke="#12212B" stroke-width="2.5" /><line x1="970" y1="30" x2="970" y2="690" stroke="#12212B" stroke-width="2.5" /><line x1="860" y1="690" x2="970" y2="690" stroke="#12212B" stroke-width="2.5" />`;
  // Stairs descending: steps get darker toward the lower landing, with a DOWN arrow.
  // No separate dark box: the darkest step IS the landing, labelled, at the foot of the steps.
  const steps = ['#E0F2FE','#BFDBFE','#94A3B8','#64748B','#1F2A33'];
  steps.forEach((c,i)=>{
    const y = 575 + i*20;
    s += `<rect x="875" y="${y}" width="80" height="18" fill="${c}" stroke="#12212B" stroke-width="1" />`;
  });
  s += `<text x="915" y="685" text-anchor="middle" font-size="12" font-weight="800" fill="#FFFFFF">DOWN ↓</text>`;
  s += `<text x="915" y="565" text-anchor="middle" font-size="11" fill="#12212B">Stairs down</text>`;
  // Waiting: individual chairs in two clean rows (no continuous bar).
  [585, 635].forEach((y)=>{
    [60,160,260,360,460,560].forEach((x)=>{
      s += `<rect x="${x}" y="${y}" width="30" height="18" rx="3" fill="#FFFFFF" stroke="#0F766E" stroke-width="1.5" /><rect x="${x}" y="${y-5}" width="30" height="6" rx="3" fill="#D7EFE6" stroke="#0F766E" stroke-width="1" />`;
    });
  });
  // Wall-mounted TVs: on the west wall and on the south wall, touching those walls.
  s += `<rect x="32" y="600" width="6" height="52" fill="#E0F2FE" stroke="#0F766E" stroke-width="1.5" /><text x="48" y="630" font-size="11" font-weight="700" fill="#12212B">TV</text>`;
  s += `<rect x="300" y="682" width="58" height="6" fill="#E0F2FE" stroke="#0F766E" stroke-width="1.5" /><text x="329" y="676" text-anchor="middle" font-size="11" font-weight="700" fill="#12212B">TV</text>`;
  // Small potted plants: pot + small foliage, never overlapping a door or chair.
  [[120,660],[520,612],[830,610]].forEach(([x,y])=>{
    s += `<rect x="${x-7}" y="${y}" width="14" height="10" fill="#B45309" /><circle cx="${x}" cy="${y-6}" r="9" fill="#15803D" />`;
  });
  s += `<text x="120" y="678" text-anchor="middle" font-size="10" fill="#5B6B76">Plant</text>`;
  // Coat rack in the lobby, away from all doors.
  s += `<line x1="720" y1="600" x2="720" y2="630" stroke="#12212B" stroke-width="2.5" /><line x1="712" y1="608" x2="728" y2="608" stroke="#12212B" stroke-width="2" /><text x="720" y="645" text-anchor="middle" font-size="11" font-weight="700" fill="#12212B">Coat Rack</text>`;
  s += `</svg>`;
  $('floorplan').innerHTML = s;
  document.querySelectorAll('.plan-room').forEach((g)=>{
    const go = ()=>{ selectedRoom = g.dataset.room; renderRoomDetail(); };
    g.addEventListener('click', go);
    g.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); go(); } });
  });
  if(night) $('bgNote').textContent = 'Night theme: plan backdrop is dark, but available rooms stay light and in-use rooms stay dark slate, so status stays readable.';
  else $('bgNote').textContent = 'Background theme changes the plan backdrop only. It does not change the clinic palette or room availability colours.';
}
function renderRoomDetail(){
  const room = data.rooms.find((r)=>r.id===selectedRoom);
  if(!room){ $('roomDetail').textContent = 'Select a room.'; return; }
  const todays = data.appointments.filter((a)=>a.room_id===selectedRoom && a.date===selectedDate && isActive(a));
  const used = todays.some((a)=>a.status==='approved');
  $('roomDetail').innerHTML = `<strong>${room.number} · ${esc(room.name)}</strong> — ${used?'<span class="pill inuse">IN USE</span>':'<span class="pill approved">Available</span>'}<br>${esc(room.notes)}<br>` +
    (todays.length ? todays.map((a)=>`${esc(a.start_time)}–${esc(a.end_time)} · ${esc(pat(a.patient_id).name)} with ${esc(docName(a.doctor_id))} · ${esc(svcName(a.service_id))} · <span class="pill ${a.status}">${a.status}</span>`).join('<br>') : 'No active bookings today for this room.');
}
function renderKPIs(){
  const todays = data.appointments.filter((a)=>a.date===selectedDate && isActive(a));
  const inUse = new Set(todays.filter((a)=>a.status==='approved').map((a)=>a.room_id)).size;
  const pending = data.appointments.filter((a)=>a.status==='pending').length;
  const free = slotsFor(selectedDate,'','').filter((s)=>s.free).length;
  $('kpis').innerHTML = [
    ['Appointments today', todays.length], ['Chairs in use', inUse],
    ['Pending approvals', pending], ['Free slot starts', free],
  ].map(([l,v])=>`<div class="card kpi"><div class="num">${v}</div><div class="label">${l}</div></div>`).join('');
}
function renderTimeline(){
  $('timeline').innerHTML = ['op1','op2','op3','op4'].map((rid)=>{
    const list = data.appointments.filter((a)=>a.room_id===rid && a.date===selectedDate && isActive(a)).sort((a,b)=>a.start_time.localeCompare(b.start_time));
    return `<div class="card"><h3>${esc(roomName(rid))}</h3>` + (list.length ? list.map((a)=>`<p><strong>${esc(a.start_time)}</strong> · ${esc(pat(a.patient_id).name)}<br>${esc(svcName(a.service_id))} · ${esc(docName(a.doctor_id))} · <span class="pill ${a.status}">${a.status}</span></p>`).join('') : '<p class="sub">No bookings today. This is the empty-day state.</p>') + `</div>`;
  }).join('');
}
function renderNextUp(){
  const upcoming = data.appointments.filter((a)=>a.date===selectedDate && isActive(a)).sort((a,b)=>a.start_time.localeCompare(b.start_time)).slice(0,5);
  $('nextUp').innerHTML = upcoming.length ? upcoming.map((a)=>`<p><strong>${esc(a.start_time)}</strong> · ${esc(pat(a.patient_id).name)} — ${esc(roomName(a.room_id))} with ${esc(docName(a.doctor_id))} · <span class="pill ${a.status}">${a.status}</span></p>`).join('') : '<p>No appointments today.</p>';
}
function approvalCard(a, showReason){
  return `<div style="border-bottom:1px solid var(--line);padding:10px 0"><strong>${esc(pat(a.patient_id).name)}</strong> · ${esc(a.date)} ${esc(a.start_time)}–${esc(a.end_time)}<br>${esc(roomName(a.room_id))} · ${esc(docName(a.doctor_id))} · ${esc(svcName(a.service_id))} · <span class="pill pending">pending</span><br>` +
    `<button class="btn small" data-approve="${a.id}">Approve</button> <button class="btn secondary small" data-reject="${a.id}">Reject</button>` +
    (showReason ? `<div class="field" style="margin-top:8px"><label>Reject reason</label><input data-reason="${a.id}" placeholder="Reason for rejection"></div>` : '') + `</div>`;
}
function renderPending(){
  const list = data.appointments.filter((a)=>a.status==='pending');
  $('pendingQueue').innerHTML = list.length ? list.map((a)=>approvalCard(a,true)).join('') : '<p>No pending approvals. New bookings will appear here.</p>';
  $('pendingQueue').querySelectorAll('[data-approve]').forEach((b)=>b.addEventListener('click', ()=>decide(b.dataset.approve,'approved')));
  $('pendingQueue').querySelectorAll('[data-reject]').forEach((b)=>b.addEventListener('click', ()=>{
    const reason = document.querySelector(`[data-reason="${b.dataset.reject}"]`)?.value || '';
    decide(b.dataset.reject,'rejected', reason);
  }));
}
async function decide(id, status, reason){
  if(!canApprove()){ showBanner('Demo role check: only a doctor or IT Admin can approve or reject.', 'error'); return; }
  if(status==='rejected' && !reason){ showBanner('Please enter a reject reason first.', 'error'); return; }
  try{
    if(apiMode) await apiCall('PATCH', `/api/appointments/${id}`, {status, reject_reason: reason||''});
    else { const a=data.appointments.find((x)=>x.id===id); if(a){ a.status=status; a.reject_reason=reason||''; } saveLocal(); }
    showBanner(`Booking ${status}.`, 'ok'); renderAll();
  }catch(e){ showBanner(e.message, 'error'); }
}
async function cancelAppt(id){
  if(!confirm('Cancel this booking? The slot will become free again.')) return;
  try{
    if(apiMode) await apiCall('PATCH', `/api/appointments/${id}`, {status:'cancelled'});
    else { const a=data.appointments.find((x)=>x.id===id); if(a) a.status='cancelled'; saveLocal(); }
    showBanner('Booking cancelled. The slot is free again.', 'ok'); renderAll();
  }catch(e){ showBanner(e.message, 'error'); }
}
function renderCalendar(){
  const view = $('calView').value, doc = $('filterDoctor').value, room = $('filterRoom').value;
  const base = new Date($('calDate').value + 'T12:00:00');
  const days = view==='week' ? [...Array(7)].map((_,i)=>{ const d=new Date(base); d.setDate(d.getDate()+i); return todayStr(d); }) : [todayStr(base)];
  let html = '';
  days.forEach((d)=>{
    const list = data.appointments.filter((a)=>a.date===d && isActive(a) && (!doc || a.doctor_id===doc) && (!room || a.room_id===room)).sort((a,b)=>a.start_time.localeCompare(b.start_time));
    html += `<h3>${esc(d)}</h3>` + (list.length ? list.map((a)=>`<p><strong>${esc(a.start_time)}–${esc(a.end_time)}</strong> · ${esc(pat(a.patient_id).name)} · ${esc(roomName(a.room_id))} · ${esc(docName(a.doctor_id))} · ${esc(svcName(a.service_id))} · <span class="pill ${a.status}">${a.status}</span> <button class="btn secondary small" data-cancel="${a.id}">Cancel</button> <button class="btn secondary small" data-resched="${a.id}">Reschedule</button></p>`).join('') : `<p class="sub">No appointments on ${esc(d)} — empty-day state. Use the booking form below to add one.</p>`);
  });
  $('calendarGrid').innerHTML = html;
  $('calendarGrid').querySelectorAll('[data-cancel]').forEach((b)=>b.addEventListener('click', ()=>cancelAppt(b.dataset.cancel)));
  $('calendarGrid').querySelectorAll('[data-resched]').forEach((b)=>{
    const nt = prompt('New start time (HH:MM, 24h, e.g. 14:00):');
    if(!nt) return;
    const a = data.appointments.find((x)=>x.id===b.dataset.resched); if(!a) return;
    const svc = SERVICES.find((s)=>s.id===a.service_id); const end = addMin(nt, svc.duration_minutes);
    const cand = {...a, start_time:nt, end_time:end};
    if(findConflict(cand, a.id)){ showBanner('Reschedule blocked: that doctor or room is already booked at that time. Pick another slot.', 'error'); return; }
    (async()=>{ try{ if(apiMode) await apiCall('PATCH', `/api/appointments/${a.id}`, {start_time:nt, end_time:end}); else { a.start_time=nt; a.end_time=end; saveLocal(); } showBanner('Booking rescheduled.', 'ok'); renderAll(); }catch(e){ showBanner(e.message,'error'); } })();
  });
}
function renderOps(){
  $('opList').innerHTML = ['op1','op2','op3','op4'].map((rid)=>{
    const room = data.rooms.find((r)=>r.id===rid);
    const todays = data.appointments.filter((a)=>a.room_id===rid && a.date===selectedDate && isActive(a));
    return `<div class="card"><h3>${room.number} · ${esc(room.name)}</h3><p>${esc(room.notes)}</p><p>Status today: ${todays.some((a)=>a.status==='approved')?'<span class="pill inuse">IN USE</span>':'<span class="pill approved">Available</span>'}</p>` +
      (todays.length ? todays.map((a)=>`<p>${esc(a.start_time)} · ${esc(pat(a.patient_id).name)} · ${esc(svcName(a.service_id))} · <span class="pill ${a.status}">${a.status}</span></p>`).join('') : '<p class="sub">No bookings today.</p>') + `</div>`;
  }).join('');
}
function renderPatients(){
  const q = ($('patientSearch').value||'').toLowerCase();
  const list = data.patients.filter((p)=>!q || p.name.toLowerCase().includes(q));
  $('patientTable').innerHTML = list.length ? `<table><thead><tr><th>Patient</th><th>Phone</th><th>Preference</th></tr></thead><tbody>${list.map((p)=>`<tr><td>${esc(p.name)}</td><td>${esc(p.phone||'')}</td><td>${esc(p.preference||'')}</td></tr>`).join('')}</tbody></table>` : `<p class="banner info">No results for “${esc($('patientSearch').value)}”. Try a different spelling, or clear the search.</p>`;
}
function renderStaff(){
  $('staffTable').innerHTML = `<table><thead><tr><th>Staff</th><th>Role</th><th>Access</th><th>Base room</th></tr></thead><tbody>${data.staff.map((s)=>`<tr><td>${esc(s.name)}</td><td>${esc(s.role)}</td><td>${esc(s.access_level)}</td><td>${esc(roomName(s.room_id))}</td></tr>`).join('')}</tbody></table><p class="sub">IT Admin (Shaik) has full access in this demo. Doctors approve or reject. Receptionist schedules.</p>`;
}
function renderApprovals(){
  const list = data.appointments.filter((a)=>a.status==='pending');
  $('approvalList').innerHTML = list.length ? list.map((a)=>approvalCard(a,true)).join('') : '<p>No pending approvals.</p>';
  const hist = data.appointments.filter((a)=>['approved','rejected'].includes(a.status));
  $('approvalList').innerHTML += '<h3>Recent decisions</h3>' + (hist.length ? hist.map((a)=>`<p>${esc(pat(a.patient_id).name)} · ${esc(a.date)} ${esc(a.start_time)} · <span class="pill ${a.status}">${a.status}</span>${a.reject_reason?` · Reason: ${esc(a.reject_reason)}`:''}</p>`).join('') : '<p class="sub">No decisions yet.</p>');
  $('approvalList').querySelectorAll('[data-approve]').forEach((b)=>b.addEventListener('click', ()=>decide(b.dataset.approve,'approved')));
  $('approvalList').querySelectorAll('[data-reject]').forEach((b)=>b.addEventListener('click', ()=>{
    const reason = document.querySelector(`[data-reason="${b.dataset.reject}"]`)?.value || '';
    decide(b.dataset.reject,'rejected', reason);
  }));
}
function renderBooking(){
  const bar = $('stepbar'); bar.querySelectorAll('span').forEach((s,i)=>s.classList.toggle('on', i+1===book.step));
  let h = '';
  if(book.step===1){
    h = `<div class="field"><label>Patient</label><select id="bkPat">${data.patients.map((p)=>`<option value="${p.id}" ${p.id===book.patient?'selected':''}>${esc(p.name)} — ${esc(p.preference||'')}</option>`).join('')}</select></div><button class="btn" id="bkNext">Next: Service</button>`;
  } else if(book.step===2){
    h = `<div class="field"><label>Service</label><select id="bkSvc">${SERVICES.map((s)=>`<option value="${s.id}" ${s.id===book.service?'selected':''}>${esc(s.name)} (${s.duration_minutes} min)</option>`).join('')}</select></div><button class="btn secondary" id="bkBack">Back</button> <button class="btn" id="bkNext">Next: Doctor / Operatory</button>`;
  } else if(book.step===3){
    h = `<div class="field"><label>Doctor</label><select id="bkDoc">${data.staff.filter((s)=>s.role==='doctor').map((s)=>`<option value="${s.id}" ${s.id===book.doctor?'selected':''}>${esc(s.name)}</option>`).join('')}</select></div><div class="field"><label>Operatory</label><select id="bkRoom">${['op1','op2','op3','op4'].map((r)=>`<option value="${r}" ${r===book.room?'selected':''}>${esc(roomName(r))}</option>`).join('')}</select></div><button class="btn secondary" id="bkBack">Back</button> <button class="btn" id="bkNext">Next: Date &amp; time</button>`;
  } else {
    const svc = SERVICES.find((s)=>s.id===book.service); const slots = slotsFor(book.date, book.doctor, book.room);
    const freeCount = slots.filter((s)=>s.free).length;
    h = `<div class="field"><label>Date</label><input type="date" id="bkDate" value="${book.date}"></div><p>Free slots for ${esc(docName(book.doctor))} in ${esc(roomName(book.room))}: ${freeCount} of ${slots.length}.</p>` +
      (freeCount===0 ? `<p class="banner info">No free slot on this date for that doctor and room. Pick another date, doctor, or room — or join the waitlist below.</p><button class="btn secondary" id="bkWait">Join waitlist for this date</button> ` : `<div class="slotgrid">${slots.map((s)=>`<button ${s.free?'':'disabled'} class="${s.free?'':'taken'} ${book.time===s.time?'sel':''}" data-slot="${s.time}">${s.time}</button>`).join('')}</div>`) +
      `<div class="card" style="margin-top:14px"><strong>Summary before submit</strong><br>Patient: ${esc(pat(book.patient||data.patients[0].id).name)}<br>Service: ${esc(svc.name)} (${svc.duration_minutes} min)<br>Doctor / Operatory: ${esc(docName(book.doctor))} / ${esc(roomName(book.room))}<br>Date &amp; time: ${esc(book.date)} ${book.time?esc(book.time)+'–'+esc(addMin(book.time, svc.duration_minutes)): '(pick a slot)'}<br>Status on submit: <span class="pill pending">pending</span> — a doctor must approve it.</div>` +
      `<p style="margin-top:12px"><button class="btn secondary" id="bkBack">Back</button> <button class="btn" id="bkSubmit" ${book.time?'':'disabled'}>Submit for approval</button></p>`;
  }
  $('bookStep').innerHTML = h;
  const next = $('bkNext'), back = $('bkBack');
  if(next) next.addEventListener('click', ()=>{
    if(book.step===1) book.patient = $('bkPat').value;
    if(book.step===2){ book.service = $('bkSvc').value; book.duration = SERVICES.find((s)=>s.id===book.service).duration_minutes; }
    if(book.step===3){ book.doctor = $('bkDoc').value; book.room = $('bkRoom').value; }
    book.step = Math.min(4, book.step+1); renderBooking();
  });
  if(back) back.addEventListener('click', ()=>{ book.step = Math.max(1, book.step-1); renderBooking(); });
  const dateEl = $('bkDate'); if(dateEl) dateEl.addEventListener('change', ()=>{ book.date = dateEl.value; book.time=''; renderBooking(); });
  document.querySelectorAll('[data-slot]').forEach((b)=>b.addEventListener('click', ()=>{ book.time = b.dataset.slot; renderBooking(); }));
  const wait = $('bkWait'); if(wait) wait.addEventListener('click', ()=>submitBooking(true));
  const sub = $('bkSubmit'); if(sub) sub.addEventListener('click', ()=>submitBooking(false));
}
async function submitBooking(waitlist){
  const svc = SERVICES.find((s)=>s.id===book.service);
  const patient = book.patient || data.patients[0].id;
  const start = waitlist ? '09:00' : book.time;
  if(!waitlist && !start){ showBanner('Pick a time slot first.', 'error'); return; }
  const cand = {patient_id:patient, doctor_id:book.doctor, room_id:book.room, service_id:book.service, date:book.date, start_time:start, end_time:addMin(start, svc.duration_minutes), kind: waitlist?'waitlist':'scheduled'};
  if(!waitlist && findConflict(cand)){ showBanner('Double booking blocked: that doctor or room is already booked at that time. The next free slot is shown in the grid — pick it instead.', 'error'); renderBooking(); return; }
  try{
    if(apiMode) await apiCall('POST', '/api/appointments', cand);
    else { const a={id:'a'+Date.now(), ...cand, status: waitlist?'waitlist':'pending', reject_reason:'', created_by_role:currentRole()}; data.appointments.push(a); if(waitlist) data.waitlist.push(a.id); saveLocal(); }
    showBanner(waitlist ? 'Added to the waitlist for that date.' : 'Booking submitted as pending. It will appear in Approvals until a doctor approves it.', 'ok');
    book = {step:1, patient:'', service:'checkup', doctor:'dr-john', room:'op1', date:book.date, time:'', duration:30};
    renderAll();
  }catch(e){ showBanner(e.message, 'error'); }
}
function renderAll(){
  selectedDate = $('topDate').value || todayStr();
  $('calDate').value = $('calDate').value || selectedDate;
  renderKPIs(); renderPlan(); renderRoomDetail(); renderTimeline(); renderNextUp(); renderPending();
  renderCalendar(); renderOps(); renderPatients(); renderStaff(); renderApprovals(); renderBooking();
  $('filterDoctor').innerHTML = '<option value="">All doctors</option>' + data.staff.filter((s)=>s.role==='doctor').map((s)=>`<option value="${s.id}">${esc(s.name)}</option>`).join('');
  $('filterRoom').innerHTML = '<option value="">All operatories</option>' + ['op1','op2','op3','op4'].map((r)=>`<option value="${r}">${esc(roomName(r))}</option>`).join('');
}
function showView(name){
  document.querySelectorAll('main section').forEach((s)=>s.hidden = s.id !== `view-${name}`);
  document.querySelectorAll('.nav').forEach((b)=>b.classList.toggle('active', b.dataset.view===name));
  if(window.innerWidth<=860) $('sidebar').classList.remove('open');
}
async function init(){
  $('topDate').value = todayStr(); $('calDate').value = todayStr();
  setInterval(()=>{ const d=new Date(); $('clock').textContent = d.toLocaleDateString(undefined,{weekday:'short', month:'short', day:'numeric'}) + ' · ' + d.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'}); }, 1000);
  await loadData();
  document.querySelectorAll('.nav').forEach((b)=>b.addEventListener('click', ()=>showView(b.dataset.view)));
  document.querySelectorAll('[data-footer-settings]').forEach((a)=>a.addEventListener('click', ()=>showView('settings')));
  $('menuBtn').addEventListener('click', ()=>$('sidebar').classList.toggle('open'));
  $('topDate').addEventListener('change', ()=>{ selectedDate = $('topDate').value; renderAll(); });
  $('searchInput').addEventListener('input', ()=>{ const q=$('searchInput').value.toLowerCase(); if(q){ showView('patients'); $('patientSearch').value=$('searchInput').value; renderPatients(); } });
  $('patientSearch').addEventListener('input', renderPatients);
  $('themeBtn').addEventListener('click', ()=>{
    const dark = document.body.classList.toggle('dark');
    $('themeBtn').textContent = dark ? 'Light mode' : 'Dark mode';
    document.body.style.background = dark ? '#12212B' : ''; document.body.style.color = dark ? '#F6F8F7' : '';
  });
  $('bgTheme').addEventListener('change', renderPlan);
  $('calView').addEventListener('change', renderCalendar);
  $('filterDoctor').addEventListener('change', renderCalendar);
  $('filterRoom').addEventListener('change', renderCalendar);
  $('calDate').addEventListener('change', renderCalendar);
  $('walkinBtn').addEventListener('click', ()=>{
    const slots = slotsFor(selectedDate, 'dr-john', 'op1'); const free = slots.find((s)=>s.free);
    if(!free){ showBanner('No free slot for a walk-in today in OP1 with Dr John. Try another operatory, or add to the waitlist from Schedule.', 'error'); return; }
    book = {step:4, patient:data.patients[0].id, service:'checkup', doctor:'dr-john', room:'op1', date:selectedDate, time:free.time, duration:30};
    showView('schedule'); renderBooking(); showBanner(`Walk-in ready: ${free.time} in OP1. Review the summary and submit for approval.`, 'info');
  });
  $('addPatientBtn').addEventListener('click', async ()=>{
    const name = $('newPatName').value.trim(); if(!name){ showBanner('Enter a patient name first.', 'error'); return; }
    try{
      if(apiMode) await apiCall('POST', '/api/patients', {name, phone:$('newPatPhone').value, preference:$('newPatPref').value});
      else { data.patients.push({id:'p'+Date.now(), name, phone:$('newPatPhone').value, preference:$('newPatPref').value}); saveLocal(); }
      showBanner('Demo patient added.', 'ok'); renderAll();
    }catch(e){ showBanner(e.message, 'error'); }
  });
  $('resetBtn').addEventListener('click', ()=>{ if(apiMode){ showBanner('Demo reset is a local feature on Pages. In local API mode, restart the server to reseed.', 'info'); return; } localStorage.removeItem(LS_KEY); data = seedData(); saveLocal(); showBanner('Demo data reset.', 'ok'); renderAll(); });
  $('accLarge').addEventListener('change', (e)=>document.body.classList.toggle('large-text', e.target.checked));
  $('accContrast').addEventListener('change', (e)=>document.body.classList.toggle('high-contrast', e.target.checked));
  $('accMotion').addEventListener('change', (e)=>document.body.classList.toggle('reduce-motion', e.target.checked));
  renderAll();
}
document.addEventListener('DOMContentLoaded', init);
