/* ============================================================
   HOODI STRATEGY GROUP — MASTER SCRIPT
   Handles: scroll reveal, mobile menu, publications filter,
            staggered focus-item animations, hamburger toggle.
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. MOBILE MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 2. SCROLL REVEAL ── */
  // Uses [data-reveal] attribute: up | down | left | right | scale | fade
  // Uses [data-delay] attribute: 1-6 (multiplied by delay steps in CSS)
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ── 3. STAGGERED FOCUS LIST ITEMS ── */
  // Each .focus-item gets revealed with increasing delay
  const focusItems = document.querySelectorAll('.focus-item');
  if (focusItems.length) {
    const focusObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.focus-item');
          items.forEach((item, i) => {
            setTimeout(() => item.classList.add('revealed'), i * 110);
          });
          focusObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    const focusList = document.querySelector('.focus-list');
    if (focusList) focusObserver.observe(focusList);
  }

  /* ── 4. PUBLICATIONS FILTER ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.card');

  if (filterBtns.length && cards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        cards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          if (match) {
            card.style.display = 'flex';
            // Re-trigger entrance animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(24px)';
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── 5. NAVBAR SCROLL EFFECT ── */
  // Adds subtle shadow and slight bg shift on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 20) {
        navbar.style.boxShadow = '0 4px 32px rgba(0,0,0,0.5)';
      } else {
        navbar.style.boxShadow = 'none';
      }
      lastScroll = y;
    }, { passive: true });
  }

  /* ── 6. SMOOTH IMAGE LOAD ── */
  // Fade images in once loaded
  document.querySelectorAll('img').forEach(img => {
    img.style.transition = 'opacity 0.6s ease';
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.style.opacity = '0';
      img.addEventListener('load', () => { img.style.opacity = '1'; });
      img.addEventListener('error', () => { img.style.opacity = '1'; });
    }
  });

})();
