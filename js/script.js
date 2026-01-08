'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* =========================
   NAV MOBILE
   ========================= */
const navToggle = $('#navToggle');
const navLinks = $('#navLinks');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(open));
    });

    $$('.nav__link', navLinks).forEach(a => {
        a.addEventListener('click', () => {
            navLinks.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

/* =========================
   REMOVE STRAY "linkage"
   ========================= */
(function removeStrayText() {
    $$('.briefItem').forEach(item => {
        Array.from(item.childNodes).forEach(n => {
            if (n.nodeType === Node.TEXT_NODE && (n.textContent || '').trim().toLowerCase() === 'linkage') {
                n.remove();
            }
        });
    });
})();

/* =========================
   PRINT
   ========================= */
const btnPrint = $('#btnPrint');
if (btnPrint) btnPrint.addEventListener('click', () => window.print());

/* =========================
   MODALS
   ========================= */
const briefingModal = $('#briefingModal');
const btnBriefing = $('#btnBriefing');

const imgModal = $('#imgModal');
const imgModalTarget = $('#imgModalTarget');
const btnOpenImg = $('#btnOpenImg');

let lastImgUrl = null;

function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}
function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (btnBriefing && briefingModal) {
    btnBriefing.addEventListener('click', () => openModal(briefingModal));
    briefingModal.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) closeModal(briefingModal);
    });
}

function openImage(url) {
    if (!imgModal || !imgModalTarget) return;
    lastImgUrl = url;
    imgModalTarget.src = url;
    openModal(imgModal);
}

if (imgModal) {
    imgModal.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) closeModal(imgModal);
    });
}

if (btnOpenImg) {
    btnOpenImg.addEventListener('click', () => {
        if (!lastImgUrl) return;
        window.open(lastImgUrl, '_blank', 'noopener,noreferrer');
    });
}

$$('[data-modal-img]').forEach(el => {
    el.addEventListener('click', () => {
        const url = el.getAttribute('data-modal-img');
        if (url) openImage(url);
    });
});

/* =========================
   ACCORDION
   ========================= */
const accs = $$('.acc');

function setAccOpen(acc, open) {
    const btn = $('.acc__btn', acc);
    const panel = $('.acc__panel', acc);
    const icon = $('.acc__icon', acc);
    if (!btn || !panel || !icon) return;

    btn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    icon.textContent = open ? '–' : '+';
    acc.classList.toggle('is-open', open);
}

accs.forEach(acc => {
    const btn = $('.acc__btn', acc);
    if (!btn) return;

    btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        setAccOpen(acc, !open);
    });
});

const btnExpandAll = $('#btnExpandAll');
if (btnExpandAll) {
    btnExpandAll.addEventListener('click', () => {
        const anyClosed = accs.some(acc => !acc.classList.contains('is-open'));
        accs.forEach(acc => setAccOpen(acc, anyClosed));
    });
}

/* =========================
   FILTER BY LEVEL
   ========================= */
const levelButtons = $$('.segmented__btn');
function applyLevel(level) {
    levelButtons.forEach(b => b.classList.toggle('is-active', b.dataset.level === level));

    accs.forEach(acc => {
        const accLevel = acc.dataset.level;
        const show = level === 'all' || accLevel === level;
        acc.style.opacity = show ? '1' : '.38';
        acc.style.filter = show ? 'none' : 'saturate(.8)';
    });

    const treinos = $('#treinos');
    if (treinos) treinos.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
levelButtons.forEach(btn => btn.addEventListener('click', () => applyLevel(btn.dataset.level || 'all')));

/* =========================
   COPY LINK
   ========================= */
const btnCopyLink = $('#btnCopyLink');
if (btnCopyLink) {
    btnCopyLink.addEventListener('click', async () => {
        const hash = location.hash || '#top';
        const url = location.origin + location.pathname + hash;

        try {
            await navigator.clipboard.writeText(url);
            btnCopyLink.textContent = '✅ Copiado!';
            setTimeout(() => (btnCopyLink.textContent = '🔗 Copiar link'), 1300);
        } catch {
            const tmp = document.createElement('input');
            tmp.value = url;
            document.body.appendChild(tmp);
            tmp.select();
            document.execCommand('copy');
            tmp.remove();
            btnCopyLink.textContent = '✅ Copiado!';
            setTimeout(() => (btnCopyLink.textContent = '🔗 Copiar link'), 1300);
        }
    });
}

/* =========================
   ESC CLOSES
   ========================= */
window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (briefingModal?.classList.contains('is-open')) closeModal(briefingModal);
    if (imgModal?.classList.contains('is-open')) closeModal(imgModal);
});

