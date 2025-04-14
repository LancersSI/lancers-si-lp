/**
 * TechInnovate - AI業務効率化・システムインテグレーションソリューション
 * 統合JavaScriptファイル
 */

// ===== UTILITY FUNCTIONS =====
function toggleVisibility(element, isVisible) {
  if (!element) return;
  element.style.display = isVisible ? '' : 'none';
}

function scrollToElement(target, offset = 0) {
  let targetElement = typeof target === 'string' ? document.querySelector(target) : target;
  if (!targetElement) return;

  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const CookieUtil = {
  setCookie(name, value, days = 30) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Strict`;
  },

  getCookie(name) {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  },

  deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict`;
  }
};

// ===== ANIMATION FUNCTIONS =====
function addAnimationClasses() {
  const heroContent = document.querySelector('.hero-content');
  const heroImage = document.querySelector('.hero-image');

  if (heroContent) heroContent.classList.add('fade-in');
  if (heroImage) heroImage.classList.add('slide-in', 'slide-in-right');

  const problemCards = document.querySelectorAll('.problem-card');
  problemCards.forEach((card, index) => {
    card.classList.add('fade-in');
    card.style.animationDelay = `${0.1 * index}s`;
  });

  const overviewText = document.querySelector('.overview-text');
  const overviewImage = document.querySelector('.overview-image');
  const featureItems = document.querySelectorAll('.feature-item');

  if (overviewText) overviewText.classList.add('fade-in');
  if (overviewImage) overviewImage.classList.add('slide-in', 'slide-in-right');

  featureItems.forEach((item, index) => {
    item.classList.add('slide-in', 'slide-in-left');
    item.style.animationDelay = `${0.1 * index}s`;
  });

  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.classList.add('fade-in');
    card.style.animationDelay = `${0.1 * index}s`;
  });

  const strengthItems = document.querySelectorAll('.strength-item');
  strengthItems.forEach((item, index) => {
    item.classList.add('slide-in', 'slide-in-left');
    item.style.animationDelay = `${0.1 * index}s`;
  });

  const caseCards = document.querySelectorAll('.case-card');
  caseCards.forEach((card, index) => {
    card.classList.add('fade-in');
    card.style.animationDelay = `${0.1 * index}s`;
  });

  const contactCta = document.querySelector('.contact-cta');
  if (contactCta) contactCta.classList.add('fade-in');
}

function initAdvancedScrollAnimation() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .zoom-in');

  if (animatedElements.length === 0 || !('IntersectionObserver' in window)) {
    animatedElements.forEach(element => element.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px', threshold: 0.1 }
  );

  animatedElements.forEach(element => observer.observe(element));
}

// ===== CAROUSEL FUNCTIONS =====
function initCaseCarousel() {
  const casesGrid = document.querySelector('.cases-grid');
  if (!casesGrid) return;

  const caseCards = casesGrid.querySelectorAll('.case-card');
  if (caseCards.length <= 1) return;

  function setupCarousel() {
    if (window.innerWidth <= 768) {
      if (!casesGrid.classList.contains('carousel')) {
        casesGrid.classList.add('carousel');
        createCarouselNavigation();
        caseCards[0].classList.add('active');
      }
    } else {
      if (casesGrid.classList.contains('carousel')) {
        casesGrid.classList.remove('carousel');
        const navigation = document.querySelector('.carousel-navigation');
        if (navigation) navigation.remove();
        caseCards.forEach(card => card.classList.remove('active'));
      }
    }
  }

  function createCarouselNavigation() {
    const existingNavigation = document.querySelector('.carousel-navigation');
    if (existingNavigation) existingNavigation.remove();

    const navigation = document.createElement('div');
    navigation.className = 'carousel-navigation';

    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.setAttribute('aria-label', '前の事例');

    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.setAttribute('aria-label', '次の事例');

    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';

    for (let i = 0; i < caseCards.length; i++) {
      const indicator = document.createElement('button');
      indicator.className = 'carousel-indicator';
      indicator.setAttribute('aria-label', `事例 ${i + 1}`);
      if (i === 0) indicator.classList.add('active');

      indicator.addEventListener('click', () => goToSlide(i));
      indicators.appendChild(indicator);
    }

    navigation.appendChild(prevButton);
    navigation.appendChild(indicators);
    navigation.appendChild(nextButton);

    casesGrid.parentNode.insertBefore(navigation, casesGrid.nextSibling);

    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
  }

  function prevSlide() {
    const activeCard = casesGrid.querySelector('.case-card.active');
    let index = Array.from(caseCards).indexOf(activeCard);
    index = (index - 1 + caseCards.length) % caseCards.length;
    goToSlide(index);
  }

  function nextSlide() {
    const activeCard = casesGrid.querySelector('.case-card.active');
    let index = Array.from(caseCards).indexOf(activeCard);
    index = (index + 1) % caseCards.length;
    goToSlide(index);
  }

  function goToSlide(index) {
    caseCards.forEach(card => card.classList.remove('active'));

    const indicators = document.querySelectorAll('.carousel-indicator');
    indicators.forEach(indicator => indicator.classList.remove('active'));

    caseCards[index].classList.add('active');
    indicators[index].classList.add('active');
  }

  setupCarousel();
  window.addEventListener('resize', setupCarousel);

  let touchStartX = 0;
  let touchEndX = 0;

  casesGrid.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  casesGrid.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
    }
  }
}

