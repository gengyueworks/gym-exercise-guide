const PART_ORDER = ['胸','背','腿','肩','手臂','核心','全身'];
let ZH = [], EQ = [], byId = {};
const app = document.getElementById('app');
const searchEl = document.getElementById('search');

function exImg(e, idx = 0){ return 'assets/exercises/' + ((e.images && e.images[idx]) || ''); }

async function init(){
  try{
    ZH = await fetch('data/exercises.zh.json').then(r => r.json());
    EQ = await fetch('data/equipment.json').then(r => r.json());
  }catch(err){
    app.innerHTML = '<p style="padding:20px">数据加载失败。请确认通过 GitHub Pages 地址（…github.io/gym-exercise-guide/）访问本页。</p>';
    return;
  }
  byId = Object.fromEntries(ZH.map(e => [e.id, e]));
  wire();
  renderHome();
}

function wire(){
  document.querySelectorAll('.tab').forEach(t => t.onclick = () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    if (t.dataset.view === 'home') renderHome(); else renderEquipment();
  });
  searchEl.oninput = () => {
    const q = searchEl.value.trim().toLowerCase();
    if (!q){ renderHome(); document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active', x.dataset.view==='home')); return; }
    const res = ZH.filter(e =>
      (e.name_zh||'').toLowerCase().includes(q) ||
      (e.name_en||'').toLowerCase().includes(q) ||
      (e.primaryMuscles_zh||[]).join('').toLowerCase().includes(q) ||
      (e.equipment_zh||'').toLowerCase().includes(q)
    );
    renderGrid(res, '搜索 “' + searchEl.value + '” · 共 ' + res.length + ' 个');
  };
}

function renderHome(){
  const parts = PART_ORDER.filter(p => ZH.some(e => e.bodyPart_zh === p));
  let h = '<div class="section-title">选择部位</div><div class="grid partcard">';
  for (const p of parts){
    const ex = ZH.find(e => e.bodyPart_zh === p);
    const cnt = ZH.filter(e => e.bodyPart_zh === p).length;
    h += `<div class="card" onclick="renderPart('${p}')">
      <img src="${exImg(ex)}" onerror="this.outerHTML='<div class=\\'ph\\'>${p}</div>'">
      <div class="body"><div class="name">${p}</div><div class="meta">${cnt} 个动作</div></div></div>`;
  }
  h += '</div>';
  app.innerHTML = h;
}

function renderPart(p){
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  const list = ZH.filter(e => e.bodyPart_zh === p);
  renderGrid(list, p + ' · ' + list.length + ' 个动作');
}

function renderGrid(list, title){
  let h = `<div class="section-title">${title}</div><div class="grid">`;
  for (const e of list){
    h += `<div class="card" onclick="renderDetail('${e.id}')">
      <img src="${exImg(e)}" onerror="this.outerHTML='<div class=\\'ph\\'>动作</div>'">
      <div class="body"><div class="name">${e.name_zh||e.name_en}</div>
      <div class="meta">${[e.equipment_zh, e.level_zh].filter(Boolean).join(' · ')}</div></div></div>`;
  }
  h += '</div>';
  app.innerHTML = h;
  window.scrollTo(0, 0);
}

function renderDetail(id){
  const e = byId[id]; if (!e) return;
  const prim = (e.primaryMuscles_zh||[]).join('、') || '—';
  const sec  = (e.secondaryMuscles_zh||[]).join('、') || '—';
  const cues = (e.cues_zh||[]).map(c => `<li>${c}</li>`).join('');
  const mis   = (e.mistakes_zh||[]).map(m => `<li class="mistake">${m}</li>`).join('');
  const tips  = tip(e);
  const imgs  = (e.images||[]).map(i => `<img class="shot" src="assets/exercises/${i}" onerror="this.style.background='#eee'">`).join('');
  const ov = document.createElement('div'); ov.className = 'overlay';
  ov.onclick = (ev) => { if (ev.target === ov) ov.remove(); };
  ov.innerHTML = `<div class="modal">
    <button class="close" onclick="this.closest('.overlay').remove()">×</button>
    <h2>${e.name_zh||e.name_en}</h2>
    <div class="en">${e.name_en||''}</div>
    <div class="detail-meta">${(e.bodyPart_zh||'')}　|　${[e.equipment_zh, e.level_zh, e.category_zh].filter(Boolean).join('　|　')}</div>
    <div class="imgs">${imgs}</div>
    <div class="section-title">目标肌群</div>
    <div><span class="badge">主要：${prim}</span>${sec!=='—'?`<span class="badge">协同：${sec}</span>`:''}</div>
    ${window.muscleMapHTML(e.primaryMuscles, e.secondaryMuscles)}
    ${equipLine(e)}
    <div class="section-title">动作要点</div><ul>${cues}</ul>
    <div class="section-title">常见错误</div><ul>${mis}</ul>
    <div class="tip">训练建议：${tips}</div>
    <details><summary>英文原始步骤（对照）</summary><div style="line-height:1.6">${((e.instructions_en)||[]).join('<br>')}</div></details>
  </div>`;
  document.body.appendChild(ov);
}

function equipLine(e){
  const eq = e.equipment_zh || '徒手';
  let img = '';
  for (const c of (EQ || [])){
    const same = c.eq && (e.equipment || '').toLowerCase() === c.eq;
    const kw = (c.examples || []).some(x => x.id === e.id);
    if (same || kw){ if (c.img) img = c.img; break; }
  }
  const thumb = img ? `<img class="equip-thumb" src="assets/equipment/${img}" onerror="this.style.display='none'">` : '';
  return `<div class="section-title">使用器械</div>
    <div class="equip-line">${thumb}<span class="badge">${eq}</span>
    <span class="hint">（更多器械见顶部「器械图鉴」）</span></div>`;
}

function tip(e){
  const l = (e.level_zh||'');
  if (l.includes('新手')) return '从空手或轻重量开始，2–3 组 × 10–15 次，重点找发力感、把动作做标准。';
  if (l.includes('高级')) return '4–5 组 × 6–10 次，控制离心（下放放慢），注意组间恢复。';
  return '3–5 组 × 8–12 次，组间休息 60–120 秒；先把动作做标准，再逐步加重。';
}

function renderEquipment(){
  let h = '<div class="section-title">器械图鉴 — 认机器，知道练哪</div><div class="grid">';
  for (const c of EQ){
    const ex = (c.examples||[]).map(x =>
      `<span class="badge" style="cursor:pointer" onclick="renderDetail('${x.id}')">${x.name_zh||x.name_en}</span>`).join('');
    const img = c.img
      ? `<img src="assets/equipment/${c.img}" onerror="this.outerHTML='<div class=\\'ph\\'>${c.name_zh}</div>'">`
      : `<div class="ph">${c.name_zh}</div>`;
    h += `<div class="card">${img}
      <div class="body"><div class="name">${c.name_zh}</div>
      <div class="meta">${c.name_en} · <span class="badge">练 ${c.bodyPart_zh}</span></div>
      <div class="desc">${c.desc}</div>
      <div>${ex}</div></div></div>`;
  }
  h += '</div>';
  app.innerHTML = h;
  window.scrollTo(0, 0);
}

init();
