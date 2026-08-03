/* ---------------- 分类定义 ---------------- */
const PART_ORDER = ['胸', '背', '腿臀', '肩', '手臂', '核心', '全身'];
const LEVEL_ORDER = ['新手', '进阶', '高手'];
const CAT_ORDER = ['力量训练', '拉伸放松', '爆发力/弹跳', '力量举', '奥林匹克举重', '力量人训练', '有氧'];

// 英文 equipment 原值 → 器械大类
const EQ_ALIAS = {
  '': 'body', 'body only': 'body',
  'barbell': 'barbell', 'dumbbell': 'dumbbell', 'cable': 'cable', 'machine': 'machine',
  'kettlebells': 'kettlebell', 'bands': 'bands', 'medicine ball': 'medball',
  'exercise ball': 'swissball', 'foam roll': 'foamroll', 'e-z curl bar': 'ezbar', 'other': 'other'
};

// 器械大类：名称 / 说明 / 封面（machine=器械照片，ex=动作实拍）
const EQ_GROUPS = [
  { key: 'body',      name: '自重 / 徒手',  desc: '不用器械，随时随地练',      cover: { ex: 'Pushups' } },
  { key: 'barbell',   name: '杠铃',        desc: '大重量复合动作的主力',      cover: { ex: 'Barbell_Squat' } },
  { key: 'dumbbell',  name: '哑铃',        desc: '灵活、两侧独立发力',        cover: { ex: 'Dumbbell_Bicep_Curl' } },
  { key: 'other',     name: '其他器材',     cover: { ex: 'Pullups' },        desc: '单杠双杠、战绳、杠铃片等' },
  { key: 'cable',     name: '绳索 / 龙门架', desc: '全程恒定张力，角度自由',    cover: { machine: 'cable-machine.png' } },
  { key: 'machine',   name: '固定器械',     desc: '轨迹固定，新手最友好',      cover: { machine: 'leg-press.png' } },
  { key: 'kettlebell', name: '壶铃',       desc: '摆荡类爆发与体能',          cover: { ex: 'One-Arm_Kettlebell_Swings' } },
  { key: 'bands',     name: '弹力带',      desc: '低门槛，适合家练与激活',     cover: { ex: 'Back_Flyes_-_With_Bands' } },
  { key: 'medball',   name: '药球',        desc: '爆发抛掷与核心旋转',        cover: { ex: 'Backward_Medicine_Ball_Throw' } },
  { key: 'swissball', name: '瑜伽球',      desc: '不稳定平面，练核心',        cover: { ex: 'Ball_Leg_Curl' } },
  { key: 'foamroll',  name: '泡沫轴',      desc: '筋膜放松与恢复',           cover: { ex: 'Hamstring-SMR' } },
  { key: 'ezbar',     name: '曲杆杠铃',    desc: '手腕更舒服的弯举/臂屈伸',    cover: { ex: 'EZ-Bar_Skullcrusher' } }
];
const EQ_NAME = Object.fromEntries(EQ_GROUPS.map(g => [g.key, g.name]));

/* ---------------- 器械图鉴：分组 / 封面 / 动作匹配 ---------------- */
// 23 个器械按「上手场景」分区，避免一屏平铺看着都一样
const EQ_SECTIONS = [
  { title: '自由重量 & 徒手', sub: '哪儿都能练，先从这些入门', keys: ['body', 'barbell', 'dumbbell', 'kettlebell', 'bands'] },
  { title: '腿部器械', sub: '轨迹固定，练腿最安全', keys: ['leg_press', 'leg_ext', 'leg_curl', 'hip_adb', 'calf'] },
  { title: '胸背器械', sub: '推与拉的两大主力', keys: ['chest_press', 'pec_deck', 'lat_pulldown', 'seated_row'] },
  { title: '肩臂器械', sub: '孤立发力，练细节', keys: ['shoulder_press_m', 'lateral_raise_m', 'preacher', 'triceps_pushdown'] },
  { title: '综合 & 核心', sub: '一台顶多台，或专攻腹部', keys: ['smith', 'cable', 'roman_chair', 'ab_crunch', 'ab_wheel'] }
];

