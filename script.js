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
        p.hidden = !active;
      });
    });
    tab.addEventListener('keydown', (e) => {
      const idx = Array.from(tabs).indexOf(tab);
      if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(idx + 1) % tabs.length].focus(); tabs[(idx + 1) % tabs.length].click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(idx - 1 + tabs.length) % tabs.length].focus(); tabs[(idx - 1 + tabs.length) % tabs.length].click(); }
    });
  });

  // Reveal animations
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Mark reveal targets (add class via JS so base HTML stays clean)
  document.querySelectorAll('section > .container, .experience, .dish, .story-image, .philo-image').forEach((el) => {
    el.classList.add('reveal');
  });
  // Re-run observation after adding classes
  if (!reduced && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io2.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach((el) => {
      if (!el.classList.contains('in')) io2.observe(el);
    });
  }

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

    // phone optional but basic check if provided
    const phone = form.phone.value.trim();
    if (phone && phone.replace(/[^0-9]/g, '').length < 7) { setError('phone', 'Please enter a valid phone number or leave blank.'); ok = false; }
    else setError('phone', '');

    if (!date) { setError('date', 'Please choose a date.'); ok = false; }
    else {
      const d = new Date(date);
      const today = new Date(); today.setHours(0,0,0,0);
      if (d < today) { setError('date', 'Date must be today or later.'); ok = false; }
      else setError('date', '');
    }
    if (!time) { setError('time', 'Please choose a time.'); ok = false; }
    else setError('time', '');
    if (!guests) { setError('guests', 'Please select guests.'); ok = false; }
    else setError('guests', '');
    return ok;
  }

  if (form) {
    form.addEventListener('input', (e) => {
      // clear error on input for that field
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
        window.open('https://wa.me/9137079995?text=' + encodeURIComponent(lines.join(String.fromCharCode(10))), '_blank', 'noopener');
        success.hidden = false;
        form.reset();
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        // focus first invalid
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  // Force reduced-motion friendly: disable smooth scroll if preferred
  if (reduced) {
    document.documentElement.style.scrollBehavior = 'auto';
  }
})();
