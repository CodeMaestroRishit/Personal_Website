/* ===================================
   PORTFOLIO — MAIN.JS
   =================================== */

// ─── INTRO OVERLAY TYPING SEQUENCE ────────────────────────────────────────────
// Runs FIRST, blocks the page until typing is complete, then fades out
(function () {
  const overlay = document.getElementById('intro-overlay');
  const titleEl = document.getElementById('intro-title');
  const subEl = document.getElementById('intro-sub');
  if (!overlay || !titleEl) return;

  // Skip intro if already seen this session
  if (sessionStorage.getItem('introSeen')) {
    overlay.classList.add('hidden');
    overlay.style.display = 'none';
    return;
  }

  // Prevent scrolling while intro is active
  document.body.style.overflow = 'hidden';

  // Lines to type sequentially
  const LINES = [
    "Hi, I'm Rishit Guha \u2014",
    'building, learning,',
    'chasing progress.'
  ];
  const SUB = 'Cybersecurity \u00b7 Backend \u00b7 AI';

  let done = false;

  function dismissIntro() {
    if (done) return;
    done = true;
    sessionStorage.setItem('introSeen', '1');
    document.body.style.overflow = '';
    overlay.classList.add('hidden');
  }

  // Sequentially type all lines, then show subtitle, then dismiss
  function typeLines(lines, lineIdx, afterAll) {
    if (lineIdx >= lines.length) {
      afterAll();
      return;
    }

    // Add a <br> before every line after the first
    if (lineIdx > 0) {
      titleEl.insertBefore(document.createElement('br'), cursor);
    }

    const text = lines[lineIdx];
    let i = 0;

    function tick() {
      if (i < text.length) {
        titleEl.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        setTimeout(tick, 65 + Math.random() * 35);
      } else {
        // Pause between lines
        setTimeout(() => typeLines(lines, lineIdx + 1, afterAll), 300);
      }
    }
    tick();
  }

  // Build initial state: just a blinking cursor
  const cursor = document.createElement('span');
  cursor.className = 'intro-cursor';
  titleEl.appendChild(cursor);

  // Start typing after a brief moment
  setTimeout(() => {
    typeLines(LINES, 0, () => {
      // All lines typed — fade cursor, reveal subtitle, then dismiss
      cursor.style.animation = 'none';
      cursor.style.opacity = '0';

      subEl.textContent = SUB;
      subEl.classList.add('visible');

      setTimeout(dismissIntro, 1400);
    });
  }, 400);

  // Safety escape: click or keydown skips intro immediately
  ['click', 'keydown'].forEach(evt => {
    document.addEventListener(evt, () => setTimeout(dismissIntro, 0), { once: true, passive: true });
  });
})();



// ─── Sunset Section Entrance Animation ───────────────────────────────────────
// Animate the sunset section when it scrolls into view
(function () {
  const sunsetEl = document.getElementById('sunset-section');
  if (!sunsetEl) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        sunsetEl.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  obs.observe(sunsetEl);
})();


// ─── Navbar Scroll ────────────────────────────────────────────────────────────
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


// ─── Hamburger Menu ───────────────────────────────────────────────────────────
(function () {
  const ham = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!ham || !links) return;

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();


// ─── Scroll Reveal ────────────────────────────────────────────────────────────
(function () {
  const items = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const siblings = [...e.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const delay = siblings.indexOf(e.target) * 90;
        setTimeout(() => e.target.classList.add('visible'), delay);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();


// ─── Skill Bars ───────────────────────────────────────────────────────────────
(function () {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.style.getPropertyValue('--w');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => observer.observe(el));
})();


// ─── Terminal Widget ──────────────────────────────────────────────────────────
(function () {
  const cmdEl = document.getElementById('typed-cmd');
  const outEl = document.getElementById('terminal-output');
  const cursorEl = document.getElementById('cursor');
  if (!cmdEl) return;

  const sequences = [
    {
      cmd: 'cat about.json',
      output: [
        '{ "name": "Rishit Guha",',
        '  "role": "Cybersecurity & Backend Dev",',
        '  "location": "Bengaluru, India",',
        '  "open_to": "Internships & Collab" }'
      ]
    },
    {
      cmd: 'ls awards/',
      output: [
        'india_ai_buildathon_top2percent.txt',
        'ieee_smart_city_1st_prize.txt',
        'ignitia_2k25_runner_up.txt',
        'ey_techathon_2025_finalist.txt'
      ]
    },
    {
      cmd: 'ls certs/',
      output: [
        'ec_council_nde.cert',
        'google_kaggle_ai_agents.cert',
        'ibm_data_essentials.cert'
      ]
    },
    {
      cmd: 'ping rishitguha0824@gmail.com',
      output: [
        'PING rishitguha0824@gmail.com (64 bytes):',
        '64 bytes: time=1ms',
        '→ Connection established. I reply within 24h!'
      ]
    }
  ];

  let seqIdx = 0;
  let charIdx = 0;
  let typing = false;

  function typeCmd(cmd, done) {
    charIdx = 0;
    cmdEl.textContent = '';
    if (cursorEl) cursorEl.style.display = 'inline';

    function tick() {
      if (charIdx < cmd.length) {
        cmdEl.textContent += cmd[charIdx++];
        setTimeout(tick, 60 + Math.random() * 40);
      } else {
        setTimeout(done, 400);
      }
    }
    tick();
  }

  function printOutput(lines, done) {
    outEl.innerHTML = '';
    lines.forEach((line, i) => {
      setTimeout(() => {
        const d = document.createElement('div');
        d.className = 'mono t-out' + (line.startsWith('→') ? ' accent' : '');
        d.textContent = line;
        outEl.appendChild(d);
        if (i === lines.length - 1) setTimeout(done, 1800);
      }, i * 120);
    });
  }

  function clearAndNext() {
    cmdEl.textContent = '';
    outEl.innerHTML = '';
    seqIdx = (seqIdx + 1) % sequences.length;
    setTimeout(runSequence, 600);
  }

  function runSequence() {
    const s = sequences[seqIdx];
    typeCmd(s.cmd, () => {
      printOutput(s.output, clearAndNext);
    });
  }

  const termObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !typing) {
        typing = true;
        setTimeout(runSequence, 800);
        termObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  const termEl = document.getElementById('terminal-body');
  if (termEl) termObs.observe(termEl);
})();


// ─── Active Nav Highlight ─────────────────────────────────────────────────────
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      const isActive = a.getAttribute('href') === `#${current}`;
      a.style.opacity = isActive ? '1' : '';
    });
  }, { passive: true });
})();


// ─── Smooth Counter Animation (Stats) ─────────────────────────────────────────
(function () {
  const stats = document.querySelectorAll('.stat-num');

  function animateCount(el) {
    const text = el.textContent.trim();
    const suffix = text.match(/[%+K]/)?.[0] ?? '';
    const raw = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(raw)) return;

    let start = 0;
    const duration = 1400;
    const step = raw / (duration / 16);

    function update() {
      start = Math.min(start + step, raw);
      const display = Number.isInteger(raw) ? Math.round(start) : start.toFixed(1);
      el.textContent = display + suffix;
      if (start < raw) requestAnimationFrame(update);
      else el.textContent = text;
    }

    el.textContent = '0' + suffix;
    update();
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => obs.observe(el));
})();