// 没有器械照片的，用一张代表动作的真人图当封面
const EQ_COVER_EX = {
  body: 'Pushups', barbell: 'Barbell_Squat', dumbbell: 'Dumbbell_Bicep_Curl',
  kettlebell: 'One-Arm_Kettlebell_Swings', bands: 'Back_Flyes_-_With_Bands'
};

// 点开器械后要列出「该器械的全部动作」，而不只是 6 个示例。
// 大类直接按 equipment 字段取；细分机器用名称关键词捞，再和人工挑的 examples 合并。
const EQ_BY_FIELD = {
  body: ['', 'body only'], barbell: ['barbell'], dumbbell: ['dumbbell'],
  kettlebell: ['kettlebells'], bands: ['bands'], cable: ['cable']
};
// 细分机器靠名称关键词捞：kw=命中词，eq=限定 equipment 字段（防止把哑铃飞鸟算进蝴蝶机），no=排除词
const EQ_SPEC = {
  leg_press: { kw: ['leg press', '倒蹬', '腿举'], eq: ['machine'], no: ['smith', '史密斯'] },
  leg_ext: { kw: ['leg extension', '腿屈伸'], eq: ['machine'] },
  leg_curl: { kw: ['leg curl', '腿弯举'], eq: ['machine', 'exercise ball', 'cable'] },
  hip_adb: { kw: ['adductor', 'abduction', 'abductor', '髋内收', '髋外展', '大腿内收', '大腿外展'], no: ['拉伸', 'stretch'] },
  calf: { kw: ['calf raise', '提踵'], eq: ['machine', 'barbell', 'dumbbell', 'body only', ''] },
  chest_press: { kw: ['chest press', '推胸'], eq: ['machine', 'cable'], no: ['smith', '史密斯'] },
  pec_deck: { kw: ['pec deck', 'butterfly', '蝴蝶机', '夹胸', 'flyes', '飞鸟'], eq: ['machine', 'cable'], no: ['后束', 'rear', '三角肌'] },
  lat_pulldown: { kw: ['pulldown', 'pull-down', '下拉'], eq: ['cable', 'machine'] },
  seated_row: { kw: ['seated cable row', 'cable row', 'machine row', '坐姿划船', '器械划船', '绳索划船', '低位划船'], eq: ['cable', 'machine'] },
  smith: { kw: ['smith', '史密斯'] },
  shoulder_press_m: { kw: ['shoulder press', '肩推', '肩上推举', '推举机'], eq: ['machine', 'cable'], no: ['smith', '史密斯'] },
  lateral_raise_m: { kw: ['lateral raise', '侧平举'], eq: ['machine', 'cable'], no: ['smith', '史密斯'] },
  preacher: { kw: ['preacher', '牧师'] },
  triceps_pushdown: { kw: ['pushdown', 'push-down', '下压'], eq: ['cable', 'machine'] },
  roman_chair: { kw: ['roman chair', 'hyperextension', 'back extension', '罗马椅', '背伸展', '山羊挺身'] },
  ab_crunch: { kw: ['cable crunch', 'machine crunch', '卷腹机', '器械卷腹', '绳索卷腹'], eq: ['machine', 'cable'] },
  ab_wheel: { kw: ['ab wheel', 'roller', 'rollout', '滚轮', '健腹轮', '腹肌轮'], no: ['腕', 'wrist'] }
};

const _eqCache = {};
function eqExercises(key) {
  if (_eqCache[key]) return _eqCache[key];
  const seen = new Set();
  const out = [];
  const push = id => { const e = byId[id]; if (e && !seen.has(id)) { seen.add(id); out.push(e); } };

  const cat = (EQ || []).find(c => c.key === key);
  const fields = EQ_BY_FIELD[key];

  if (fields) {
    // 大类直接按 equipment 字段取；人工挑的示例排最前（先过滤掉字段对不上的脏数据）
    (cat && cat.examples || []).forEach(x => {
      const e = byId[x.id];
      if (e && fields.includes(e.equipment || '')) push(x.id);
    });
    ZH.forEach(e => { if (fields.includes(e.equipment || '')) push(e.id); });
  } else {
    // 细分机器：equipment.json 的 examples 有不少串台脏数据（如坐姿划船机里混进蝴蝶机夹胸），
    // 所以只认名称关键词 + equipment 字段双重命中，捞不到才退回 examples。
    const s = EQ_SPEC[key];
    if (s) {
      const kws = s.kw.map(k => k.toLowerCase());
      const no = (s.no || []).map(k => k.toLowerCase());
      ZH.forEach(e => {
        const blob = ((e.name_zh || '') + ' ' + (e.name_en || '')).toLowerCase();
        if (!kws.some(k => blob.includes(k))) return;
        if (no.length && no.some(k => blob.includes(k))) return;
        if (s.eq && !s.eq.includes(e.equipment || '')) return;
        push(e.id);
      });
    }
    if (!out.length) (cat && cat.examples || []).forEach(x => push(x.id));
  }
  _eqCache[key] = out;
  return out;
}

