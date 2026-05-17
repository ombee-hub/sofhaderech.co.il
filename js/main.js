// ============================================
// סוף הדרך - Interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ----- Header scroll effect -----
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Side drawer menu -----
  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const backdrop = document.querySelector('.menu-backdrop');
  const closeBtn = document.querySelector('.menu-close');

  const isOpen = () => mobileMenu?.classList.contains('open');
  const openMenu = () => {
    mobileMenu?.classList.add('open');
    backdrop?.classList.add('open');
    toggle?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    backdrop?.classList.remove('open');
    toggle?.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Click hamburger to toggle (open if closed, close if open)
  toggle?.addEventListener('click', () => {
    isOpen() ? closeMenu() : openMenu();
  });
  closeBtn?.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeMenu();
  });
  mobileMenu?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', closeMenu)
  );

  // ----- Reveal on scroll -----
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ----- Number counter (stats) -----
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1500;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString('he-IL');
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countObserver.observe(c));

  // ----- Set active nav link -----
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

  // ----- Accessibility widget -----
  const a11yToggle = document.getElementById('a11y-toggle');
  const a11yPanel = document.getElementById('a11y-panel');
  const a11yClose = document.getElementById('a11y-close');
  const a11yReset = document.getElementById('a11y-reset');
  const a11yButtons = document.querySelectorAll('.a11y-btn[data-class]');

  // Restore saved settings on every page load
  try {
    const saved = JSON.parse(localStorage.getItem('a11y-settings') || '[]');
    saved.forEach(cls => {
      document.body.classList.add(cls);
      const btn = document.querySelector(`.a11y-btn[data-class="${cls}"]`);
      btn?.classList.add('active');
    });
  } catch (e) {}

  const saveA11y = () => {
    const active = Array.from(a11yButtons)
      .filter(b => b.classList.contains('active'))
      .map(b => b.dataset.class);
    localStorage.setItem('a11y-settings', JSON.stringify(active));
  };

  a11yToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    a11yPanel?.classList.toggle('open');
  });
  a11yClose?.addEventListener('click', () => a11yPanel?.classList.remove('open'));
  document.addEventListener('click', (e) => {
    if (a11yPanel?.classList.contains('open') &&
        !a11yPanel.contains(e.target) &&
        e.target !== a11yToggle &&
        !a11yToggle?.contains(e.target)) {
      a11yPanel.classList.remove('open');
    }
  });

  a11yButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cls = btn.dataset.class;
      document.body.classList.toggle(cls);
      btn.classList.toggle('active');
      saveA11y();
    });
  });

  a11yReset?.addEventListener('click', () => {
    a11yButtons.forEach(b => {
      document.body.classList.remove(b.dataset.class);
      b.classList.remove('active');
    });
    localStorage.removeItem('a11y-settings');
  });

  // ----- Cookie banner -----
  const cookieBanner = document.getElementById('cookie-banner');
  if (cookieBanner && !localStorage.getItem('cookies-decision')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1500);
    cookieBanner.querySelector('.cb-accept')?.addEventListener('click', () => {
      localStorage.setItem('cookies-decision', 'accepted');
      cookieBanner.classList.remove('show');
    });
    cookieBanner.querySelector('.cb-decline')?.addEventListener('click', () => {
      localStorage.setItem('cookies-decision', 'declined');
      cookieBanner.classList.remove('show');
    });
  }
});