/* =========================
   HERO DECOR – MORE ELEMENTS (SVG)
   ========================= */
(function injectHeroDecor() {
    const hero = $('.hero');
    if (!hero) return;

    const decor = document.createElement('div');
    decor.className = 'heroDecor';

    decor.innerHTML = `
    <!-- HUD LINES -->
    <div class="hud" aria-hidden="true">
      <svg viewBox="0 0 1200 520" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hudG" x1="0" y1="0" x2="1" y2="0">
            <stop stop-color="rgba(255,77,45,0.18)"/>
            <stop offset="0.5" stop-color="rgba(255,255,255,0.10)"/>
            <stop offset="1" stop-color="rgba(106,214,255,0.10)"/>
          </linearGradient>
        </defs>
        <path d="M50 90 H380" stroke="url(#hudG)" stroke-width="2" stroke-linecap="round"/>
        <path d="M50 120 H290" stroke="rgba(255,255,255,0.10)" stroke-width="2" stroke-linecap="round"/>
        <path d="M860 110 H1150" stroke="url(#hudG)" stroke-width="2" stroke-linecap="round"/>
        <path d="M930 140 H1150" stroke="rgba(255,255,255,0.10)" stroke-width="2" stroke-linecap="round"/>

        <circle cx="600" cy="120" r="46" stroke="rgba(255,177,59,0.14)" stroke-width="2" fill="transparent"/>
        <circle cx="600" cy="120" r="18" stroke="rgba(255,77,45,0.18)" stroke-width="2" fill="transparent"/>
        <path d="M600 74 V166" stroke="rgba(255,255,255,0.10)" stroke-width="2"/>
        <path d="M554 120 H646" stroke="rgba(255,255,255,0.10)" stroke-width="2"/>

        <path d="M180 420 C260 380, 320 380, 420 420" stroke="rgba(255,77,45,0.14)" stroke-width="2" fill="transparent"/>
        <path d="M780 420 C860 380, 920 380, 1020 420" stroke="rgba(255,177,59,0.12)" stroke-width="2" fill="transparent"/>

        <circle cx="190" cy="420" r="4" fill="rgba(255,77,45,0.35)"/>
        <circle cx="1010" cy="420" r="4" fill="rgba(255,177,59,0.30)"/>
      </svg>
    </div>

    <!-- RAPEL -->
    <div class="decor rapel" aria-hidden="true">
      <svg viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#FF4D2D" stop-opacity="0.40"/>
            <stop offset="1" stop-color="#FFB13B" stop-opacity="0.18"/>
          </linearGradient>
          <linearGradient id="rope" x1="0" y1="0" x2="0" y2="1">
            <stop stop-color="rgba(255,255,255,0.70)"/>
            <stop offset="1" stop-color="rgba(255,255,255,0.12)"/>
          </linearGradient>
        </defs>
        <path d="M110 0 C112 55, 112 95, 110 140 C108 186, 108 218, 110 260" stroke="url(#rope)" stroke-width="2"/>
        <circle cx="110" cy="148" r="38" fill="url(#g1)"/>
        <path d="M102 124c0-6 5-12 8-13 4-2 8-1 11 2 3 3 4 8 3 12-1 4-3 7-6 9v10c0 7-6 12-13 12-7 0-13-5-13-12v-8c-3-3-5-7-5-12z" fill="rgba(255,255,255,0.70)"/>
        <path d="M85 158c7-8 16-12 25-12s18 4 25 12c2 3 1 7-2 9-4 2-8 1-10-2-3-4-7-6-13-6s-10 2-13 6c-2 3-6 4-10 2-3-2-4-6-2-9z" fill="rgba(255,255,255,0.50)"/>
        <circle cx="55" cy="92" r="2" fill="rgba(255,177,59,0.55)"/>
        <circle cx="42" cy="120" r="1.6" fill="rgba(255,77,45,0.50)"/>
        <circle cx="64" cy="142" r="1.8" fill="rgba(255,211,106,0.55)"/>
      </svg>
    </div>

    <!-- PARAQUEDAS -->
    <div class="decor parachute" aria-hidden="true">
      <svg viewBox="0 0 240 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="canopy" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="rgba(255,77,45,0.42)"/>
            <stop offset="0.6" stop-color="rgba(255,177,59,0.26)"/>
            <stop offset="1" stop-color="rgba(255,211,106,0.18)"/>
          </linearGradient>
        </defs>
        <path d="M20 92C36 40 80 18 120 18C160 18 204 40 220 92C186 72 156 66 120 66C84 66 54 72 20 92Z" fill="url(#canopy)"/>
        <path d="M20 92C36 40 80 18 120 18C160 18 204 40 220 92" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
        <path d="M60 90 L110 190" stroke="rgba(255,255,255,0.24)" stroke-width="2"/>
        <path d="M90 82 L120 190" stroke="rgba(255,255,255,0.20)" stroke-width="2"/>
        <path d="M150 82 L120 190" stroke="rgba(255,255,255,0.20)" stroke-width="2"/>
        <path d="M180 90 L130 190" stroke="rgba(255,255,255,0.24)" stroke-width="2"/>
        <circle cx="120" cy="196" r="10" fill="rgba(255,255,255,0.68)"/>
        <path d="M106 210c4-8 10-12 14-12s10 4 14 12" stroke="rgba(255,255,255,0.50)" stroke-width="4" stroke-linecap="round"/>
      </svg>
    </div>

    <!-- DRONE / HELI SILHOUETTE -->
    <div class="decor drone" aria-hidden="true">
      <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 90H240" stroke="rgba(255,255,255,0.14)" stroke-width="2" stroke-linecap="round"/>
        <path d="M80 80C105 60 155 60 180 80" stroke="rgba(255,177,59,0.16)" stroke-width="3" stroke-linecap="round"/>
        <path d="M110 98H150" stroke="rgba(255,255,255,0.18)" stroke-width="6" stroke-linecap="round"/>
        <circle cx="70" cy="90" r="10" stroke="rgba(255,77,45,0.16)" stroke-width="2"/>
        <circle cx="190" cy="90" r="10" stroke="rgba(255,77,45,0.16)" stroke-width="2"/>
        <circle cx="130" cy="90" r="26" stroke="rgba(255,255,255,0.10)" stroke-width="2"/>
        <circle cx="130" cy="90" r="4" fill="rgba(255,177,59,0.35)"/>
      </svg>
    </div>
  `;

    hero.appendChild(decor);
})();

