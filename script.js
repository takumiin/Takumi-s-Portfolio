// モバイル用ナビゲーション
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
links.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// スクロールに合わせたフェードイン
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// 「要記入」表示の切り替え（公開前の見え方確認用）
const todoToggle = document.querySelector('.todo-toggle');
if (!document.querySelector('.todo')) {
  todoToggle.remove();
} else {
  todoToggle.addEventListener('click', () => {
    const hidden = document.body.classList.toggle('hide-todo');
    todoToggle.textContent = hidden ? '要記入を表示' : '要記入を隠す';
  });
}

document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 数字のカウントアップ
document.querySelectorAll('.count').forEach((el) => {
  if (reduceMotion) return;
  const to = Number(el.dataset.to);
  el.textContent = '0';
  const countObserver = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    countObserver.disconnect();
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / 1200, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  countObserver.observe(el);
});

// ヒーロー背景：電子回路をイメージした、つながり合うノード
const canvas = document.querySelector('.hero-canvas');
const ctx = canvas.getContext('2d');
let nodes = [];
const resize = () => {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(70, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 16000));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.offsetWidth,
    y: Math.random() * canvas.offsetHeight,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
  }));
};
const draw = () => {
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  ctx.clearRect(0, 0, w, h);
  for (const n of nodes) {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > w) n.vx *= -1;
    if (n.y < 0 || n.y > h) n.vy *= -1;
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 140) {
        // 回路配線のように、L字型の線で結ぶ
        ctx.strokeStyle = `rgba(79, 209, 255, ${0.22 * (1 - d / 140)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
  for (const n of nodes) ctx.fillRect(n.x - 2, n.y - 2, 4, 4);
  if (!reduceMotion) requestAnimationFrame(draw);
};
resize();
window.addEventListener('resize', resize);
draw();
