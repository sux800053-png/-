const canvas = document.getElementById('pet');
const ctx = canvas.getContext('2d');

const COLORS = {
  suit: '#313a83',
  suit2: '#4650a4',
  cream: '#f3e9cf',
  eye: '#101015',
  blush: '#f3b3c2',
  tear: '#73b8ff',
  tail: '#151515',
  line: 'rgba(10, 12, 30, 0.12)',
};

const STATES = ['idle','happy','shy','cry','surprised','clicked','drag','sleep','study'];
let state = 'idle';
let stateStart = performance.now();
let last = performance.now();
let drag = false;
let blinkAt = 0;

function setState(next, duration = 2600) {
  state = next;
  stateStart = performance.now();
  if (next !== 'drag') {
    setTimeout(() => {
      if (state === next) setState('idle');
    }, duration);
  }
}

canvas.addEventListener('click', () => setState('clicked', 1800));
canvas.addEventListener('pointerdown', e => {
  drag = true;
  canvas.setPointerCapture(e.pointerId);
  canvas.classList.add('dragging');
  state = 'drag';
  stateStart = performance.now();
});
canvas.addEventListener('pointerup', e => {
  drag = false;
  canvas.releasePointerCapture(e.pointerId);
  canvas.classList.remove('dragging');
  setState('surprised', 1100);
});

window.addEventListener('keydown', e => {
  const map = { '1':'idle','2':'happy','3':'shy','4':'cry','5':'surprised','6':'clicked','7':'drag','8':'sleep','9':'study' };
  if (map[e.key]) setState(map[e.key]);
});

setInterval(() => {
  if (state === 'idle') {
    const r = Math.random();
    if (r < 0.22) setState('happy');
    else if (r < 0.35) setState('shy');
    else if (r < 0.46) setState('study', 3600);
    else if (r < 0.52) setState('sleep', 3800);
    else blinkAt = performance.now() + 180;
  }
}, 3200);

function draw(t) {
  const dt = t - last;
  last = t;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const local = (t - stateStart) / 1000;
  const bob = Math.sin(t * 0.0032) * 2;

  let bodyY = 220 + bob;
  let scaleY = 1;
  let headTilt = 0;
  let eyeMode = 'normal';
  let mouthMode = 'w';
  let armMode = 'side';
  let legMode = 'stub';
  let tear = false;
  let blush = false;
  let bubble = '';

  if (state === 'idle') {
    if ((t % 5000) > 3200 && (t % 5000) < 4300) headTilt = -0.08;
    if (t < blinkAt) eyeMode = 'blink';
  } else if (state === 'happy') {
    bodyY -= Math.abs(Math.sin(local * 8)) * 10;
    eyeMode = 'smile'; mouthMode = 'openw'; armMode = 'hug';
  } else if (state === 'shy') {
    scaleY = 0.95; headTilt = -0.06; eyeMode = 'half'; armMode = 'front'; blush = true;
  } else if (state === 'cry') {
    bodyY += Math.sin(local * 16) * 2;
    eyeMode = 'wet'; mouthMode = 'sadw'; tear = true;
  } else if (state === 'surprised') {
    bodyY -= Math.max(0, 14 - local * 30);
    headTilt = Math.sin(local * 20) * 0.05;
    eyeMode = 'round'; mouthMode = 'dot';
  } else if (state === 'clicked') {
    if (local < 0.2) eyeMode = 'round';
    armMode = 'point';
    bubble = '喵';
  } else if (state === 'drag' || drag) {
    bodyY = 200 + Math.sin(t * 0.01) * 4;
    eyeMode = 'round'; armMode = 'up'; legMode = 'hang';
  } else if (state === 'sleep') {
    bodyY = 260;
    headTilt = 1.35;
    eyeMode = 'sleep'; mouthMode = 'tinyw';
    bubble = 'Zzz';
  } else if (state === 'study') {
    bodyY = 232;
    eyeMode = 'normal'; armMode = 'book';
    headTilt = Math.sin(local * 2.6) * 0.04;
    if ((local % 2.8) > 1.5) bubble = '🍙';
  }

  ctx.save();
  ctx.translate(210, bodyY);
  ctx.scale(1, scaleY);

  // tail / back strap
  ctx.fillStyle = COLORS.tail;
  roundRect(-16, 58, 30, 12, 8, true);

  // body
  gradientBody(-70, -10, 140, 130, 62);
  // belly
  ctx.fillStyle = COLORS.cream;
  roundRect(-42, 14, 84, 82, 40, true);

  drawArms(armMode);
  drawLegs(legMode);

  // head
  ctx.save();
  ctx.translate(0, -66);
  ctx.rotate(headTilt);
  gradientBody(-78, -70, 156, 136, 68);
  // ears
  gradientBody(-72, -98, 54, 50, 24);
  gradientBody(18, -98, 54, 50, 24);

  ctx.fillStyle = COLORS.cream;
  roundRect(-56, -54, 112, 96, 50, true);

  drawFace(eyeMode, mouthMode, blush, tear);
  ctx.restore();

  if (state === 'study') drawBook(local);
  if (bubble) drawBubble(bubble, state === 'sleep' ? 70 : -120);
  ctx.restore();

  requestAnimationFrame(draw);
}

