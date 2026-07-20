(function () {
  'use strict';

  var animated = false;
  var DEFAULT_COUNT = 60591;

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
      }
    }

    requestAnimationFrame(step);
  }

  function fetchCameraCount(callback) {
    fetch('data/stats.json')
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        var count = parseInt(data.camerasMapped, 10);
        if (isNaN(count) || count <= 0) throw new Error('Invalid count');
        callback(count, data.lastUpdated);
      })
      .catch(function () {
        callback(DEFAULT_COUNT, null);
      });
  }

  function startAnimations(cameraCount, lastUpdated) {
    var mainDigits = document.getElementById('counterDigits');
    if (mainDigits) {
      animateMainCounter(mainDigits, cameraCount, 2000);
    }

    if (lastUpdated) {
      var label = document.querySelector('.counter__label');
      if (label) {
        label.textContent = 'ALPR cameras mapped by the DeFlock community project (updated ' + lastUpdated + ')';
      }
    }

    // Estimated daily reads: cameras × ~2,500 vehicles/day
    var dailyEstimate = Math.round(cameraCount * 2500);
    var dailyReadsEl = document.querySelector('.counter-stat__number[data-target="150000000"]');
    if (dailyReadsEl) {
      dailyReadsEl.setAttribute('data-target', dailyEstimate);
      animateNumber(dailyReadsEl, dailyEstimate, 2500);
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

  function initCounter() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          fetchCameraCount(startAnimations);
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
