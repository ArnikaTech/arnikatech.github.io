// ==================== COMPLETE JAVASCRIPT ====================
// Save as: static/js/main.js

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    initHeader();
    initSmoothScroll();
    initHeroParticles();
    initTypewriter();
    initAllSwipers();
    initMobileBottomNav();
    initOffcanvasClose();
    initFAQ();
    initToast();
    initTerminalAgent();
  });

  /* ========== AOS Animation ========== */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-out-cubic',
        once: true,
        offset: 20,
        disable: 'mobile'
      });
    }
  }

  /* ========== Header Scroll Effect ========== */
  function initHeader() {
    const navbar = document.querySelector('.glass-navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.pageYOffset > 50);
      });
    });
  }

  /* ========== Smooth Scroll ========== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id === '#' || id === '#!') return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const offset = 180;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({
            top,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ========== Hero Particles ========== */
  function initHeroParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      p.classList.add('hero-particle', 'dynamic');
      const size = Math.random() * 5 + 2;
      p.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*90}%;left:${Math.random()*90}%;animation-delay:${Math.random()*8}s;animation-duration:${Math.random()*6+5}s`;
      if (Math.random() > 0.5) {
        p.style.background = 'rgba(245,158,11,0.45)';
        p.style.boxShadow = '0 0 8px rgba(245,158,11,0.5)';
      }
      container.appendChild(p);
    }
  }

  /* ========== Typewriter Effect ========== */
  function initTypewriter() {
    const el = document.querySelector('.typewriter-text');
    if (!el) return;
    el.style.cssText = 'display:inline-block;min-width:180px;min-height:28px;height:28px;line-height:28px;overflow:hidden';
    const words = [
      'توسعه سامانه‌های تحت وب',
      'راهکارهای مبتنی بر هوش مصنوعی',
      'زیرساخت‌های مدرن و فناوری‌های هوشمند',
    ];
    let wi = 0,
      ci = 0,
      del = false;
    el.textContent = words[0].charAt(0);

    function type() {
      const word = words[wi];
      if (del) ci--;
      else ci++;
      el.textContent = word.substring(0, ci);
      let speed = del ? 35 : 70;
      if (!del && ci === word.length) {
        speed = 1800;
        del = true;
      } else if (del && ci === 0) {
        del = false;
        wi = (wi + 1) % words.length;
        speed = 250;
      }
      setTimeout(type, speed);
    }
    setTimeout(type, 500);
  }

  /* ========== Swiper Initializations ========== */
  function initAllSwipers() {
    if (typeof Swiper === 'undefined') return;
    initPortfolioSwiper();
    initTestimonialsSwiper();
  }

  function initPortfolioSwiper() {
    const el = document.querySelector('.portfolio-swiper');
    if (!el) return;
    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      speed: 600,
      navigation: {
        nextEl: '.portfolio-button-prev',
        prevEl: '.portfolio-button-next',
      },
      pagination: {
        el: '.portfolio-pagination',
        clickable: true
      },
      breakpoints: {
        640: {
          slidesPerView: 1
        },
        768: {
          slidesPerView: 2
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24
        }
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      }
    });
  }

  function initTestimonialsSwiper() {
    const el = document.querySelector('.testimonials-swiper');
    if (!el) return;
    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      speed: 500,
      centeredSlides: true,
      grabCursor: true,
      pagination: {
        el: '.testimonials-pagination',
        clickable: true
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          centeredSlides: true
        },
        768: {
          slidesPerView: 2,
          centeredSlides: false
        },
        1024: {
          slidesPerView: 3,
          centeredSlides: true
        }
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      watchSlidesProgress: true
    });
  }

  /* ========== Mobile Bottom Navigation ========== */
  function initMobileBottomNav() {
    const nav = document.querySelector('.mobile-bottom-nav');
    if (!nav) return;
    const items = nav.querySelectorAll('.mobile-nav-item');
    items.forEach(item => {
      item.addEventListener('click', function () {
        items.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  /* ========== Offcanvas Close on Link Click ========== */
  function initOffcanvasClose() {
    const offcanvas = document.getElementById('mobileMenu');
    if (!offcanvas) return;
    offcanvas.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
        if (bsOffcanvas) bsOffcanvas.hide();
      }
    });
  }

  /* ========== FAQ Accordion ========== */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  /* ========== Toast Auto-Dismiss ========== */
  function initToast() {
    const toastEls = document.querySelectorAll('.custom-toast');
    toastEls.forEach(function (el) {
      setTimeout(function () {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px) scale(0.95)';
        el.style.transition = 'all 0.4s ease';
        setTimeout(function () {
          el.remove();
        }, 800);
      }, 4500);
    });
  }

  /* ========== TERMINAL AGENT - آرامیس ========== */
  function initTerminalAgent() {
    const chatWindow = document.getElementById('terminalChatWindow');
    if (!chatWindow) return;

    const MAX_VISIBLE_MESSAGES = 6;
    const TYPING_SPEED = 100;
    const THINKING_DURATION = 1800;
    const USER_PAUSE = 1200;
    const CYCLE_PAUSE = 4500;

    let typingTimer = null;
    let isTyping = false;
    let isRunning = false;
    let usedScenarios = [];

    const scenarios = [{
        name: 'daily-assistant',
        messages: [{
            from: 'ai',
            text: 'سلام. امروز چطور میتونم کمکت کنم؟'
          },
          {
            from: 'user',
            text: 'هوا امروز چطوره؟'
          },
          {
            from: 'ai',
            text: 'امروز آفتابی با بیشینه ۲۸ درجه. بعدازظهر کمی ابری میشه.'
          },
          {
            from: 'user',
            text: 'برنامه امروز من چیه؟'
          },
          {
            from: 'ai',
            text: 'ساعت ۱۰ جلسه، ۱۴ ملاقات، عصر باشگاه. یادآوری کنم؟'
          }
        ]
      },
      {
        name: 'smart-living',
        messages: [{
            from: 'ai',
            text: 'سلام. خونه آماده است. دما ۲۲ درجه، سیستم‌ها فعال.'
          },
          {
            from: 'user',
            text: 'چراغ‌های پذیرایی رو کم کن.'
          },
          {
            from: 'ai',
            text: 'انجام شد. نور روی ۳۰٪ تنظیم شد.'
          },
          {
            from: 'user',
            text: 'قهوه‌ساز رو روشن کن.'
          },
          {
            from: 'ai',
            text: 'قهوه‌ساز روشن شد. ۴ دقیقه دیگه آماده است.'
          }
        ]
      },
      {
        name: 'work-assistant',
        messages: [{
            from: 'ai',
            text: 'صبح بخیر. ۳ جلسه امروز دارید.'
          },
          {
            from: 'user',
            text: 'گزارش این هفته رو بده.'
          },
          {
            from: 'ai',
            text: 'این هفته ۸ کار انجام شده، ۲ تا در حال انجام.'
          },
          {
            from: 'user',
            text: 'برای فردا جلسه بذار.'
          },
          {
            from: 'ai',
            text: 'چه ساعتی؟ ۱۰ صبح یا ۲ بعدازظهر آزاده.'
          }
        ]
      },
      {
        name: 'health-tracker',
        messages: [{
            from: 'ai',
            text: 'سلام. امروز ۷,۵۰۰ قدم راه رفتید.'
          },
          {
            from: 'user',
            text: 'چقدر آب نوشیدم؟'
          },
          {
            from: 'ai',
            text: '۵ لیوان. ۳ لیوان دیگه تا هدف روزانه مونده.'
          },
          {
            from: 'user',
            text: 'برنامه ورزش امروز رو بگو.'
          },
          {
            from: 'ai',
            text: '۳۰ دقیقه پیاده‌روی. ساعت ۶ عصر.'
          }
        ]
      },
      {
        name: 'travel-planner',
        messages: [{
            from: 'ai',
            text: 'سفر هفته بعد رو یادآوری کنم؟'
          },
          {
            from: 'user',
            text: 'بله، پرواز چه ساعتیه؟'
          },
          {
            from: 'ai',
            text: 'پرواز ساعت ۸ صبح. ۲ ساعت قبل فرودگاه باشید.'
          },
          {
            from: 'user',
            text: 'هتل رو چک کن.'
          },
          {
            from: 'ai',
            text: 'هتل تأیید شده. اتاق از ساعت ۲ بعدازظهر آماده است.'
          }
        ]
      },
      {
        name: 'shopping-helper',
        messages: [{
            from: 'ai',
            text: 'لیست خرید این هفته رو آماده کردم.'
          },
          {
            from: 'user',
            text: 'چی لازم داریم؟'
          },
          {
            from: 'ai',
            text: 'شیر، نون، میوه. ۳ قلم دیگه هم موجودی کم شده.'
          },
          {
            from: 'user',
            text: 'از فروشگاه نزدیک سفارش بده.'
          },
          {
            from: 'ai',
            text: 'سفارش ثبت شد. تا ۱ ساعت دیگه میرسه.'
          }
        ]
      },
      {
        name: 'entertainment',
        messages: [{
            from: 'ai',
            text: 'امشب فیلم جدیدی اومده.'
          },
          {
            from: 'user',
            text: 'چه فیلمی؟'
          },
          {
            from: 'ai',
            text: 'فیلم علمی تخیلی جدید. امتیاز ۸.۵ از ۱۰.'
          },
          {
            from: 'user',
            text: 'بلیط رزرو کن.'
          },
          {
            from: 'ai',
            text: 'ساعت ۷ یا ۹؟ کدوم بهتره؟'
          }
        ]
      },
      {
        name: 'learning-companion',
        messages: [{
            from: 'ai',
            text: 'امروز ۲۰ دقیقه مطالعه کردید.'
          },
          {
            from: 'user',
            text: 'کتاب جدید پیشنهاد بده.'
          },
          {
            from: 'ai',
            text: 'کتاب "تفکر سریع و کند" رو پیشنهاد میدم.'
          },
          {
            from: 'user',
            text: 'خلاصه فصل قبل رو بگو.'
          },
          {
            from: 'ai',
            text: 'فصل ۳ درباره تصمیم‌گیری و خطاهای شناختی بود.'
          }
        ]
      },
      {
        name: 'home-security',
        messages: [{
            from: 'ai',
            text: 'سیستم امنیتی فعال. همه درب‌ها قفل.'
          },
          {
            from: 'user',
            text: 'دوربین ورودی رو نشون بده.'
          },
          {
            from: 'ai',
            text: 'ورودی آرومه. کسی نزدیک در نیست.'
          },
          {
            from: 'user',
            text: 'اگه حرکتی دیدی خبر بده.'
          },
          {
            from: 'ai',
            text: 'چشم. به محض تشخیص حرکت اطلاع میدم.'
          }
        ]
      },
      {
        name: 'weather-advisor',
        messages: [{
            from: 'ai',
            text: 'هفته آینده بارونیه. چتر یادت نره.'
          },
          {
            from: 'user',
            text: 'دما چطوره؟'
          },
          {
            from: 'ai',
            text: 'بین ۱۵ تا ۲۲ درجه. صبح‌ها خنکه.'
          },
          {
            from: 'user',
            text: 'کی بارون قطع میشه؟'
          },
          {
            from: 'ai',
            text: 'سه‌شنبه بعدازظهر آفتابی میشه.'
          }
        ]
      }
    ];

    function getRandomScenario() {
      if (usedScenarios.length >= scenarios.length) {
        usedScenarios = [];
      }

      const available = scenarios.filter(function (_, index) {
        return !usedScenarios.includes(index);
      });

      const randomIndex = Math.floor(Math.random() * available.length);
      const originalIndex = scenarios.indexOf(available[randomIndex]);

      usedScenarios.push(originalIndex);
      return available[randomIndex];
    }

    function stopAll() {
      isRunning = false;
      if (typingTimer) {
        clearTimeout(typingTimer);
        typingTimer = null;
      }
      isTyping = false;
    }

    function createMessageElement(from, text, isPlaceholder) {
      isPlaceholder = isPlaceholder || false;

      const row = document.createElement('div');
      row.className = 'msg-row ' + (from === 'user' ? 'user-row' : 'ai-row');

      const bubble = document.createElement('div');
      bubble.className = 'bubble ' + (from === 'user' ? 'user-bubble' : 'ai-bubble');

      if (isPlaceholder) {
        bubble.innerHTML = '<i class="bi bi-cpu-fill bubble-icon"></i>' +
          '<div class="bubble-content">' +
          '<div class="typing-dots">' +
          '<span class="dot"></span>' +
          '<span class="dot"></span>' +
          '<span class="dot"></span>' +
          '</div>' +
          '<span class="thinking-text">در حال پردازش...</span>' +
          '</div>';
      } else {
        const icon = from === 'ai' ? 'bi-robot' : 'bi-person-check';
        bubble.innerHTML = '<i class="bi ' + icon + ' bubble-icon"></i>' +
          '<span class="bubble-text"></span>';
        bubble.querySelector('.bubble-text').textContent = text;
      }

      row.appendChild(bubble);
      chatWindow.appendChild(row);
      return {
        row: row,
        bubble: bubble
      };
    }

    function removeOldMessages() {
      if (isTyping) return;

      const children = Array.from(chatWindow.children);
      if (children.length <= MAX_VISIBLE_MESSAGES) return;

      const toRemove = children.slice(0, children.length - MAX_VISIBLE_MESSAGES);

      toRemove.forEach(function (child) {
        if (child.parentNode) {
          child.classList.add('removing');
          setTimeout(function () {
            if (child.parentNode) {
              child.parentNode.removeChild(child);
            }
          }, 400);
        }
      });
    }

    function scrollToBottom() {
      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    }

    function typewriterEffect(element, text) {
      isTyping = true;
      element.textContent = '';
      element.classList.add('cursor-blink');

      return new Promise(function (resolve) {
        let index = 0;

        function typeChar() {
          if (!isRunning) {
            isTyping = false;
            element.classList.remove('cursor-blink');
            resolve();
            return;
          }

          if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            scrollToBottom();
            typingTimer = setTimeout(typeChar, TYPING_SPEED);
          } else {
            element.classList.remove('cursor-blink');
            isTyping = false;
            typingTimer = null;
            resolve();
          }
        }

        typeChar();
      });
    }

    async function showAIResponse(text) {
      if (!isRunning) return;

      const thinking = createMessageElement('ai', '', true);
      scrollToBottom();
      removeOldMessages();

      await new Promise(function (resolve) {
        setTimeout(resolve, THINKING_DURATION);
      });

      if (!isRunning) return;

      if (thinking.row.parentNode) {
        thinking.row.classList.add('removing');
        setTimeout(function () {
          if (thinking.row.parentNode) {
            thinking.row.parentNode.removeChild(thinking.row);
          }
        }, 350);
      }

      await new Promise(function (resolve) {
        setTimeout(resolve, 200);
      });

      if (!isRunning) return;

      const aiMsg = createMessageElement('ai', '');
      scrollToBottom();

      const textElement = aiMsg.bubble.querySelector('.bubble-text');
      await typewriterEffect(textElement, text);

      if (isRunning) {
        removeOldMessages();
        scrollToBottom();
      }
    }

    async function showUserMessage(text) {
      if (!isRunning) return;

      createMessageElement('user', text);
      scrollToBottom();
      removeOldMessages();

      await new Promise(function (resolve) {
        setTimeout(resolve, USER_PAUSE);
      });
    }

    async function playConversation(scenarioMessages) {
      for (let i = 0; i < scenarioMessages.length; i++) {
        if (!isRunning) return;

        const msg = scenarioMessages[i];

        if (msg.from === 'ai') {
          await showAIResponse(msg.text);
        } else {
          await showUserMessage(msg.text);
        }
      }
    }

    async function infiniteLoop() {
      while (isRunning) {
        const scenario = getRandomScenario();
        await playConversation(scenario.messages);

        if (!isRunning) return;

        await new Promise(function (resolve) {
          setTimeout(resolve, CYCLE_PAUSE);
        });

        if (!isRunning) return;

        const allMessages = Array.from(chatWindow.children);
        allMessages.forEach(function (msg) {
          msg.classList.add('removing');
        });

        await new Promise(function (resolve) {
          setTimeout(resolve, 500);
        });

        chatWindow.innerHTML = '';

        await new Promise(function (resolve) {
          setTimeout(resolve, 500);
        });
      }
    }

    function startAgent() {
      stopAll();
      chatWindow.innerHTML = '';
      usedScenarios = [];

      isRunning = true;
      infiniteLoop().catch(function (error) {
        console.error('Terminal agent error:', error);
        isRunning = false;
      });
    }

    startAgent();

    window.addEventListener('beforeunload', function () {
      stopAll();
    });
  }

})();