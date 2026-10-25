(function () {
  'use strict';

  const header = document.getElementById('siteHeader');
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('menuToggle');

  // Header scroll state
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile nav
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Menu tabs
  const tabs = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.category;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      panels.forEach((p) => {
        const active = p.dataset.category === cat;
        p.classList.toggle('is-active', active);
        if (active) {
          p.hidden = false;
          const animate = window.__motionAnimate;
          if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            animate(p, { opacity: [0, 1], y: [12, 0] }, { duration: 0.4, easing: 'ease-out' });
          }
        } else {
          p.hidden = true;
        }
      });
    });
    tab.addEventListener('keydown', (e) => {
      const idx = Array.from(tabs).indexOf(tab);
      if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(idx + 1) % tabs.length].focus(); tabs[(idx + 1) % tabs.length].click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(idx - 1 + tabs.length) % tabs.length].focus(); tabs[(idx - 1 + tabs.length) % tabs.length].click(); }
    });
  });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mark reveal targets
  const revealTargets = ['section > .container', '.experience', '.dish', '.story-image', '.philo-image'];
  revealTargets.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => el.classList.add('reveal'));
  });

  // Reservation form
  const form = document.getElementById('reserveForm');
  const success = document.getElementById('formSuccess');

  function setError(name, msg) {
    const field = form.querySelector(`.error[data-for="${name}"]`);
    if (field) field.textContent = msg;
    const input = form.querySelector(`[name="${name}"]`);
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validate() {
    let ok = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const date = form.date.value;
    const time = form.time.value;
    const guests = form.guests.value;

    if (name.length < 2) { setError('name', 'Please enter your full name.'); ok = false; }
    else setError('name', '');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email', 'Please enter a valid email address.'); ok = false; }
    else setError('email', '');

    const phone = form.phone.value.trim();
    if (phone && phone.replace(/[^0-9]/g, '').length < 7) { setError('phone', 'Please enter a valid phone number or leave blank.'); ok = false; }
    else setError('phone', '');

    if (!date) { setError('date', 'Please choose a date.'); ok = false; }
    else {
      const parts = date.split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      const today = new Date(); today.setHours(0,0,0,0);
      if (d < today) { setError('date', 'Date must be today or later.'); ok = false; }
      else if (d.getDay() === 1) { setError('date', 'We are closed on Mondays. Please choose Tue–Sun.'); ok = false; }
      else setError('date', '');
    }
    if (!time) { setError('time', 'Please choose a time.'); ok = false; }
    else setError('time', '');
    if (!guests) { setError('guests', 'Please select guests.'); ok = false; }
    else setError('guests', '');
    return ok;
  }

  if (form) {
    const dateInput = form.querySelector('input[name="date"]');
    if (dateInput) {
      const t = new Date();
      const iso = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
      dateInput.min = iso;
    }
    form.addEventListener('input', (e) => {
      const target = e.target;
      if (target && target.name) setError(target.name, '');
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validate()) {
        const lines = [
          'EMBER & OAK - Reservation request',
          'Name: ' + form.name.value.trim(),
          'Email: ' + form.email.value.trim(),
          form.phone.value.trim() ? 'Phone: ' + form.phone.value.trim() : '',
          'Date: ' + form.date.value,
          'Time: ' + form.time.value,
          'Guests: ' + form.guests.value,
        ].filter(Boolean);
        window.open('https://wa.me/10000000000?text=' + encodeURIComponent(lines.join(String.fromCharCode(10))), '_blank', 'noopener,noreferrer');
        success.hidden = false;
        form.reset();
        if (window.__motionAnimate && !reduced) {
          window.__motionAnimate(success, { opacity: [0, 1], y: [12, 0] }, { duration: 0.5, easing: 'ease-out' });
        }
        success.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
        if (typeof success.focus === 'function') success.focus();
      } else {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  // Force reduced-motion friendly: disable smooth scroll if preferred
  if (reduced) {
    document.documentElement.style.scrollBehavior = 'auto';
  }

  // ---- Motion-powered animations (CDN ESM build) ----
  async function setupMotion() {
    const revealEls = [...document.querySelectorAll('.reveal')];

    if (reduced) {
      revealEls.forEach((el) => el.classList.add('in'));
      return;
    }

    let motion = null;
    try {
      motion = await import('https://esm.sh/motion@14');
    } catch (err) {
      motion = null;
    }

    if (motion && typeof motion.animate === 'function' && typeof motion.inView === 'function') {
      const { animate, inView } = motion;
      window.__motionAnimate = animate;

      // Hero entrance
      const heroChildren = [...document.querySelectorAll('.hero-content > *')];
      if (heroChildren.length) {
      try {
        animate(heroChildren, { opacity: [0, 1], y: [24, 0] }, {
          duration: 0.9,
          delay: (i) => i * 0.12,
          easing: 'ease-out',
        });
      } catch (e) {
        // Fall through; reveals below still animate.
      }
      }

      // Scroll-triggered reveals
      inView('.reveal', (info) => {
        animate(info.target, { opacity: [0, 1], y: [28, 0] }, {
          duration: 0.9,
          easing: [0.22, 1, 0.36, 1],
        });
        info.target.classList.add('in');
      }, { margin: '0px 0px -40px 0px', amount: 0.12 });

      // Safety net: ensure nothing stays invisible if inView misses
      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
          animate(el, { opacity: [0, 1], y: [28, 0] }, { duration: 0.6, easing: 'ease-out' });
          el.classList.add('in');
        });
      }, 1500);
    } else {
      // Fallback to CSS transition + IntersectionObserver
      document.body.classList.add('css-reveal');
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              io.unobserve(e.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el) => {
          if (!el.classList.contains('in')) io.observe(el);
        });
      } else {
        revealEls.forEach((el) => el.classList.add('in'));
      }
    }
  }

  setupMotion();
})();