function eqCover(cat) {
  if (cat.img) return 'assets/equipment/' + cat.img;
  const rep = EQ_COVER_EX[cat.key];
  if (rep && byId[rep]) return exImg(byId[rep]);
  const ex = (cat.examples || [])[0];
  return ex && ex.img ? 'assets/exercises/' + ex.img : '';
}

const PART_DESC = {
  '胸': '卧推、飞鸟、双杠臂屈伸',
  '背': '引体、划船、高位下拉',
  '腿臀': '深蹲、硬拉、臀桥、提踵',
  '肩': '推举、侧平举、面拉',
  '手臂': '弯举、臂屈伸、握力',
  '核心': '卷腹、平板、抗旋转',
  '全身': '奥举、壶铃、爆发与体能'
};

const PAGE_SIZE = 60;

/* ---------------- 状态 ---------------- */
let ZH = [], EQ = [], byId = {};
let F = { part: '', eq: '', level: '', cat: '', q: '', sort: 'default' };
let shown = PAGE_SIZE;
let eqShown = PAGE_SIZE;      // 器械详情页的分页游标
let curEqKey = null;         // 当前器械详情 key
let filtersOpen = true;
let lastBrowseKey = null;   // 筛选条件签名，未变则不重渲染（保住滚动位置与"加载更多"进度）
let directDetail = false;   // 是否为直接用详情链接进站（决定关闭时能否 history.back）

const app = document.getElementById('app');
const searchEl = document.getElementById('search');

/* ---------------- 工具 ---------------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function eqKey(e) { return EQ_ALIAS[e.equipment || ''] || 'other'; }
function exImg(e, idx = 0) { return 'assets/exercises/' + ((e.images && e.images[idx]) || ''); }
function coverOf(id) { const e = byId[id]; return e ? exImg(e) : ''; }

// 动作卡片（浏览页与器械详情页共用）
function exCard(e) {
  const tag = e.genderSet ? '<span class="gender-tag">男/女</span>' : '';
  return `<div class="card" onclick="go('#/ex/${encodeURIComponent(e.id)}')">
    ${tag}<img src="${exImg(e)}" loading="lazy" onerror="this.outerHTML='<div class=\\'ph\\'>动作</div>'">
    <div class="body"><div class="name">${esc(e.name_zh || e.name_en)}</div>
    <div class="meta">${esc([e.equipment_zh, e.level_zh].filter(Boolean).join(' · '))}</div></div></div>`;
}

/* ---------------- 路由 ---------------- */
function toHash() {
  const p = new URLSearchParams();
  ['part', 'eq', 'level', 'cat', 'q'].forEach(k => { if (F[k]) p.set(k, F[k]); });
  if (F.sort !== 'default') p.set('sort', F.sort);
  const qs = p.toString();
  return '#/browse' + (qs ? '?' + qs : '');
}

function readHash() {
  const h = location.hash || '#/';
  const [path, qs] = h.slice(1).split('?');
  const p = new URLSearchParams(qs || '');
  return { path: path || '/', p };
}

function go(hash, replace) {
  if (location.hash === hash) { route(); return; }
  if (replace) {
    // 用 replaceState 明确不触发 hashchange，再手动 route，避免各浏览器行为差异导致重复渲染
    try { history.replaceState(null, '', hash); route(); return; } catch (e) { /* 降级 */ }
  }
  location.hash = hash;
}