// ===== MAIN FUNCTIONALITY =====
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');

  if (!menuToggle || !navList) return;

  menuToggle.addEventListener('click', function () {
    menuToggle.classList.toggle('active');
    navList.classList.toggle('active');

    const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !expanded);
    navList.setAttribute('aria-hidden', expanded);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      menuToggle.classList.remove('active');
      navList.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      navList.setAttribute('aria-hidden', 'true');
    }
  });
}

function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const menuToggle = document.querySelector('.menu-toggle');
      const navList = document.querySelector('.nav-list');
      if (menuToggle && navList && menuToggle.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        navList.setAttribute('aria-hidden', 'true');
      }

      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

function initScrollAnimation() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .zoom-in');
  if (animatedElements.length === 0) return;

  function checkIfInView() {
    animatedElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 50 && elementBottom > 0) {
        element.classList.add('animated');
      }
    });
  }

  checkIfInView();
  window.addEventListener('scroll', checkIfInView);
}

function initContactButtonEffect() {
  const contactBtn = document.querySelector('.contact-btn');
  if (!contactBtn) return;

  contactBtn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.classList.add('btn-ripple');
    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 700);
  });
}

function addAccessibilityAttributes() {
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.setAttribute('aria-label', 'メニューを開く');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'nav-list');
  }

  const navList = document.querySelector('.nav-list');
  if (navList) {
    navList.setAttribute('id', 'nav-list');
    navList.setAttribute('aria-hidden', 'true');
    navList.setAttribute('role', 'menu');
  }

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => link.setAttribute('role', 'menuitem'));

  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.setAttribute('aria-label', 'お問い合わせフォーム');

    const requiredLabels = contactForm.querySelectorAll('label[for]');
    requiredLabels.forEach(label => {
      const input = document.getElementById(label.getAttribute('for'));
      if (input && input.hasAttribute('required')) {
        label.setAttribute('aria-required', 'true');
      }
    });
  }
}

function measurePerformance() {
  if (!window.performance || !window.performance.timing) return;

  const timing = window.performance.timing;
  const domContentLoadedTime = timing.domContentLoadedEventEnd - timing.navigationStart;

  console.log(`DOM Content Loaded: ${domContentLoadedTime}ms`);

  window.addEventListener('load', () => {
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`Page Load Complete: ${loadTime}ms`);
  });
}

// ===== ADDITIONAL FUNCTIONS =====
function sendHeight() {
  // html要素の高さをscroll分を含めて取得
  const height = document.body.scrollHeight;
  // iframe側に高さを送信
  window.parent.postMessage({ iframeHeight: height }, "*");

  // DOMが読み込まれる、もしくはリサイズされた際、高さを送信
  window.addEventListener("load", sendHeight);
  window.addEventListener("resize", sendHeight);
  // 高さ変動に備え定期送信も可
  // setInterval(sendHeight, 1000);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
  console.log('TechInnovate Website - Initialized');

  initMobileMenu();
  initSmoothScroll();
  initScrollAnimation();
  initContactButtonEffect();
  addAnimationClasses();
  initAdvancedScrollAnimation();
  initCaseCarousel();
  addAccessibilityAttributes();
  measurePerformance();
  sendHeight();
});