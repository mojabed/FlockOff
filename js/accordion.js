(function () {
  'use strict';

  function initAccordion(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var triggers = container.querySelectorAll('.accordion__trigger');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        var panel = trigger.nextElementSibling;

        triggers.forEach(function (otherTrigger) {
          var otherPanel = otherTrigger.nextElementSibling;
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherPanel.setAttribute('hidden', '');
        });

        if (!isExpanded) {
          trigger.setAttribute('aria-expanded', 'true');
          panel.removeAttribute('hidden');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAccordion('dangersAccordion');
    });
  } else {
    initAccordion('dangersAccordion');
  }
})();
