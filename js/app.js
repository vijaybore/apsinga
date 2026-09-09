/**
 * Main Application Logic for Apsinga Tech Infra Solutions
 * Handles Language toggling, Navigation, Modals, Forms, FAQs, and Animations.
 */

// Current selected language ('en' or 'mr')
let currentLang = localStorage.getItem('apsinga_lang') || 'en';

// Set language and update all localized elements
function setLanguage(lang) {
  if (!translations[lang]) lang = 'en';
  currentLang = lang;
  localStorage.setItem('apsinga_lang', lang);

  // Update button states
  const enBtns = document.querySelectorAll('.lang-btn-en');
  const mrBtns = document.querySelectorAll('.lang-btn-mr');
  
  if (lang === 'mr') {
    enBtns.forEach(btn => btn.classList.remove('active'));
    mrBtns.forEach(btn => btn.classList.add('active'));
    document.documentElement.lang = 'mr';
  } else {
    enBtns.forEach(btn => btn.classList.add('active'));
    mrBtns.forEach(btn => btn.classList.remove('active'));
    document.documentElement.lang = 'en';
  }

  // Update elements with data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.innerHTML = translations[lang][key];
      }
    }
  });

  // Re-run calculator to update labels if needed
  if (typeof calculateSolarSavings === 'function') {
    calculateSolarSavings();
  }
}

// Mobile Menu Navigation
function initNavigation() {
  const menuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Sticky Header Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}

// Modal Management
function initModals() {
  const surveyModal = document.getElementById('surveyModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const openModalBtns = document.querySelectorAll('.trigger-survey-modal');
  const closeModalBtns = document.querySelectorAll('.close-modal-btn');

  function openSurveyModal(serviceName) {
    if (surveyModal) {
      if (serviceName && document.getElementById('modalServiceType')) {
        document.getElementById('modalServiceType').value = serviceName;
      }
      surveyModal.classList.add('active');
      if (modalOverlay) modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSurveyModal() {
    if (surveyModal) surveyModal.classList.remove('active');
    if (modalOverlay) modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || 'Residential Rooftop';
      openSurveyModal(service);
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeSurveyModal);
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeSurveyModal);
  }
}

// FAQ Accordion Interaction
function initFAQs() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        // Close other items
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });
}

// Applications Filter Tabs
function initAppFilter() {
  const tabs = document.querySelectorAll('.app-tab-btn');
  const cards = document.querySelectorAll('.app-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          card.classList.add('animate-fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Form Handlers (Hero Form, Modal Form, Contact Form)
function initForms() {
  // Handle Hero Quick Form
  const heroForm = document.getElementById('heroQuickForm');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('heroName')?.value.trim() || 'Valued Customer';
      const phone = document.getElementById('heroPhone')?.value.trim() || '';
      const city = document.getElementById('heroCity')?.value.trim() || 'Pune';
      const bill = document.getElementById('heroBill')?.value.trim() || '3000';

      if (!phone || phone.length < 10) {
        showToast('Please enter a valid 10-digit phone number.', 'error');
        return;
      }

      // WhatsApp link generation
      const text = encodeURIComponent(
        `Hello Apsinga Solar Team! ☀️\n\nI want to book a FREE Site Survey & Claim Subsidy:\n` +
        `• Name: ${name}\n` +
        `• Phone: ${phone}\n` +
        `• City/Location: ${city}\n` +
        `• Avg Monthly Bill: ₹${bill}\n\n` +
        `Please call me back with the customized proposal.`
      );

      showToast('Thank you! Redirecting to WhatsApp for instant confirmation...', 'success');
      setTimeout(() => {
        window.open(`https://wa.me/919699649598?text=${text}`, '_blank');
        heroForm.reset();
      }, 1000);
    });
  }

  // Handle Survey Modal Form
  const modalForm = document.getElementById('modalSurveyForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('mName')?.value.trim() || '';
      const phone = document.getElementById('mPhone')?.value.trim() || '';
      const city = document.getElementById('mCity')?.value.trim() || '';
      const bill = document.getElementById('mBill')?.value.trim() || '';
      const service = document.getElementById('modalServiceType')?.value || 'Rooftop Solar';

      if (!phone || phone.length < 10) {
        showToast('Please enter a valid 10-digit phone number.', 'error');
        return;
      }

      const text = encodeURIComponent(
        `Hello Apsinga Team! ⚡\n\nI want to book a Site Survey for: *${service}*\n` +
        `• Name: ${name}\n` +
        `• Mobile: ${phone}\n` +
        `• Location: ${city}\n` +
        `• Monthly Bill: ₹${bill}\n\n` +
        `Please schedule our site visit.`
      );

      showToast('Survey request received! Opening WhatsApp...', 'success');
      setTimeout(() => {
        window.open(`https://wa.me/919699649598?text=${text}`, '_blank');
        const modal = document.getElementById('surveyModal');
        const overlay = document.getElementById('modalOverlay');
        if (modal) modal.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
        modalForm.reset();
      }, 1000);
    });
  }
}

// Toast Notification
function showToast(message, type = 'success') {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'site-toast';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.className = `site-toast show ${type}`;
  setTimeout(() => {
    toast.className = 'site-toast';
  }, 4000);
}

// Animated Numbers on Scroll
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter-val');
  const speed = 120;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace(/[^0-9]/g, '');
        const inc = Math.max(1, Math.ceil(target / speed));

        const updateCount = () => {
          const current = +counter.innerText.replace(/[^0-9]/g, '');
          if (current < target) {
            counter.innerText = (current + inc > target ? target : current + inc) + '+';
            setTimeout(updateCount, 16);
          } else {
            counter.innerText = target + '+';
          }
        };
        updateCount();
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// Scroll Reveal Animations
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => observer.observe(el));
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initModals();
  initFAQs();
  initAppFilter();
  initForms();
  initCounterAnimation();
  initScrollReveal();

  // Initialize Language Switcher Buttons
  const langEnBtns = document.querySelectorAll('.lang-btn-en');
  const langMrBtns = document.querySelectorAll('.lang-btn-mr');

  langEnBtns.forEach(btn => btn.addEventListener('click', () => setLanguage('en')));
  langMrBtns.forEach(btn => btn.addEventListener('click', () => setLanguage('mr')));

  // Apply initial saved language
  setLanguage(currentLang);
});
