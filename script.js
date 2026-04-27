/* ============================================
   NUTRIZIONE GLOBALE – Interactive Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Hamburger Menu ──
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Scroll Reveal Animations ──
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ── Contact Form ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Gather form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      
      // Basic validation
      const requiredFields = ['nome', 'cognome', 'email', 'telefono'];
      let valid = true;
      
      requiredFields.forEach(field => {
        const input = contactForm.querySelector(`[name="${field}"]`);
        if (!data[field] || data[field].trim() === '') {
          input.style.borderColor = '#EF4444';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });
      
      // Email validation
      const emailInput = contactForm.querySelector('[name="email"]');
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        emailInput.style.borderColor = '#EF4444';
        valid = false;
      }
      
      if (!valid) return;
      
      // Build mailto link as fallback
      const subject = encodeURIComponent('Richiesta informazioni – Nutrizione Globale');
      const body = encodeURIComponent(
        `Nome: ${data.nome} ${data.cognome}\n` +
        `Email: ${data.email}\n` +
        `Telefono: ${data.telefono}\n` +
        `Sede preferita: ${data.sede || 'Non specificata'}\n\n` +
        `Messaggio:\n${data.messaggio || 'Desidero essere ricontattato.'}`
      );
      
      // Show success state
      contactForm.style.display = 'none';
      const successMsg = document.querySelector('.form-success');
      if (successMsg) successMsg.classList.add('show');
      
      // Open mailto
      window.location.href = `mailto:segreteriavercilli@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // ── Active nav link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
  // ── Animated Counters ──
  const counterElements = document.querySelectorAll('.hero-stat-number');
  if (counterElements.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart for smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeProgress * target);

        if (target >= 1000) {
          el.textContent = current.toLocaleString('it-IT') + suffix;
        } else {
          el.textContent = current + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // ── Pricing Cards Mobile Toggle ──
  const pricingCards = document.querySelectorAll('.pricing-card');
  const pricingComplete = document.querySelector('.pricing-complete');

  const toggleExpanded = function() {
    // Only apply toggle logic if we are on mobile (where the expanded class matters)
    if (window.innerWidth <= 768) {
      this.classList.toggle('expanded');
    }
  };

  pricingCards.forEach(card => {
    card.addEventListener('click', toggleExpanded);
  });

  if (pricingComplete) {
    pricingComplete.addEventListener('click', toggleExpanded);
  }

});
