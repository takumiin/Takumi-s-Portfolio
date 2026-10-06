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
