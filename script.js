/* ── Particle canvas ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(Math.random() * 0.3 + 0.05),
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() < 0.4 ? '#d63f6a' : '#ffffff',
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, randomParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10 || p.x < -10 || p.x > W + 10) {
        Object.assign(p, randomParticle(), { y: H + 5 });
      }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

/* ── Footer tulips ── */
(function drawFooterTulips() {
  const g = document.getElementById('ftrow');
  if (!g) return;
  const count = 11;
  const totalW = 560;
  const spacing = totalW / (count + 1);
  const colors = [
    ['#ff9ab5', '#d63f6a', '#8b0a3a'],
    ['#ffd6e0', '#c0315a', '#6e0520'],
    ['#ffbdd0', '#e8537a', '#9e1040'],
  ];
  for (let i = 0; i < count; i++) {
    const cx = spacing * (i + 1);
    const c = colors[i % colors.length];
    const h = 32 + (i % 3) * 7;
    const stemH = 88;
    g.insertAdjacentHTML('beforeend', `
      <g transform="translate(${cx - 10}, 0)" opacity="${0.55 + (i % 3) * 0.15}">
        <line x1="10" y1="${stemH}" x2="10" y2="${h + 14}" stroke="#1e6e40" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M10 ${h+14} C4 ${h+6} 2 ${h-4} 4 ${h-12} C6 ${h-20} 10 ${h-24} 10 ${h-20} C10 ${h-12} 10 ${h-4} 10 ${h+14}Z" fill="${c[0]}" opacity="0.8"/>
        <path d="M10 ${h+14} C16 ${h+6} 18 ${h-4} 16 ${h-12} C14 ${h-20} 10 ${h-24} 10 ${h-20} C10 ${h-12} 10 ${h-4} 10 ${h+14}Z" fill="${c[1]}" opacity="0.8"/>
        <path d="M10 ${h+14} C6 ${h+5} 5 ${h-6} 7 ${h-14} C9 ${h-22} 10 ${h-24} 10 ${h-20} C10 ${h-12} 10 ${h-4} 10 ${h+14}Z" fill="${c[2]}" opacity="0.65"/>
        <circle cx="10" cy="${h-26}" r="1.8" fill="#ffd84d" opacity="0.8"/>
      </g>
    `);
  }
})();

/* ── Scroll reveal ── */
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.i ? parseInt(e.target.dataset.i) * 120 : 0;
        setTimeout(() => e.target.classList.add('vis'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.g-card, .lt-card').forEach(el => obs.observe(el));
})();

/* ── Lightbox ── */
(function initLightbox() {
  const images = [
    { src: 'img1.jpg', cap: 'Juntos bajo las estrellas' },
    { src: 'img2.jpg', cap: 'Cerca, siempre cerca' },
    { src: 'img3.jpg', cap: 'Salidas que se vuelven recuerdos' },
    { src: 'img4.jpg', cap: 'Sonrisas que lo dicen todo' },
  ];

  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  let cur = 0;

  function open(i) {
    cur = i;
    lbImg.src = images[i].src;
    lbCap.textContent = images[i].cap;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function go(dir) {
    cur = (cur + dir + images.length) % images.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = images[cur].src;
      lbCap.textContent = images[cur].cap;
      lbImg.style.opacity = '1';
    }, 160);
  }

  lbImg.style.transition = 'opacity 0.18s';

  document.querySelectorAll('.g-card').forEach(card => {
    card.addEventListener('click', () => open(parseInt(card.dataset.i)));
  });

  document.getElementById('lbX').addEventListener('click', close);
  document.getElementById('lbL').addEventListener('click', () => go(-1));
  document.getElementById('lbR').addEventListener('click', () => go(1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
})();