function gradientBody(x, y, w, h, r) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, COLORS.suit2);
  g.addColorStop(1, COLORS.suit);
  ctx.fillStyle = g;
  roundRect(x, y, w, h, r, true);
  ctx.strokeStyle = COLORS.line;
  ctx.stroke();
}
function drawArms(mode) { /* simplified visuals */
  ctx.fillStyle = COLORS.cream;
  if (mode === 'side') { roundRect(-78, 30, 34, 24, 14, true); roundRect(44, 30, 34, 24, 14, true); }
  if (mode === 'hug') { roundRect(-52, 38, 34, 24, 14, true); roundRect(18, 38, 34, 24, 14, true); }
  if (mode === 'front') { roundRect(-34, 54, 30, 22, 12, true); roundRect(4, 54, 30, 22, 12, true); }
  if (mode === 'point') { roundRect(-74, 36, 32, 22, 12, true); roundRect(42, 20, 40, 16, 8, true); }
  if (mode === 'up') { roundRect(-70, -12, 24, 54, 12, true); roundRect(46, -12, 24, 54, 12, true); }
  if (mode === 'book') { roundRect(-52, 50, 26, 20, 10, true); roundRect(26, 50, 26, 20, 10, true); }
}
function drawLegs(mode) {
  ctx.fillStyle = COLORS.cream;
  if (mode === 'stub') { roundRect(-40, 98, 32, 20, 10, true); roundRect(8, 98, 32, 20, 10, true); }
  else { roundRect(-38, 102, 26, 34, 12, true); roundRect(12, 102, 26, 34, 12, true); }
}
function drawFace(eye, mouth, blush, tear) {
  if (eye === 'smile') { arcEye(-24,-8,true); arcEye(24,-8,true); }
  else if (eye === 'half') { arcEye(-24,-8,false); arcEye(24,-8,false); }
  else if (eye === 'sleep') { ctx.lineWidth = 4; line(-34,-8,-14,-8); line(14,-8,34,-8); }
  else if (eye === 'blink') { ctx.lineWidth = 4; line(-30,-10,-18,-10); line(18,-10,30,-10); }
  else {
    const big = eye === 'round' ? 16 : 13;
    circle(-24, -8, big, COLORS.eye);
    circle(24, -8, big, COLORS.eye);
    circle(-20, -12, 4, '#fff');
    circle(28, -12, 4, '#fff');
    if (eye === 'wet') { circle(-12, 8, 3, '#9dc8ff'); circle(36, 8, 3, '#9dc8ff'); }
  }
  ctx.strokeStyle = COLORS.eye; ctx.fillStyle = COLORS.eye; ctx.lineWidth = 3;
  if (mouth === 'dot') circle(0, 20, 3.5, COLORS.eye);
  else if (mouth === 'sadw') { line(-14,20,-4,26); line(-4,26,4,22); line(4,22,14,28); }
  else { line(-14,22,-5,15); line(-5,15,3,22); line(3,22,14,16); }
  if (blush) { circle(-42, 12, 9, COLORS.blush); circle(42, 12, 9, COLORS.blush); }
  if (tear) { drop(-56, 24); drop(56, 28); }
}
function drawBook(local) {
  ctx.fillStyle = '#e8d9ab'; roundRect(-44, 40, 88, 54, 10, true);
  ctx.fillStyle = '#c7b37f'; roundRect(-2, 40, 4, 54, 2, true);
  if ((local % 2.2) > 1.7) { ctx.fillStyle = '#f7eed2'; roundRect(40, 42, 10, 50, 4, true); }
}
function drawBubble(text, y) {
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; roundRect(80, y, 56, 34, 14, true);
  ctx.fillStyle = '#3f3f3f'; ctx.font = '18px sans-serif'; ctx.fillText(text, 92, y + 23);
}
function drop(x, y){ ctx.fillStyle=COLORS.tear; roundRect(x-4,y-1,8,14,6,true); }
function arcEye(x,y,up){ ctx.strokeStyle=COLORS.eye; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(x,y,10, up?0.15*Math.PI:1.15*Math.PI, up?0.85*Math.PI:1.85*Math.PI); ctx.stroke(); }
function line(x1,y1,x2,y2){ ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke(); }
function circle(x,y,r,c){ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); }
function roundRect(x,y,w,h,r,fill){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); if(fill)ctx.fill(); }

requestAnimationFrame(draw);
