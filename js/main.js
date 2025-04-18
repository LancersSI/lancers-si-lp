/**
 * TechInnovate - AI業務効率化・システムインテグレーションソリューション
 * 統合JavaScriptファイル
 */

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
  const menuToggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-list');

  if (!menuToggle || !navList) {
    console.error('メニュー要素が見つかりません');
    return;
  }

  // アクセシビリティ属性を追加
  menuToggle.setAttribute('aria-controls', 'nav-list');
  menuToggle.setAttribute('aria-expanded', 'false');
  navList.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-label', 'メニュー');

  // クリックイベントを追加
  menuToggle.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    
    menuToggle.classList.toggle('active');
    navList.classList.toggle('active');

    const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !expanded);
    navList.setAttribute('aria-hidden', expanded);
    
    // スクロールを制御
    if (!expanded) {
      document.body.style.overflow = 'hidden'; // メニューが開いているときはスクロールを無効に
    } else {
      document.body.style.overflow = ''; // メニューが閉じたらスクロールを有効に
    }
    
    console.log('メニュートグル状態:', menuToggle.classList.contains('active'));
  });

  // ナビゲーションリンクをクリックしたらメニューを閉じる
  const navLinks = navList.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      navList.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      navList.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // スクロールを有効に戻す
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      menuToggle.classList.remove('active');
      navList.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      navList.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // スクロールを有効に戻す
    }
  });
  
  // デバッグ用
  console.log('モバイルメニュー初期化完了');
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

// ===== IFRAME FUNCTIONS =====
let lastHeight = 0;
function sendHeight() {
  // html要素の高さをscroll分を含めて取得
  const currentHeight = document.body.scrollHeight;
  if (currentHeight !== lastHeight) {
    // iframe側に高さを送信
    window.parent.postMessage({ iframeHeight: height }, "*");
    lastHeight = currentHeight;
  }
  // DOMが読み込まれる、もしくはリサイズされた際、高さを送信
  window.addEventListener("load", sendHeight);
  window.addEventListener("resize", sendHeight);
  setInterval(sendHeight, 1000);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // モバイルメニューの初期化
  initMobileMenu();
  
  // スムーススクロールの初期化
  initSmoothScroll();
  
  // ケースカルーセルの初期化（もし存在すれば）
  initCaseCarousel();
  
  // アニメーション関連の初期化
  addAnimationClasses();
  initAdvancedScrollAnimation();
  
  // アクセシビリティ属性の追加
  addAccessibilityAttributes();
  
  // 高さを送信
  sendHeight();
});