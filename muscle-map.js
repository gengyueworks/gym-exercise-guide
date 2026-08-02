// 肌肉高亮人体图：正面 / 背面两个视图，目标肌群红、协同肌群橙
// 数据里的肌群字段为英文（primaryMuscles / secondaryMuscles），与 data-muscle 匹配

const MUSCLE_ZH = {
  abdominals: '腹直肌', abductors: '髋外展肌', adductors: '髋内收肌',
  biceps: '肱二头肌', calves: '小腿（腓肠肌）', chest: '胸大肌',
  forearms: '前臂', glutes: '臀大肌', hamstrings: '腘绳肌',
  lats: '背阔肌', 'lower back': '下背部（竖脊肌）', 'middle back': '中背部',
  neck: '颈部', quadriceps: '股四头肌', shoulders: '三角肌（肩）',
  traps: '斜方肌', triceps: '肱三头肌'
};

// 底色人形（肤色），拼成人形轮廓，肌群块叠在上面
const SKIN_FRONT = [
  ['circle', {cx:100, cy:28, r:18}],
  ['rect', {x:90, y:44, w:20, h:14, rx:6}],
  ['rect', {x:60, y:60, w:80, h:96, rx:20}],
  ['rect', {x:46, y:80, w:22, h:112, rx:11}],
  ['rect', {x:132, y:80, w:22, h:112, rx:11}],
  ['rect', {x:76, y:156, w:48, h:124, rx:18}]
];
const SKIN_BACK = SKIN_FRONT;

// 各肌群形状（viewBox 0 0 200 340）
const MUSCLES_FRONT = [
  ['neck', 'rect', {x:91, y:44, w:18, h:14, rx:6}],
  ['shoulders', 'ellipse', {cx:70, cy:82, rx:16, ry:13}],
  ['shoulders', 'ellipse', {cx:130, cy:82, rx:16, ry:13}],
  ['chest', 'ellipse', {cx:89, cy:92, rx:15, ry:17}],
  ['chest', 'ellipse', {cx:111, cy:92, rx:15, ry:17}],
  ['biceps', 'rect', {x:48, y:84, w:18, h:52, rx:9}],
  ['biceps', 'rect', {x:134, y:84, w:18, h:52, rx:9}],
  ['forearms', 'rect', {x:47, y:138, w:16, h:48, rx:8}],
  ['forearms', 'rect', {x:137, y:138, w:16, h:48, rx:8}],
  ['abdominals', 'rect', {x:88, y:110, w:24, h:42, rx:6}],
  ['quadriceps', 'rect', {x:80, y:162, w:20, h:84, rx:10}],
  ['quadriceps', 'rect', {x:100, y:162, w:20, h:84, rx:10}],
  ['adductors', 'rect', {x:91, y:170, w:9, h:72, rx:4}],
  ['abductors', 'rect', {x:75, y:166, w:6, h:44, rx:3}],
  ['abductors', 'rect', {x:119, y:166, w:6, h:44, rx:3}],
  ['calves', 'rect', {x:82, y:250, w:18, h:70, rx:9}],
  ['calves', 'rect', {x:100, y:250, w:18, h:70, rx:9}]
];
const MUSCLES_BACK = [
  ['neck', 'rect', {x:91, y:44, w:18, h:14, rx:6}],
  ['traps', 'polygon', {points: '68,60 132,60 120,92 100,102 80,92'}],
  ['shoulders', 'ellipse', {cx:70, cy:82, rx:16, ry:13}],
  ['shoulders', 'ellipse', {cx:130, cy:82, rx:16, ry:13}],
  ['middle back', 'rect', {x:85, y:96, w:30, h:34, rx:7}],
  ['lats', 'polygon', {points: '60,96 87,96 85,152 62,152'}],
  ['lats', 'polygon', {points: '113,96 140,96 138,152 115,152'}],
  ['lower back', 'rect', {x:87, y:148, w:26, h:18, rx:6}],
  ['triceps', 'rect', {x:48, y:84, w:18, h:52, rx:9}],
  ['triceps', 'rect', {x:134, y:84, w:18, h:52, rx:9}],
  ['forearms', 'rect', {x:47, y:138, w:16, h:48, rx:8}],
  ['forearms', 'rect', {x:137, y:138, w:16, h:48, rx:8}],
  ['glutes', 'ellipse', {cx:90, cy:172, rx:14, ry:16}],
  ['glutes', 'ellipse', {cx:110, cy:172, rx:14, ry:16}],
  ['hamstrings', 'rect', {x:80, y:190, w:20, h:62, rx:10}],
  ['hamstrings', 'rect', {x:100, y:190, w:20, h:62, rx:10}],
  ['calves', 'rect', {x:82, y:256, w:18, h:64, rx:9}],
  ['calves', 'rect', {x:100, y:256, w:18, h:64, rx:9}]
];

function _attrs(a){ return Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' '); }
function _el(tag, a, cls){ return `<${tag} class="${cls}" ${_attrs(a)}/>`; }

function _figure(side, P, S){
  const skin = side === 'front' ? SKIN_FRONT : SKIN_BACK;
  const mus = side === 'front' ? MUSCLES_FRONT : MUSCLES_BACK;
  let s = '<svg viewBox="0 0 200 340" class="fig-svg" xmlns="http://www.w3.org/2000/svg">';
  for (const [tag, a] of skin) s += _el(tag, a, 'skin');
  for (const [m, tag, a] of mus){
    const cl = P.has(m) ? 'm primary' : (S.has(m) ? 'm sec' : 'm');
    s += `<${tag} class="${cl}" ${_attrs(a)}><title>${MUSCLE_ZH[m] || m}</title></${tag}>`;
  }
  s += '</svg>';
  return s;
}

// 暴露给 app.js：传英文肌群数组
function muscleMapHTML(primaryArr, secondaryArr){
  const P = new Set((primaryArr || []).map(m => m.toLowerCase()));
  const S = new Set((secondaryArr || []).map(m => m.toLowerCase()));
  const has = P.size + S.size > 0;
  if (!has) return '';
  return `<div class="muscle-fig">
    <div><div class="figure-label">正面</div>${_figure('front', P, S)}</div>
    <div><div class="figure-label">背面</div>${_figure('back', P, S)}</div>
  </div>
  <div class="muscle-legend"><span class="dot red"></span>主要肌群　<span class="dot orange"></span>协同肌群　<span class="hint">（鼠标移到色块上看名称）</span></div>`;
}
window.muscleMapHTML = muscleMapHTML;