function route() {
  const { path, p } = readHash();

  // 详情叠加在当前视图之上，路径形如 /ex/<id>
  if (path.startsWith('/ex/')) {
    const id = decodeURIComponent(path.slice(4));
    if (!app.dataset.view) {          // 直接用详情链接进站，先铺一个列表做背景
      directDetail = true;
      lastBrowseKey = null;
      renderBrowse();
      setTab('browse');
    }
    if (!document.querySelector('.overlay')) openDetail(id);
    return;
  }
  closeOverlay();

  if (path === '/browse') {
    F.part = p.get('part') || ''; F.eq = p.get('eq') || '';
    F.level = p.get('level') || ''; F.cat = p.get('cat') || '';
    F.q = p.get('q') || ''; F.sort = p.get('sort') || 'default';
    if (searchEl.value !== F.q) searchEl.value = F.q;
    setTab('browse');
    const key = JSON.stringify([F.part, F.eq, F.level, F.cat, F.q, F.sort]);
    // 条件没变（例如刚关掉详情弹窗）就别重渲染，保住滚动位置和已加载的条数
    if (key !== lastBrowseKey || app.dataset.view !== 'browse') {
      const isNew = key !== lastBrowseKey;
      lastBrowseKey = key;
      if (isNew) shown = PAGE_SIZE;
      renderBrowse();
    }
  } else if (path.startsWith('/equip/')) {
    const key = decodeURIComponent(path.slice(7));
    setTab('equip');
    // 从详情弹窗返回时不重渲染，保住滚动位置与已加载条数
    if (app.dataset.view !== 'equip:' + key) {
      if (curEqKey !== key) eqShown = PAGE_SIZE;
      curEqKey = key;
      renderEquipDetail(key);
    }
  } else if (path === '/equip') {
    setTab('equip');
    if (app.dataset.view !== 'equip') renderEquipment();
  } else {
    setTab('home');
    if (app.dataset.view !== 'home') renderHome();
  }
}

function setTab(view) {
  document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x.dataset.view === view));
}

function closeOverlay() {
  const ov = document.querySelector('.overlay');
  if (ov) ov.remove();
}

// 关详情：正常情况走 history.back()（手机返回键也能关），直接进站则退回列表
function closeDetail() {
  if (directDetail) { directDetail = false; go('#/browse', true); }
  else history.back();
}

/* ---------------- 初始化 ---------------- */
async function init() {
  try {
    ZH = await fetch('data/exercises.zh.json').then(r => r.json());
    EQ = await fetch('data/equipment.json').then(r => r.json());
  } catch (err) {
    app.innerHTML = '<p style="padding:20px">数据加载失败。请确认通过 GitHub Pages 地址（…github.io/gym-exercise-guide/）访问本页。</p>';
    return;
  }
  byId = Object.fromEntries(ZH.map(e => [e.id, e]));
  wire();
  window.addEventListener('hashchange', route);
  route();
}

function wire() {
  document.querySelectorAll('.tab').forEach(t => t.onclick = () => {
    const v = t.dataset.view;
    if (v === 'home') go('#/');
    else if (v === 'equip') go('#/equip');
    else { F = { part: '', eq: '', level: '', cat: '', q: '', sort: 'default' }; searchEl.value = ''; go('#/browse'); }
  });

  let timer = null;
  searchEl.oninput = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      F.q = searchEl.value.trim();
      go(toHash(), true);
    }, 180);
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.querySelector('.overlay')) closeDetail();
  });
}

