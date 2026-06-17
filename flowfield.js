/* Distribution transport field.
   Samples start at rest in an initial distribution (a jittered grid). They
   don't move on their own — only when the cursor moves do they flow toward
   a target distribution gathered around the cursor, then relax back to the
   initial distribution when it leaves. Dots at rest; little arrows while
   they flow. (A nod to diffusion / score-based transport.) */
(function () {
  const canvas = document.querySelector('.bg-field');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const SPACING = 42;     // initial grid spacing
  const JITTER = 10;      // randomness in the initial distribution
  const SIGMA = 200;      // cursor gather radius (std dev of the pull)
  const GATHER = 0.9;     // how strongly samples collect at the cursor
  const K = 0.05;         // spring stiffness toward target
  const DAMP = 0.86;      // velocity damping
  const MAXTAIL = 13;     // longest flow streak
  const COLOR = '47, 75, 143';   // ink blue

  let w, h, dpr;
  let pts = [];
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, active: false, ever: false };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function build() {
    pts = [];
    for (let x = SPACING * 0.5; x < w; x += SPACING) {
      for (let y = SPACING * 0.5; y < h; y += SPACING) {
        const hx = x + (Math.random() - 0.5) * JITTER * 2;
        const hy = y + (Math.random() - 0.5) * JITTER * 2;
        pts.push({ hx: hx, hy: hy, x: hx, y: hy, vx: 0, vy: 0 });
      }
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function dot(x, y, a) {
    ctx.fillStyle = 'rgba(' + COLOR + ',' + a.toFixed(3) + ')';
    ctx.beginPath();
    ctx.arc(x, y, 1.15, 0, Math.PI * 2);
    ctx.fill();
  }

  function arrow(x, y, vx, vy, speed, a) {
    const inv = 1 / speed;
    let len = Math.min(speed * 6, MAXTAIL);
    const ux = vx * inv, uy = vy * inv;
    const ex = x + ux * len, ey = y + uy * len;
    const c = 'rgba(' + COLOR + ',' + a.toFixed(3) + ')';
    ctx.strokeStyle = c;
    ctx.lineWidth = 1;
    const ang = Math.atan2(uy, ux);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(ex, ey);
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex + Math.cos(ang + 2.6) * 3, ey + Math.sin(ang + 2.6) * 3);
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex + Math.cos(ang - 2.6) * 3, ey + Math.sin(ang - 2.6) * 3);
    ctx.stroke();
  }

  function frame() {
    mouse.x += (mouse.tx - mouse.x) * 0.12;
    mouse.y += (mouse.ty - mouse.y) * 0.12;

    ctx.clearRect(0, 0, w, h);
    const twoSig2 = 2 * SIGMA * SIGMA;

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];

      // target defaults to the sample's home (the initial distribution)
      let tx = p.hx, ty = p.hy;

      if (mouse.active) {
        // gather toward the cursor with a Gaussian weight on home distance
        const dhx = mouse.x - p.hx;
        const dhy = mouse.y - p.hy;
        const g = Math.exp(-(dhx * dhx + dhy * dhy) / twoSig2);
        tx = p.hx + dhx * g * GATHER;
        ty = p.hy + dhy * g * GATHER;
      }

      // spring–damper toward target
      p.vx = (p.vx + (tx - p.x) * K) * DAMP;
      p.vy = (p.vy + (ty - p.y) * K) * DAMP;
      p.x += p.vx;
      p.y += p.vy;

      const speed = Math.hypot(p.vx, p.vy);
      if (speed > 0.18) {
        arrow(p.x, p.y, p.vx, p.vy, speed, 0.22 + Math.min(speed * 0.05, 0.4));
      } else {
        dot(p.x, p.y, 0.20);
      }
    }

    requestAnimationFrame(frame);
  }

  function renderStatic() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < pts.length; i++) dot(pts[i].hx, pts[i].hy, 0.20);
  }

  window.addEventListener('pointermove', function (e) {
    // ignore the cursor while it's over the content card — the field only
    // responds out in the background margins
    if (e.target && e.target.closest && e.target.closest('.wrap')) {
      mouse.active = false;
      return;
    }
    if (!mouse.ever) { mouse.x = e.clientX; mouse.y = e.clientY; mouse.ever = true; }
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
    mouse.active = true;
  });
  window.addEventListener('pointerout', function () { mouse.active = false; });
  window.addEventListener('resize', function () { resize(); if (reduce) renderStatic(); });

  resize();
  if (reduce) renderStatic();   // motionless field of samples
  else { renderStatic(); frame(); }  // first paint static, then driven by cursor
})();