/* =========================
   PARALLAX (VERY STRONG) – mouse + scroll + section layers + media
   ========================= */
(function parallax() {
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // 🔥 MAIS FORTE
    const STRENGTH_X = 46;   // antes ~18
    const STRENGTH_Y = 38;   // antes ~18
    const SMOOTH = 0.065;    // suaviza, mas mantém resposta “forte”
    const SMOOTH_SCROLL = 0.11;

    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;
    let curS = 0;

    // extra wobble (cinematic)
    let exX = 0, exY = 0;
    let exTX = 0, exTY = 0;

    window.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx; // -1..1
        const dy = (e.clientY - cy) / cy; // -1..1

        targetX = dx * STRENGTH_X;
        targetY = dy * STRENGTH_Y;

        // micro “shake” controlado (dá vida)
        exTX = dx * 10;
        exTY = dy * 10;
    }, { passive: true });

    function computeScrollDrift() {
        const y = window.scrollY || 0;
        // drift mais forte, mas ainda elegante
        return Math.max(-46, Math.min(46, (y / 720) * 24));
    }

    // cria camadas em todas as seções automaticamente
    function ensureSectionLayers() {
        const sections = $$('.section');
        sections.forEach((sec, idx) => {
            if (sec.querySelector('.sectionParallax')) return;

            const layer = document.createElement('div');
            layer.className = 'sectionParallax';

            // variação por seção (posições diferentes)
            const leftA = (idx % 2 === 0) ? '4%' : '68%';
            const topA = (idx % 3 === 0) ? '10%' : '22%';
            const leftB = (idx % 2 === 0) ? '70%' : '8%';
            const topB = (idx % 3 === 0) ? '62%' : '74%';

            // HUD + shapes + embers (sutil)
            layer.innerHTML = `
        <div class="floatEl shape" style="left:${leftA}; top:${topA};"
             data-parallax-layer style2
             data-px="0.16" data-py="0.12" data-px2="0.10" data-py2="0.08"></div>

        <div class="floatEl shape" style="left:${leftB}; top:${topB}; width:320px; height:320px; opacity:.38;"
             data-parallax-layer
             data-px="0.10" data-py="0.18" data-px2="0.06" data-py2="0.10"></div>

        <div class="floatEl hudLines" style="left:10%; top:58%;"
             data-parallax-layer
             data-px="0.22" data-py="0.10" data-px2="0.10" data-py2="0.06">
          <svg viewBox="0 0 360 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 40H170" stroke="rgba(255,255,255,0.10)" stroke-width="2" stroke-linecap="round"/>
            <path d="M18 70H120" stroke="rgba(255,77,45,0.12)" stroke-width="2" stroke-linecap="round"/>
            <path d="M190 50H340" stroke="rgba(255,177,59,0.10)" stroke-width="2" stroke-linecap="round"/>
            <circle cx="260" cy="150" r="44" stroke="rgba(255,255,255,0.08)" stroke-width="2" fill="none"/>
            <circle cx="260" cy="150" r="16" stroke="rgba(255,77,45,0.12)" stroke-width="2" fill="none"/>
            <path d="M250 150H270" stroke="rgba(255,255,255,0.10)" stroke-width="2"/>
            <path d="M260 140V160" stroke="rgba(255,255,255,0.10)" stroke-width="2"/>
          </svg>
        </div>

        <div class="floatEl embers" style="left:78%; top:16%;"
             data-parallax-layer
             data-px="0.28" data-py="0.20" data-px2="0.12" data-py2="0.10">
          <svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="e1" cx="30%" cy="30%">
                <stop offset="0" stop-color="rgba(255,211,106,0.55)"/>
                <stop offset="1" stop-color="rgba(0,0,0,0)"/>
              </radialGradient>
              <radialGradient id="e2" cx="60%" cy="60%">
                <stop offset="0" stop-color="rgba(255,77,45,0.35)"/>
                <stop offset="1" stop-color="rgba(0,0,0,0)"/>
              </radialGradient>
            </defs>
            <circle cx="60" cy="80" r="42" fill="url(#e1)"/>
            <circle cx="140" cy="110" r="50" fill="url(#e2)"/>
            <circle cx="100" cy="150" r="36" fill="url(#e1)"/>
          </svg>
        </div>
      `;

            sec.prepend(layer);
        });
    }

    // media parallax: qualquer elemento com [data-parallax-media]
    function updateParallaxMedia() {
        const medias = $$('[data-parallax-media]');
        medias.forEach(el => {
            const inner = el.querySelector('img,video');
            if (!inner) return;
            // nada aqui: o movimento já vem do CSS via vars globais
            // mas garantimos class premium:
            el.classList.add('parallaxMedia');
            if (inner.tagName === 'VIDEO') {
                inner.muted = true;
                inner.playsInline = true;
                inner.loop = true;
                // tenta tocar sem travar
                inner.play().catch(() => { });
            }
        });
    }

    // aplica depths via data-attrs (sem mudar HTML)
    function applyDepthVars() {
        $$('[data-parallax-layer]').forEach(el => {
            const px = parseFloat(el.getAttribute('data-px') || '0.10');
            const py = parseFloat(el.getAttribute('data-py') || '0.10');
            const px2 = parseFloat(el.getAttribute('data-px2') || '0.06');
            const py2 = parseFloat(el.getAttribute('data-py2') || '0.06');
            el.style.setProperty('--px', String(px));
            el.style.setProperty('--py', String(py));
            el.style.setProperty('--px2', String(px2));
            el.style.setProperty('--py2', String(py2));
        });
    }

    // stronger 3D tilt on hero media card + thumbs
    function attach3DTilt() {
        const cards = $$('.mediaCard, .card, .rankCard, .thumb, .gimg');
        cards.forEach(el => {
            el.style.transformStyle = 'preserve-3d';
            el.addEventListener('mousemove', (e) => {
                const r = el.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                const rx = (py - 0.5) * -10;
                const ry = (px - 0.5) * 12;
                el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
            }, { passive: true });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    ensureSectionLayers();
    updateParallaxMedia();
    applyDepthVars();
    attach3DTilt();

    // update on resize (re-check layers if DOM changes)
    window.addEventListener('resize', () => {
        ensureSectionLayers();
        updateParallaxMedia();
        applyDepthVars();
    }, { passive: true });

    function tick() {
        const drift = computeScrollDrift();

        curX += (targetX - curX) * SMOOTH;
        curY += (targetY - curY) * SMOOTH;
        curS += (drift - curS) * SMOOTH_SCROLL;

        exX += (exTX - exX) * 0.05;
        exY += (exTY - exY) * 0.05;

        // define variáveis globais
        root.style.setProperty('--parx-x', `${curX}px`);
        root.style.setProperty('--parx-y', `${curY}px`);
        root.style.setProperty('--parx-s', `${curS}px`);

        // extra wobble
        root.style.setProperty('--parx-xx', `${exX}px`);
        root.style.setProperty('--parx-yy', `${exY}px`);

        requestAnimationFrame(tick);
    }
    tick();
})();


/* =========================
   FIRE / EMBERS (subtle)
   ========================= */
(function embers() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const c = document.createElement('canvas');
    c.id = 'embersCanvas';
    document.body.appendChild(c);

    const ctx = c.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;

    function resize() {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        w = Math.floor(window.innerWidth);
        h = Math.floor(window.innerHeight);
        c.width = Math.floor(w * dpr);
        c.height = Math.floor(h * dpr);
        c.style.width = w + 'px';
        c.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    // low density for cinematic subtle
    const MAX = Math.min(90, Math.floor((w * h) / 26000));
    const particles = [];

    const rand = (a, b) => a + Math.random() * (b - a);

    function spawn() {
        const fromBottom = Math.random() < 0.88;
        const x = fromBottom ? rand(0, w) : (Math.random() < 0.5 ? -20 : w + 20);
        const y = fromBottom ? h + rand(0, 160) : rand(0, h * 0.6);

        particles.push({
            x, y,
            vx: rand(-0.18, 0.18),
            vy: rand(-0.95, -0.28),
            r: rand(0.9, 2.1),
            a: rand(0.18, 0.55),
            life: rand(170, 340),
            hue: rand(18, 44),
            wig: rand(0.4, 1.2)
        });
    }

    for (let i = 0; i < MAX; i++) spawn();

    let t = 0;
    function step() {
        t += 1;
        ctx.clearRect(0, 0, w, h);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            p.life -= 1;
            p.x += p.vx + Math.sin((t + i) * 0.01) * (0.12 * p.wig);
            p.y += p.vy + Math.cos((t + i) * 0.008) * 0.07;

            const k = Math.max(0, Math.min(1, p.life / 240));
            const fadeTop = Math.max(0, Math.min(1, (p.y / h)));
            const alpha = p.a * k * (0.22 + fadeTop);

            // ember core
            ctx.beginPath();
            ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${alpha})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            // soft halo
            ctx.beginPath();
            ctx.fillStyle = `hsla(${p.hue + 6}, 100%, 65%, ${alpha * 0.18})`;
            ctx.arc(p.x, p.y, p.r * 3.0, 0, Math.PI * 2);
            ctx.fill();

            if (p.life <= 0 || p.y < -80 || p.x < -140 || p.x > w + 140) {
                particles.splice(i, 1);
                spawn();
            }
        }

        requestAnimationFrame(step);
    }
    step();
})();