/* ---------------- 首页：分类导航 ---------------- */
function renderHome() {
  const count = fn => ZH.filter(fn).length;

  let h = `<div class="hero">
    <div class="hero-t">先选一个分类，再往下找动作</div>
    <div class="hero-s">873 个动作 · 支持部位 / 器械 / 难度 / 目标任意组合筛选</div>
  </div>`;

  // 按部位
  h += `<div class="section-title">按部位 <span class="st-sub">练哪儿就点哪儿</span></div><div class="grid partcard">`;
  for (const p of PART_ORDER) {
    const n = count(e => e.bodyPart_zh === p);
    if (!n) continue;
    const ex = ZH.find(e => e.bodyPart_zh === p);
    h += `<div class="card" onclick="pick('part','${esc(p)}')">
      <img src="${exImg(ex)}" loading="lazy" onerror="this.outerHTML='<div class=\\'ph\\'>${esc(p)}</div>'">
      <div class="body"><div class="name">${esc(p)}</div>
      <div class="meta">${n} 个动作</div>
      <div class="desc">${esc(PART_DESC[p] || '')}</div></div></div>`;
  }
  h += '</div>';

  // 按器械
  h += `<div class="section-title">按器械 <span class="st-sub">手边有什么就练什么</span></div><div class="grid partcard">`;
  for (const g of EQ_GROUPS) {
    const n = count(e => eqKey(e) === g.key);
    if (!n) continue;
    const src = g.cover.machine ? 'assets/equipment/' + g.cover.machine : coverOf(g.cover.ex);
    h += `<div class="card" onclick="pick('eq','${g.key}')">
      <img src="${src}" loading="lazy" onerror="this.outerHTML='<div class=\\'ph\\'>${esc(g.name)}</div>'">
      <div class="body"><div class="name">${esc(g.name)}</div>
      <div class="meta">${n} 个动作</div>
      <div class="desc">${esc(g.desc || '')}</div></div></div>`;
  }
  h += '</div>';

  // 按难度
  h += `<div class="section-title">按难度</div><div class="tilerow">`;
  for (const l of LEVEL_ORDER) {
    const n = count(e => e.level_zh === l);
    if (!n) continue;
    h += `<div class="tile lv${LEVEL_ORDER.indexOf(l)}" onclick="pick('level','${esc(l)}')">
      <div class="tile-n">${esc(l)}</div><div class="tile-c">${n} 个</div></div>`;
  }
  h += '</div>';

  // 按训练目标
  h += `<div class="section-title">按训练目标</div><div class="tilerow">`;
  for (const c of CAT_ORDER) {
    const n = count(e => e.category_zh === c);
    if (!n) continue;
    h += `<div class="tile" onclick="pick('cat','${esc(c)}')">
      <div class="tile-n">${esc(c)}</div><div class="tile-c">${n} 个</div></div>`;
  }
  h += `</div>
  <div class="allbtn" onclick="pick('','')">浏览全部 873 个动作 →</div>`;

  app.innerHTML = h;
  app.dataset.view = 'home';
  window.scrollTo(0, 0);
}

// 从首页点某个分类进入浏览页
function pick(dim, val) {
  F = { part: '', eq: '', level: '', cat: '', q: '', sort: 'default' };
  if (dim) F[dim] = val;
  searchEl.value = '';
  shown = PAGE_SIZE;
  go(toHash());
}

