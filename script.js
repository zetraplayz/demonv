/* ============================================================
   DemonV | King of the Hill | script.js
   Copyright (c) 2026 ZETRA PLAYZ. All rights reserved.
   ============================================================ */

(function () {
  'use strict';

  /* ---- LOADER ---- */
  window.addEventListener('load', function () {
    setTimeout(function () {
      var ld = document.getElementById('loader');
      if (ld) {
        ld.classList.add('out');
        setTimeout(function () { if (ld.parentNode) ld.parentNode.removeChild(ld); }, 600);
      }
    }, 1800);
  });

  /* ---- CURSOR ---- */
  var dot  = document.getElementById('cur-dot');
  var ring = document.getElementById('cur-ring');

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var ringX  = mouseX;
  var ringY  = mouseY;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = 'translate(' + (mouseX - 4) + 'px, ' + (mouseY - 4) + 'px)';
  });

  var isHovering = false;
  (function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    var scale = isHovering ? 1.6 : 1;
    ring.style.transform = 'translate(' + (ringX - 15) + 'px, ' + (ringY - 15) + 'px) scale(' + scale + ')';
    requestAnimationFrame(animateCursor);
  }());

  document.addEventListener('mouseleave', function () {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  var hoverEls = document.querySelectorAll('a, button, .team-card, .feat-card, .rule-item, .credit-item, .h-stat, .sb-stat');
  hoverEls.forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      document.body.classList.add('cur-hover');
      isHovering = true;
    });
    el.addEventListener('mouseleave', function () {
      document.body.classList.remove('cur-hover');
      isHovering = false;
    });
  });

  /* ---- NAV SCROLL ---- */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });

  /* ---- CANVAS PARTICLE NETWORK ---- */
  var canvas = document.getElementById('bgCanvas');
  var ctx    = canvas.getContext('2d');
  var W, H, pts = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    pts = [];
    var count = Math.floor((W * H) / 15000);
    for (var i = 0; i < count; i++) {
      pts.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r:  Math.random() * 1.2 + 0.3,
        a:  Math.random() * 0.7 + 0.2
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    /* subtle grid */
    ctx.strokeStyle = 'rgba(232,32,32,0.022)';
    ctx.lineWidth = 0.5;
    var gs = 55;
    for (var x = 0; x < W; x += gs) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (var y = 0; y < H; y += gs) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    /* particles + connections */
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(232,32,32,' + (p.a * 0.55) + ')';
      ctx.fill();

      for (var j = i + 1; j < pts.length; j++) {
        var q  = pts[j];
        var dx = p.x - q.x;
        var dy = p.y - q.y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 125) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(232,32,32,' + (0.1 * (1 - d / 125)) + ')';
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  drawParticles();

  /* ---- TYPEWRITER ---- */
  var phrases = [
    'OPFOR vs BLUFOR vs INFOR',
    'Capture. Hold. Dominate.',
    '48 Players | 3 Teams | 1 King',
    'Ground & Air Combat',
    'Rank Up. Prestige. Destroy.',
    'No mercy. No respite.'
  ];
  var twEl  = document.getElementById('tw-text');
  var pi    = 0;
  var ci    = 0;
  var del   = false;

  function typeStep() {
    var ph = phrases[pi];
    if (!del) {
      twEl.textContent = ph.slice(0, ci + 1);
      ci++;
      if (ci >= ph.length) { del = true; setTimeout(typeStep, 2200); return; }
    } else {
      twEl.textContent = ph.slice(0, ci - 1);
      ci--;
      if (ci <= 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(typeStep, 320); return; }
    }
    setTimeout(typeStep, del ? 36 : 65);
  }
  if (twEl) typeStep();

  /* ---- COUNT UP ---- */
  function countUp(el) {
    var target = parseInt(el.dataset.count, 10);
    var current = 0;
    var step = Math.max(1, Math.ceil(target / 55));
    var iv = setInterval(function () {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(iv);
    }, 22);
  }

  /* ---- TEAM METER BARS ---- */
  function animateMeters() {
    document.querySelectorAll('.team-meter-fill').forEach(function (el) {
      var pct = parseInt(el.dataset.w, 10) / 100;
      el.style.transform = 'scaleX(' + pct + ')';
    });
  }

  /* ---- SCROLL REVEAL + TRIGGER COUNT/METERS ---- */
  var countersStarted = false;
  var metersStarted   = false;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        /* trigger count-up inside visible sections */
        if (!countersStarted) {
          var counters = document.querySelectorAll('[data-count]');
          counters.forEach(countUp);
          countersStarted = true;
        }
        if (!metersStarted) {
          setTimeout(animateMeters, 400);
          metersStarted = true;
        }
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });

  /* ---- 3D CARD TILT ---- */
  var dvCard = document.getElementById('dvCard');
  if (dvCard) {
    dvCard.addEventListener('mousemove', function (e) {
      var r  = dvCard.getBoundingClientRect();
      var x  = (e.clientX - r.left) / r.width  - 0.5;
      var y  = (e.clientY - r.top)  / r.height - 0.5;
      dvCard.style.transform = 'perspective(900px) rotateY(' + (x * 9) + 'deg) rotateX(' + (-y * 6) + 'deg) scale(1.015)';
    });
    dvCard.addEventListener('mouseleave', function () {
      dvCard.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)';
    });
  }

  /* ---- COPY IP ---- */
  var cpBtn = document.getElementById('cpBtn');
  if (cpBtn) {
    cpBtn.addEventListener('click', function () {
      navigator.clipboard.writeText('connect vvljbx').then(function () {
        cpBtn.textContent = 'Copied!';
        cpBtn.classList.add('ok');
        setTimeout(function () {
          cpBtn.textContent = 'Copy IP \u2014 connect vvljbx';
          cpBtn.classList.remove('ok');
        }, 2200);
      });
    });
  }

  /* ---- SAFETY NET (in case animations stall) ---- */
  setTimeout(function () {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    if (!countersStarted) {
      document.querySelectorAll('[data-count]').forEach(countUp);
    }
    if (!metersStarted) {
      animateMeters();
    }
  }, 2200);

}());