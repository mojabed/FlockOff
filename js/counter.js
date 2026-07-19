(function () {
  'use strict';

  var animated = false;
  var ongoingInterval = null;

  function formatNumber(num) {
    return num.toLocaleString('en-US');
  }

  function animateNumber(el, target, duration) {
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - (1 - progress) * (1 - progress);
      var current = Math.floor(eased * target);

      el.textContent = formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target);
      }
    }

    requestAnimationFrame(step);
  }

  function animateMainCounter(el, target, duration) {
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - (1 - progress) * (1 - progress);
      var current = Math.floor(eased * target);

      el.textContent = formatNumber(current) + '+';

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target) + '+';
        startOngoingEffect(el, target);
      }
    }

    requestAnimationFrame(step);
  }

  function startOngoingEffect(el, base) {
    if (ongoingInterval) clearInterval(ongoingInterval);
    ongoingInterval = setInterval(function () {
      base += Math.floor(Math.random() * 3) + 1;
      el.textContent = formatNumber(base) + '+';
    }, 5000);
  }

  function initCounter() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;

          var mainDigits = document.getElementById('counterDigits');
          if (mainDigits) {
            animateMainCounter(mainDigits, 60591, 2000);
          }

          var dailyReadsEl = document.querySelector('.counter-stat__number[data-target="150000000"]');
          if (dailyReadsEl) {
            animateNumber(dailyReadsEl, 150000000, 2500);
          }

          var agenciesEl = document.querySelector('.counter-stat__number[data-target="4800"]');
          if (agenciesEl) {
            animateNumber(agenciesEl, 4800, 1800);
          }

          var retentionEl = document.querySelector('.counter-stat__number[data-target="30"]');
          if (retentionEl) {
            animateNumber(retentionEl, 30, 1000);
          }
        }
      });
    }, { threshold: 0.3 });

    var counterSection = document.getElementById('liveCounter');
    if (counterSection) {
      observer.observe(counterSection);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounter);
  } else {
    initCounter();
  }
})();