/* =========================
   CINEMATIC SMOKE (very subtle)
   ========================= */
(function smoke() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const c = document.createElement('canvas');
    c.id = 'smokeCanvas';
    document.body.appendChild(c);

    const ctx = c.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;

    function resize() {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        w = Math.floor(window.innerWidth);
        h = Math.floor(window.innerHeight);
        c.width = Math.floor(w * dpr);
        c.height = Math.floor(h * dpr);
        c.style.width = w + 'px';
        c.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const blobs = [];
    const rand = (a, b) => a + Math.random() * (b - a);

    const count = Math.min(14, Math.max(8, Math.floor(w / 160)));
    for (let i = 0; i < count; i++) {
        blobs.push({
            x: rand(-80, w + 80),
            y: rand(h * 0.35, h + 120),
            r: rand(160, 360),
            vx: rand(-0.08, 0.08),
            vy: rand(-0.14, -0.05),
            a: rand(0.04, 0.08),
            hue: rand(18, 38),
            t: rand(0, 9999)
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        // slight vignette + warm haze
        const grad = ctx.createRadialGradient(w * 0.5, h * 0.9, 10, w * 0.5, h * 0.9, h * 0.9);
        grad.addColorStop(0, 'rgba(255,77,45,0.035)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        for (const b of blobs) {
            b.t += 0.01;
            b.x += b.vx + Math.sin(b.t) * 0.05;
            b.y += b.vy + Math.cos(b.t * 0.8) * 0.05;

            // wrap
            if (b.y + b.r < -120) {
                b.y = h + b.r + rand(40, 200);
                b.x = rand(-80, w + 80);
            }

            const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
            g.addColorStop(0, `hsla(${b.hue}, 100%, 60%, ${b.a})`);
            g.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }
    draw();
})();

/* =========================================================
   REAL DEPTH PARALLAX (SECTION-BASED) + CINEMA VIDEO FALLBACK
   + GALLERY THUMB PARALLAX
   ========================================================= */
(function parallaxDepthReal() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const sections = $$('[data-parallax-section], .section');
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    // 1) REAL DEPTH por seção: cada uma reage conforme entra na viewport
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // guardamos o ratio em dataset
            entry.target.dataset.inview = String(entry.intersectionRatio || 0);
        });
    }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });

    sections.forEach(sec => io.observe(sec));

    function updateLocalDepth() {
        const vh = window.innerHeight || 1;
        sections.forEach(sec => {
            const r = sec.getBoundingClientRect();

            // progress 0..1 baseado em onde a seção está na viewport
            // 0 = acabou de entrar por baixo | 1 = saindo por cima
            const progress = clamp((vh - r.top) / (vh + r.height), 0, 1);

            // depth Y local: mais forte no meio da seção (cinema)
            // curva “S” suave:
            const t = progress;
            const ease = t * t * (3 - 2 * t); // smoothstep
            const depth = (ease - 0.5) * 80; // 🔥 força do depth local

            sec.style.setProperty('--sp', String(progress));
            sec.style.setProperty('--sy', `${depth}px`);
        });

        requestAnimationFrame(updateLocalDepth);
    }
    updateLocalDepth();

    // 2) FALLBACK vídeo: se não tocar/erro, mostra fallback
    function attachVideoFallback(video, fallbackEl) {
        if (!video || !fallbackEl) return;

        const showFallback = () => {
            video.style.opacity = '0';
            fallbackEl.style.opacity = '1';
        };
        const showVideo = () => {
            video.style.opacity = '1';
            fallbackEl.style.opacity = '0';
        };

        fallbackEl.style.opacity = '0';
        fallbackEl.style.transition = 'opacity 220ms ease';
        video.style.transition = 'opacity 220ms ease';

        video.addEventListener('error', showFallback);
        video.addEventListener('stalled', showFallback);
        video.addEventListener('suspend', () => {/* ok */ });
        video.addEventListener('loadeddata', showVideo);

        // tenta tocar sem travar
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(showFallback);

        // se o browser bloquear autoplay, fallback aparece
        setTimeout(() => {
            if (video.paused) showFallback();
        }, 800);
    }

    // HERO
    attachVideoFallback(
        $('#heroVideo'),
        document.querySelector('.heroMedia__fallback')
    );

    // ORDEM
    const ordemWrap = document.querySelector('#ordem .sectionCinema');
    if (ordemWrap) {
        attachVideoFallback(
            ordemWrap.querySelector('video'),
            ordemWrap.querySelector('.sectionCinema__fallback')
        );
    }

    // 3) GALERIA: thumb “descola” com mouse (parallax interno)
    function attachThumbParallax(sel) {
        const els = $$(sel);
        els.forEach(btn => {
            const img = btn.querySelector('img');
            if (!img) return;

            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;   // 0..1
                const y = (e.clientY - r.top) / r.height;  // 0..1

                // deslocamento forte porém elegante
                const dx = (x - 0.5) * 18; // px
                const dy = (y - 0.5) * 14; // px

                btn.style.setProperty('--gx', `${dx}px`);
                btn.style.setProperty('--gy', `${dy}px`);
            }, { passive: true });

            btn.addEventListener('mouseleave', () => {
                btn.style.setProperty('--gx', `0px`);
                btn.style.setProperty('--gy', `0px`);
            });
        });
    }

    attachThumbParallax('.gimg');
    attachThumbParallax('.thumb');
})();