/* ---------------- 浏览页：多维筛选 ---------------- */
// 应用筛选；skip 指定跳过某个维度（用于算该维度各选项的可用数量）
function applyFilter(skip) {
  const q = (F.q || '').toLowerCase();
  return ZH.filter(e => {
    if (skip !== 'part' && F.part && e.bodyPart_zh !== F.part) return false;
    if (skip !== 'eq' && F.eq && eqKey(e) !== F.eq) return false;
    if (skip !== 'level' && F.level && e.level_zh !== F.level) return false;
    if (skip !== 'cat' && F.cat && e.category_zh !== F.cat) return false;
    if (q) {
      const hay = [e.name_zh, e.name_en, (e.primaryMuscles_zh || []).join(''),
        (e.secondaryMuscles_zh || []).join(''), e.equipment_zh].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function sortList(list) {
  const l = list.slice();
  if (F.sort === 'name') l.sort((a, b) => (a.name_zh || '').localeCompare(b.name_zh || '', 'zh'));
  else if (F.sort === 'level') l.sort((a, b) => LEVEL_ORDER.indexOf(a.level_zh) - LEVEL_ORDER.indexOf(b.level_zh));
  return l;
}

function chipRow(label, dim, options) {
  const pool = applyFilter(dim);
  let chips = `<span class="chip ${F[dim] ? '' : 'on'}" onclick="setF('${dim}','')">全部</span>`;
  for (const o of options) {
    const n = pool.filter(o.test).length;
    const on = F[dim] === o.val;
    if (!n && !on) continue;
    chips += `<span class="chip ${on ? 'on' : ''} ${n ? '' : 'zero'}" onclick="setF('${dim}','${esc(o.val)}')">
      ${esc(o.name)}<i>${n}</i></span>`;
  }
  return `<div class="frow"><span class="flabel">${label}</span><div class="fchips">${chips}</div></div>`;
}

// 下面几个改完 hash 后由 route() 统一渲染，避免渲染两次
function setF(dim, val) {
  F[dim] = (F[dim] === val) ? '' : val;
  go(toHash(), true);
}

function clearF() {
  F = { part: '', eq: '', level: '', cat: '', q: '', sort: F.sort };
  searchEl.value = '';
  go(toHash(), true);
}

function setSort(v) { F.sort = v; go(toHash(), true); }

// 这两个不改筛选条件，直接重绘即可（保留 shown）
function toggleFilters() { filtersOpen = !filtersOpen; renderBrowse(); }
function more() { shown += PAGE_SIZE; renderBrowse(); }

function renderBrowse() {
  const list = sortList(applyFilter());
  const active = [];
  if (F.part) active.push({ dim: 'part', text: '部位：' + F.part });
  if (F.eq) active.push({ dim: 'eq', text: '器械：' + (EQ_NAME[F.eq] || F.eq) });
  if (F.level) active.push({ dim: 'level', text: '难度：' + F.level });
  if (F.cat) active.push({ dim: 'cat', text: '目标：' + F.cat });
  if (F.q) active.push({ dim: 'q', text: '搜索：' + F.q });

  let h = `<div class="crumb"><a onclick="go('#/')">分类首页</a><span>›</span>
    ${active.length ? active.map(a => esc(a.text)).join(' <span>·</span> ') : '全部动作'}</div>`;

  // 筛选面板
  h += `<div class="fbar">
    <div class="fhead">
      <span class="fcount"><b>${list.length}</b> 个动作</span>
      <div class="fright">
        <select class="sortsel" onchange="setSort(this.value)">
          <option value="default"${F.sort === 'default' ? ' selected' : ''}>默认排序</option>
          <option value="level"${F.sort === 'level' ? ' selected' : ''}>按难度</option>
          <option value="name"${F.sort === 'name' ? ' selected' : ''}>按名称</option>
        </select>
        ${active.length ? '<span class="linkbtn" onclick="clearF()">清除筛选</span>' : ''}
        <span class="linkbtn" onclick="toggleFilters()">${filtersOpen ? '收起筛选 ▲' : '展开筛选 ▼'}</span>
      </div>
    </div>`;

  if (filtersOpen) {
    h += `<div class="fbody">`;
    h += chipRow('部位', 'part', PART_ORDER.map(p => ({ val: p, name: p, test: e => e.bodyPart_zh === p })));
    h += chipRow('器械', 'eq', EQ_GROUPS.map(g => ({ val: g.key, name: g.name, test: e => eqKey(e) === g.key })));
    h += chipRow('难度', 'level', LEVEL_ORDER.map(l => ({ val: l, name: l, test: e => e.level_zh === l })));
    h += chipRow('目标', 'cat', CAT_ORDER.map(c => ({ val: c, name: c, test: e => e.category_zh === c })));
    h += `</div>`;
  }
  h += `</div>`;

  if (!list.length) {
    h += `<div class="empty">没有符合条件的动作<br><span class="linkbtn" onclick="clearF()">清除筛选试试</span></div>`;
    app.innerHTML = h;
    app.dataset.view = 'browse';
    return;
  }

  const page = list.slice(0, shown);
  h += '<div class="grid">';
  for (const e of page) h += exCard(e);
  h += '</div>';

  if (list.length > shown) {
    h += `<div class="morebtn" onclick="more()">加载更多（还有 ${list.length - shown} 个）</div>`;
  }

  app.innerHTML = h;
  app.dataset.view = 'browse';
}

/* ---------------- 详情 ---------------- */
// 有男女四图（0=男起 1=女起 2=男止 3=女止）时渲染成对照网格，否则平铺
function renderShots(e) {
  const im = e.images || [];
  const src = i => `assets/exercises/${i}`;
  if (e.genderSet && im.length >= 4) {
    const cell = (i, label) =>
      `<figure class="shot-cell"><img class="shot" src="${src(im[i])}" loading="lazy" onerror="this.style.background='#eee'"><figcaption>${label}</figcaption></figure>`;
    return `<div class="shot-grid">
      ${cell(0, '男性 · 起始位')}${cell(2, '男性 · 结束位')}
      ${cell(1, '女性 · 起始位')}${cell(3, '女性 · 结束位')}
    </div>`;
  }
  return im.map(i => `<img class="shot" src="${src(i)}" loading="lazy" onerror="this.style.background='#eee'">`).join('');
}

// 详情里的分类标签，点了直接跳到对应筛选
function detailTags(e) {
  const t = [];
  if (e.bodyPart_zh) t.push(`<span class="badge tapb" onclick="pick('part','${esc(e.bodyPart_zh)}')">${esc(e.bodyPart_zh)}</span>`);
  const k = eqKey(e);
  t.push(`<span class="badge tapb" onclick="pick('eq','${k}')">${esc(EQ_NAME[k] || e.equipment_zh)}</span>`);
  if (e.level_zh) t.push(`<span class="badge tapb" onclick="pick('level','${esc(e.level_zh)}')">${esc(e.level_zh)}</span>`);
  if (e.category_zh) t.push(`<span class="badge tapb" onclick="pick('cat','${esc(e.category_zh)}')">${esc(e.category_zh)}</span>`);
  return t.join('');
}

function openDetail(id) {
  const e = byId[id];
  if (!e) { go('#/browse', true); return; }
  const prim = (e.primaryMuscles_zh || []).join('、') || '—';
  const sec = (e.secondaryMuscles_zh || []).join('、') || '—';
  const cues = (e.cues_zh || []).map(c => `<li>${esc(c)}</li>`).join('');
  const mis = (e.mistakes_zh || []).map(m => `<li class="mistake">${esc(m)}</li>`).join('');

  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.onclick = ev => { if (ev.target === ov) closeDetail(); };
  ov.innerHTML = `<div class="modal">
    <button class="close" onclick="closeDetail()">×</button>
    <h2>${esc(e.name_zh || e.name_en)}</h2>
    <div class="en">${esc(e.name_en || '')}</div>
    <div class="detail-meta">${detailTags(e)}</div>
    <div class="imgs">${renderShots(e)}</div>
    <div class="section-title">目标肌群</div>
    <div><span class="badge">主要：${esc(prim)}</span>${sec !== '—' ? `<span class="badge">协同：${esc(sec)}</span>` : ''}</div>
    <img class="muscle-svg-img" src="assets/muscle/${esc(e.id)}.svg" alt="目标肌群示意（红=主要，橙=协同）" loading="lazy">
    ${equipLine(e)}
    <div class="section-title">动作要点</div><ul>${cues}</ul>
    <div class="section-title">常见错误</div><ul>${mis}</ul>
    <div class="tip">训练建议：${tip(e)}</div>
    <details><summary>英文原始步骤（对照）</summary><div style="line-height:1.6">${(e.instructions_en || []).map(esc).join('<br>')}</div></details>
  </div>`;
  document.body.appendChild(ov);
}

function equipLine(e) {
  const eq = e.equipment_zh || '徒手';
  let img = '';
  for (const c of (EQ || [])) {
    const kw = (c.examples || []).some(x => x.id === e.id);
    if (kw && c.img) { img = c.img; break; }
  }
  const thumb = img ? `<img class="equip-thumb" src="assets/equipment/${img}" onerror="this.style.display='none'">` : '';
  return `<div class="section-title">使用器械</div>
    <div class="equip-line">${thumb}<span class="badge">${esc(eq)}</span>
    <span class="hint">（更多器械见顶部「器械图鉴」）</span></div>`;
}

function tip(e) {
  const l = e.level_zh || '';
  if (l.includes('新手')) return '从空手或轻重量开始，2–3 组 × 10–15 次，重点找发力感、把动作做标准。';
  if (l.includes('高手')) return '4–5 组 × 6–10 次，控制离心（下放放慢），注意组间恢复。';
  return '3–5 组 × 8–12 次，组间休息 60–120 秒；先把动作做标准，再逐步加重。';
}

/* ---------------- 器械图鉴：列表 ---------------- */
function eqCat(key) { return (EQ || []).find(c => c.key === key); }

function renderEquipment() {
  let h = `<div class="crumb"><a onclick="go('#/')">分类首页</a><span>›</span>器械图鉴</div>
    <div class="eqhero">
      <h1>器械图鉴</h1>
      <p>${EQ.length} 种常见器械 · 点任意一张卡片，直接看到这台机器能练的全部动作</p>
    </div>`;

  for (const sec of EQ_SECTIONS) {
    const cats = sec.keys.map(eqCat).filter(Boolean);
    if (!cats.length) continue;
    h += `<div class="eqsec">
      <div class="eqsec-h"><span class="eqsec-t">${esc(sec.title)}</span><span class="eqsec-s">${esc(sec.sub)}</span></div>
      <div class="eqgrid">`;
    for (const c of cats) {
      const n = eqExercises(c.key).length;
      const cover = eqCover(c);
      const img = cover
        ? `<img src="${cover}" loading="lazy" onerror="this.outerHTML='<div class=\\'eqph\\'>${esc(c.name_zh)}</div>'">`
        : `<div class="eqph">${esc(c.name_zh)}</div>`;
      h += `<div class="eqcard" onclick="go('#/equip/${encodeURIComponent(c.key)}')">
        <div class="eqcard-img">${img}<span class="eqcard-n">${n} 个动作</span></div>
        <div class="eqcard-b">
          <div class="eqcard-t">${esc(c.name_zh)}</div>
          <div class="eqcard-en">${esc(c.name_en)}</div>
          <div class="eqcard-d">${esc(c.desc || '')}</div>
          <div class="eqcard-f"><span class="badge">练 ${esc(c.bodyPart_zh)}</span><span class="eqcard-go">查看动作 →</span></div>
        </div></div>`;
    }
    h += `</div></div>`;
  }

  app.innerHTML = h;
  app.dataset.view = 'equip';
  window.scrollTo(0, 0);
}

/* ---------------- 器械详情：这台机器能练什么 ---------------- */
function renderEquipDetail(key) {
  const c = eqCat(key);
  if (!c) { go('#/equip', true); return; }
  const list = eqExercises(key);
  const cover = eqCover(c);
  const sec = EQ_SECTIONS.find(s => s.keys.includes(key));

  // 该器械动作的部位分布，让人一眼知道能练哪
  const parts = {};
  list.forEach(e => { const p = e.bodyPart_zh; if (p) parts[p] = (parts[p] || 0) + 1; });
  const partChips = PART_ORDER.filter(p => parts[p])
    .map(p => `<span class="badge">${esc(p)} ${parts[p]}</span>`).join('');

  let h = `<div class="crumb">
    <a onclick="go('#/')">分类首页</a><span>›</span>
    <a onclick="go('#/equip')">器械图鉴</a><span>›</span>${esc(c.name_zh)}</div>`;

  const img = cover
    ? `<img src="${cover}" onerror="this.outerHTML='<div class=\\'eqph big\\'>${esc(c.name_zh)}</div>'">`
    : `<div class="eqph big">${esc(c.name_zh)}</div>`;

  h += `<div class="eqdetail">
    <div class="eqdetail-img">${img}</div>
    <div class="eqdetail-info">
      <h1>${esc(c.name_zh)}</h1>
      <div class="eqdetail-en">${esc(c.name_en)}</div>
      <p class="eqdetail-desc">${esc(c.desc || '')}</p>
      <div class="eqdetail-meta">
        <span class="badge strong">共 ${list.length} 个动作</span>
        <span class="badge">主练 ${esc(c.bodyPart_zh)}</span>
        ${sec ? `<span class="badge">${esc(sec.title)}</span>` : ''}
      </div>
      ${partChips ? `<div class="eqdetail-parts"><span class="lbl">覆盖部位</span>${partChips}</div>` : ''}
      ${EQ_BY_FIELD[key] ? `<div class="eqdetail-act"><span class="linkbtn" onclick="pick('eq','${esc(key)}')">在「全部动作」里筛选该器械 →</span></div>` : ''}
    </div>
  </div>`;

  if (!list.length) {
    h += `<div class="empty">暂无收录该器械的动作</div>`;
  } else {
    const page = list.slice(0, eqShown);
    h += `<div class="section-title">这台器械能练的动作（${list.length}）</div><div class="grid">`;
    for (const e of page) h += exCard(e);
    h += '</div>';
    if (list.length > eqShown) {
      h += `<div class="morebtn" onclick="eqMore()">加载更多（还有 ${list.length - eqShown} 个）</div>`;
    }
  }

  app.innerHTML = h;
  app.dataset.view = 'equip:' + key;
  if (eqShown === PAGE_SIZE) window.scrollTo(0, 0);
}

function eqMore() { eqShown += PAGE_SIZE; renderEquipDetail(curEqKey); }

init();
