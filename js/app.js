(function () {
  'use strict';

  function initNavigation() {
    var nav = document.getElementById('nav');
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    var navLinkEls = document.querySelectorAll('.nav__link');
    var sections = [];

    // Build section list
    navLinkEls.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        var el = document.querySelector(href);
        if (el) sections.push({ link: link, section: el, id: href.substring(1) });
      }
    });

    // Mobile toggle
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.contains('nav__links--open');
        if (isOpen) {
          navLinks.classList.remove('nav__links--open');
          navToggle.setAttribute('aria-expanded', 'false');
        } else {
          navLinks.classList.add('nav__links--open');
          navToggle.setAttribute('aria-expanded', 'true');
        }
      });

      // Close mobile nav when a link is clicked
      navLinks.addEventListener('click', function (e) {
        if (e.target.classList.contains('nav__link')) {
          navLinks.classList.remove('nav__links--open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    var observerOptions = {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var activeId = entry.target.id;
          navLinkEls.forEach(function (link) {
            var linkId = link.getAttribute('data-nav');
            if (linkId === activeId) {
              link.classList.add('nav__link--active');
            } else {
              link.classList.remove('nav__link--active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(function (item) {
      observer.observe(item.section);
    });
  }

  function initCards() {
    var cards = document.querySelectorAll('.card');

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        card.classList.toggle('is-flipped');
      });

      // Allow keyboard interaction
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-pressed', 'false');

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('is-flipped');
          card.setAttribute('aria-pressed',
            card.classList.contains('is-flipped') ? 'true' : 'false');
        }
      });
    });
  }

  function initRevealAnimations() {
    var revealElements = document.querySelectorAll(
      '.cards, .calculator, .accordion__item, .action-card, .counter-stat'
    );

    revealElements.forEach(function (el) {
      el.classList.add('reveal');
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  function init() {
    initNavigation();
    initCards();
    initRevealAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