/* =========================================================
   INTRO FÊNIX (2s) — fênix atravessa + faíscas permanecem
   ========================================================= */
(function introPhoenix() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const wrap = document.getElementById('introPhoenix');
    const canvas = document.getElementById('introCanvas');
    const skip = document.getElementById('introSkip');

    if (!wrap || !canvas) return;

    // ⏱️ 3s contínuo (sem pausa)
    const FLY_MS = 3000;
    const SPARK_MS = 0;
    const TOTAL_MS = FLY_MS + SPARK_MS;


    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;

    function resize() {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        w = Math.floor(window.innerWidth);
        h = Math.floor(window.innerHeight);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const rand = (a, b) => a + Math.random() * (b - a);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    // trilha diagonal aproximada (ponto de emissão)
    function emitterAt(t01) {
        // começa fora em baixo-esquerda e cruza pra cima-direita
        const x = (-0.15 * w) + (1.25 * w) * t01;
        const y = (1.10 * h) - (1.45 * h) * t01;
        return { x, y };
    }

    // partículas
    const sparks = [];
    const MAX = 340; // denso no começo e vai caindo

    function spawnSpark(x, y, boost) {
        // boost = mais faíscas enquanto fênix passa
        const speed = rand(4.2, 10.5) * boost;
        const angle = rand(-Math.PI * 0.95, -Math.PI * 0.10); // sobe para cima
        sparks.push({
            x: x + rand(-10, 10),
            y: y + rand(-10, 10),
            vx: Math.cos(angle) * speed + rand(-1.2, 1.2),
            vy: Math.sin(angle) * speed + rand(-.8, .8),
            r: rand(0.8, 2.4) * boost,
            life: rand(22, 52) * boost,
            max: 0,
            hue: rand(18, 46),
            tw: rand(0.6, 1.4)
        });
        sparks[sparks.length - 1].max = sparks[sparks.length - 1].life;
    }

    // fumaça muito suave (não “cartoon”)
    const puffs = [];
    function spawnPuff(x, y) {
        puffs.push({
            x: x + rand(-18, 18),
            y: y + rand(-18, 18),
            r: rand(30, 70),
            a: rand(0.05, 0.10),
            life: rand(26, 44),
            max: 0,
            vx: rand(-0.6, 0.6),
            vy: rand(-1.3, -0.5)
        });
        puffs[puffs.length - 1].max = puffs[puffs.length - 1].life;
    }

    // tempo
    const start = performance.now();
    let done = false;

    function draw(now) {
        const elapsed = now - start;
        const t = clamp(elapsed / TOTAL_MS, 0, 1);

        // 0..1 durante o voo (primeiro segundo)
        const flyT = clamp(elapsed / FLY_MS, 0, 2);

        ctx.clearRect(0, 0, w, h);

        // emissor segue a fênix só no primeiro segundo
        if (elapsed <= FLY_MS) {
            const { x, y } = emitterAt(flyT);

            // densidade maior no meio do voo
            const intensity = 0.9 + Math.sin(flyT * Math.PI) * 1.1;

            // gera várias faíscas por frame
            const count = Math.floor(6 * intensity);
            for (let i = 0; i < count; i++) {
                if (sparks.length < MAX) spawnSpark(x, y, intensity);
            }

            // puff leve
            if (Math.random() < 0.35) spawnPuff(x, y);
        }

        // desenha puffs (atrás)
        for (let i = puffs.length - 1; i >= 0; i--) {
            const p = puffs[i];
            p.life -= 1;
            p.x += p.vx;
            p.y += p.vy;

            const k = p.life / p.max;
            const a = p.a * k;

            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
            g.addColorStop(0, `rgba(255, 180, 120, ${a})`);
            g.addColorStop(1, `rgba(0,0,0,0)`);

            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            if (p.life <= 0) puffs.splice(i, 1);
        }

        // desenha sparks (frente)
        for (let i = sparks.length - 1; i >= 0; i--) {
            const s = sparks[i];
            s.life -= 1;

            // física
            s.vx *= 0.985;
            s.vy *= 0.985;
            s.vy += 0.12; // gravidade leve
            s.x += s.vx + Math.sin((now * 0.002 + i) * 0.7) * 0.12 * s.tw;
            s.y += s.vy;

            const k = clamp(s.life / s.max, 0, 1);
            const alpha = (0.18 + k * 0.62) * k;

            // núcleo
            ctx.beginPath();
            ctx.fillStyle = `hsla(${s.hue}, 100%, 60%, ${alpha})`;
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();

            // halo
            ctx.beginPath();
            ctx.fillStyle = `hsla(${s.hue + 6}, 100%, 65%, ${alpha * 0.18})`;
            ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2);
            ctx.fill();

            if (s.life <= 0 || s.y > h + 160 || s.x < -200 || s.x > w + 200) {
                sparks.splice(i, 1);
            }
        }

        // fade out suave perto do final
        if (elapsed > TOTAL_MS - 260) {
            wrap.style.opacity = String(clamp((TOTAL_MS - elapsed) / 260, 0, 1));
        }

        if (elapsed >= TOTAL_MS && !done) {
            done = true;
            wrap.classList.add('is-done');
            setTimeout(() => wrap.remove(), 320);
            return;
        }

        requestAnimationFrame(draw);
    }

    // pular
    if (skip) {
        skip.addEventListener('click', () => {
            if (done) return;
            done = true;
            wrap.classList.add('is-done');
            setTimeout(() => wrap.remove(), 220);
        });
    }

    requestAnimationFrame(draw);
})();

