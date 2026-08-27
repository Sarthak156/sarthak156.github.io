/* ============================================================
   SARTHAK GOYAL — PORTFOLIO INTERACTIONS
   ============================================================ */

/* ---------- theme toggle (persisted) ---------- */
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('sg-theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  if (next === 'light') root.setAttribute('data-theme', 'light');
  else root.removeAttribute('data-theme');
  localStorage.setItem('sg-theme', next === 'light' ? 'light' : '');
});

/* ---------- custom cursor ---------- */
const cursor = document.querySelector('.cursor');
let cx = -100, cy = -100, tx = -100, ty = -100;
window.addEventListener('mousemove', e => {
  tx = e.clientX; ty = e.clientY;
  cursor.classList.add('on');
});
(function moveCursor() {
  cx += (tx - cx) * 0.22;
  cy += (ty - cy) * 0.22;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(moveCursor);
})();
document.querySelectorAll('a, button, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

/* ---------- scroll progress bar ---------- */
const progress = document.querySelector('.progress-bar');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
  progress.style.width = (pct * 100) + '%';
}, { passive: true });

/* ---------- typewriter roles ---------- */
const roles = [
  'data scientist_',
  'ml engineer_',
  'demand forecaster_',
  'full-stack tinkerer_',
  'zero-inflated data whisperer_'
];
const tw = document.getElementById('typewriter');
let rIdx = 0, chIdx = 0, deleting = false;
(function type() {
  const word = roles[rIdx];
  tw.textContent = word.slice(0, chIdx);
  if (!deleting && chIdx < word.length) { chIdx++; setTimeout(type, 65); }
  else if (!deleting) { deleting = true; setTimeout(type, 1600); }
  else if (chIdx > 0) { chIdx--; setTimeout(type, 30); }
  else { deleting = false; rIdx = (rIdx + 1) % roles.length; setTimeout(type, 350); }
})();

/* ---------- hero sparkline: animated "demand forecast" ---------- */
const canvas = document.getElementById('sparkline');
const ctx = canvas.getContext('2d');
let W, H, t = 0;

function sizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.clientWidth; H = canvas.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
sizeCanvas();
window.addEventListener('resize', sizeCanvas);

// sparse demand series — mostly zeros with spikes (a nod to the real work)
const N = 90;
const series = Array.from({ length: N }, (_, i) =>
  Math.random() < 0.72 ? 0 : 0.25 + Math.random() * 0.75
);

function accent() {
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
}
function dimInk() {
  return getComputedStyle(document.documentElement).getPropertyValue('--ink-dim').trim();
}

(function drawSpark() {
  ctx.clearRect(0, 0, W, H);
  const step = W / (N - 1);
  const base = H - 8;

  // baseline
  ctx.strokeStyle = dimInk();
  ctx.globalAlpha = 0.35;
  ctx.setLineDash([2, 5]);
  ctx.beginPath(); ctx.moveTo(0, base); ctx.lineTo(W, base); ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  // bars (actuals)
  const revealCount = Math.min(N, Math.floor(t * 1.4));
  for (let i = 0; i < revealCount; i++) {
    const x = i * step;
    const v = series[i];
    if (v === 0) {
      ctx.fillStyle = dimInk();
      ctx.globalAlpha = 0.4;
      ctx.fillRect(x - 0.5, base - 1.5, 2, 2);
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = accent();
      const bh = v * (H - 18);
      ctx.fillRect(x - 1, base - bh, 2.5, bh);
    }
  }

  // moving "forecast" sine wave overlay
  ctx.strokeStyle = accent();
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  for (let x = 0; x <= W; x += 3) {
    const y = base - 14
      - Math.sin(x * 0.02 + t * 0.03) * 9
      - Math.sin(x * 0.007 - t * 0.015) * 7;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  t++;
  requestAnimationFrame(drawSpark);
})();

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- counter animation ---------- */
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    counterIO.unobserve(e.target);
    const el = e.target;
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat__num').forEach(el => counterIO.observe(el));

/* ---------- project ledger accordion ---------- */
document.querySelectorAll('.ledger__row').forEach(row => {
  const head = row.querySelector('.ledger__head');
  const panel = row.querySelector('.ledger__panel');
  head.addEventListener('click', () => {
    const isOpen = row.dataset.open === 'true';
    // close others
    document.querySelectorAll('.ledger__row[data-open="true"]').forEach(r => {
      if (r !== row) {
        r.dataset.open = 'false';
        r.querySelector('.ledger__head').setAttribute('aria-expanded', 'false');
        r.querySelector('.ledger__panel').style.maxHeight = '0px';
      }
    });
    row.dataset.open = String(!isOpen);
    head.setAttribute('aria-expanded', String(!isOpen));
    panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
  });
});

/* ---------- contact form (mailto handoff, no backend needed) ---------- */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  // validate
  let valid = true;
  [['name', name], ['email', email], ['message', message]].forEach(([key, val]) => {
    const field = form[key].closest('.field');
    const bad = !val || (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
    field.classList.toggle('error', bad);
    if (bad) valid = false;
  });
  if (!valid) {
    status.textContent = '// ERROR: FILL EVERY FIELD (WITH A REAL EMAIL).';
    return;
  }

  const subject = encodeURIComponent(`Portfolio contact — ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
  window.location.href = `mailto:goyalsarthak156@gmail.com?subject=${subject}&body=${body}`;

  status.textContent = '// OPENING YOUR MAIL CLIENT… MESSAGE PRE-FILLED.';
  form.reset();
  setTimeout(() => (status.textContent = ''), 6000);
});

/* live-clear error styling while typing */
form.querySelectorAll('input, textarea').forEach(el =>
  el.addEventListener('input', () => el.closest('.field').classList.remove('error'))
);

/* ---------- footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- tiny console easter egg ---------- */
console.log(
  '%c> hello, recruiter. the real portfolio is in the git log.\n> mail: goyalsarthak156@gmail.com',
  'color:#ff4d00;font-family:monospace;font-size:12px'
);
