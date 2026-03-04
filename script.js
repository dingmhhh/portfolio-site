/* ============================================================
   MEREDITH DING — PORTFOLIO · script.js
   Handles: dark mode, language toggle, scroll reveal,
            active nav, modal, hamburger, contact form
   ============================================================ */

/* ─── 1. THEME (dark / light) ────────────────────────────── */
const html        = document.documentElement;
const themeBtn    = document.getElementById('theme-toggle');

// Detect system preference on first load
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme  = localStorage.getItem('theme');
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

themeBtn.addEventListener('click', () => {
  const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

function applyTheme(theme) {
  html.dataset.theme = theme;
}


/* ─── 2. LANGUAGE TOGGLE (EN / 中文) ─────────────────────── */
const langBtn  = document.getElementById('lang-toggle');
let   currentLang = 'en';

langBtn.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'zh' : 'en';
  applyLanguage(currentLang);
  langBtn.textContent = currentLang === 'en' ? 'EN / 中文' : '中文 / EN';
});

function applyLanguage(lang) {
  // Grab every element with a data-en / data-zh attribute
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text) {
      // Buttons, inputs, anchors → set textContent; textareas → skip
      if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
        el.textContent = text;
      }
    }
  });
}


/* ─── 3. SMOOTH SCROLL & ACTIVE NAV LINK ─────────────────── */
// Smooth scroll on all anchor clicks
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    // Close mobile menu if open
    mobileMenu.classList.remove('open');
  });
});

// Highlight active nav link on scroll
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


/* ─── 4. SCROLL REVEAL ───────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate once
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));


/* ─── 5. HAMBURGER / MOBILE MENU ─────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});


/* ─── 6. PROJECT MODAL ───────────────────────────────────── */
const modalOverlay = document.getElementById('modal-overlay');
const modalClose   = document.getElementById('modal-close');
const modalTitle   = document.getElementById('modal-title');
const modalDesc    = document.getElementById('modal-desc');
const modalTools   = document.getElementById('modal-tools');

// Open modal when "View Details" is clicked (event delegation on cards)
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => openModal(card));
});

function openModal(card) {
  const lang   = currentLang;
  const title  = card.getAttribute('data-title-' + lang) || card.getAttribute('data-title-en');
  const desc   = card.getAttribute('data-desc-'  + lang) || card.getAttribute('data-desc-en');
  const tools  = card.getAttribute('data-tools');

  modalTitle.textContent = title;
  modalDesc.textContent  = desc;
  modalTools.textContent = tools ? '🛠 ' + tools : '';

  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  modalClose.focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
}

modalClose.addEventListener('click', closeModal);

// Close on overlay click (outside modal box)
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});


/* ─── 7. CONTACT FORM (frontend-only) ────────────────────── */
function handleFormSubmit(e) {
  e.preventDefault();
  const note = document.getElementById('form-note');

  // Simple client-side feedback — connect a service like Formspree for real emails
  note.textContent = '✓ Message received! I\'ll get back to you soon.';
  note.style.color = 'var(--accent)';

  // Reset after 4 seconds
  setTimeout(() => {
    e.target.reset();
    note.textContent = '';
  }, 4000);
}


/* ─── 8. NAVBAR SHADOW ON SCROLL ─────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 8
    ? '0 2px 20px rgba(0,0,0,.08)'
    : 'none';
}, { passive: true });