(() => {
    const vids = Array.from(document.querySelectorAll("video"));

    function showFallback(video, on = true) {
        const wrap = video.closest(".heroMedia, .sectionCinema");
        if (!wrap) return;
        const fb = wrap.querySelector(".heroMedia__fallback, .sectionCinema__fallback");
        if (!fb) return;
        fb.style.opacity = on ? "1" : "0";
    }

    async function safePlay(video) {
        try {
            video.muted = true;
            video.playsInline = true;

            // iOS/Safari: precisa estar "ready" às vezes
            if (video.readyState < 2) {
                await new Promise((res) => video.addEventListener("canplay", res, { once: true }));
            }

            const p = video.play();
            if (p && p.then) await p;

            // tocou -> esconde fallback
            showFallback(video, false);
            return true;
        } catch (e) {
            // falhou -> mostra fallback e tenta após gesto do usuário
            showFallback(video, true);

            const retry = () => {
                safePlay(video);
                window.removeEventListener("click", retry);
                window.removeEventListener("touchstart", retry);
            };
            window.addEventListener("click", retry, { once: true });
            window.addEventListener("touchstart", retry, { once: true });
            return false;
        }
    }

    // tenta tocar quando entra na viewport (evita gastar banda e resolve mobile)
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                const v = e.target;
                if (e.isIntersecting) safePlay(v);
                else v.pause();
            });
        },
        { threshold: 0.25 }
    );

    vids.forEach((v) => {
        // fallback visível até tocar
        showFallback(v, true);

        // evita “tela preta”
        v.setAttribute("preload", "metadata");
        v.setAttribute("muted", "");
        v.setAttribute("playsinline", "");
        v.loop = true;

        io.observe(v);
    });

    // tentativa inicial
    window.addEventListener("load", () => vids.forEach(safePlay));
})();
