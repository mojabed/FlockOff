/**
 * Surveillance Footprint Calculator
 *
 * Estimates how many times a person's license plate is scanned based on:
 * - Daily commute miles (round trip)
 * - Trips per week
 * - Area type (urban / suburban / rural)
 *
 * Camera density assumptions (cameras per mile):
 *   Urban:    3.0
 *   Suburban: 1.5
 *   Rural:    0.3
 *
 * Scans per trip = commuteMiles * cameraDensity
 * Scans per day  = scansPerTrip * (tripsPerWeek / 7)
 */
(function () {
  'use strict';

  var CAMERA_DENSITY = {
    urban: 3.0,
    suburban: 1.5,
    rural: 0.3
  };

  var TIERS = [
    { max: 20,  label: 'Low',       cssClass: 'tier--low',    description: 'You drive in areas with relatively few FLOCK cameras. But even "low" surveillance means your movements are logged multiple times every day — and that data is stored, searchable, and shareable without your consent.' },
    { max: 80,  label: 'Medium',    cssClass: 'tier--medium',  description: 'Your plate is being scanned dozens of times every day. Over a year, that\'s thousands of data points mapping your life — where you work, shop, worship, and visit. This is the surveillance level of the average suburban driver.' },
    { max: 200, label: 'High',      cssClass: 'tier--high',    description: 'You are under near-constant surveillance. Every trip you take is logged. Law enforcement can reconstruct your daily movements with precision. This level of tracking would have required a dedicated surveillance team just 20 years ago. Now it\'s fully automated.' },
    { max: Infinity, label: 'TOTAL DRAGNET', cssClass: 'tier--dragnet', description: 'You are living in a surveillance panopticon. Your vehicle is scanned hundreds of times daily. Your entire life — work, home, social life, healthcare, political activity, religious practice — is mapped in databases you cannot access, cannot correct, and cannot opt out of. This is not safety. This is control.' }
  ];

  function getFormData() {
    return {
      commuteMiles: parseFloat(document.getElementById('commuteMiles').value),
      tripsPerWeek: parseInt(document.getElementById('tripsPerWeek').value, 10),
      areaType: document.getElementById('areaType').value
    };
  }

  function showFieldError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var errorEl = field.parentElement.querySelector('.field__error');
    field.classList.add('field__input--invalid');
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldErrors() {
    document.querySelectorAll('.field__input--invalid').forEach(function (el) {
      el.classList.remove('field__input--invalid');
    });
    document.querySelectorAll('.field__error').forEach(function (el) {
      el.textContent = '';
    });
  }

  function validate(data) {
    var valid = true;
    clearFieldErrors();

    if (isNaN(data.commuteMiles) || data.commuteMiles <= 0) {
      showFieldError('commuteMiles', 'Please enter a valid distance greater than 0.');
      valid = false;
    }
    if (data.commuteMiles > 200) {
      showFieldError('commuteMiles', 'Please enter a distance under 200 miles.');
      valid = false;
    }
    if (isNaN(data.tripsPerWeek) || data.tripsPerWeek <= 0) {
      showFieldError('tripsPerWeek', 'Please enter a valid number of trips greater than 0.');
      valid = false;
    }
    if (data.tripsPerWeek > 50) {
      showFieldError('tripsPerWeek', 'Please enter fewer than 50 trips per week.');
      valid = false;
    }
    if (!data.areaType) {
      showFieldError('areaType', 'Please select your area type.');
      valid = false;
    }

    return valid;
  }

  function calculateScans(data) {
    var density = CAMERA_DENSITY[data.areaType];
    var tripsPerDay = data.tripsPerWeek / 7;
    var scansPerDay = Math.round(data.commuteMiles * density * tripsPerDay);
    var scansPerWeek = Math.round(scansPerDay * 7);
    var scansPerYear = Math.round(scansPerDay * 365);

    return {
      daily: scansPerDay,
      weekly: scansPerWeek,
      yearly: scansPerYear
    };
  }

  function getTier(dailyScans) {
    for (var i = 0; i < TIERS.length; i++) {
      if (dailyScans <= TIERS[i].max) {
        return TIERS[i];
      }
    }
    return TIERS[TIERS.length - 1];
  }

  function displayResults(scans, tier) {
    document.getElementById('resultDaily').textContent = scans.daily;
    document.getElementById('resultWeekly').textContent = scans.weekly;
    document.getElementById('resultYearly').textContent = scans.yearly;

    var tierBadge = document.getElementById('tierBadge');
    tierBadge.textContent = tier.label;

    var tierDesc = document.getElementById('tierDescription');
    tierDesc.textContent = tier.description;

    var tierContainer = document.getElementById('resultTier');
    tierContainer.className = 'calculator__tier ' + tier.cssClass;

    var resultsContainer = document.getElementById('calculatorResults');
    resultsContainer.hidden = false;
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
      localStorage.setItem('flockOffCalculatorResult', JSON.stringify({
        scans: scans,
        tierLabel: tier.label,
        tierCssClass: tier.cssClass,
        tierDescription: tier.description
      }));
    } catch (e) {
      // localStorage may not be available
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    var data = getFormData();
    if (!validate(data)) return;

    var scans = calculateScans(data);
    var tier = getTier(scans.daily);
    displayResults(scans, tier);
  }

  function restoreResult() {
    try {
      var saved = localStorage.getItem('flockOffCalculatorResult');
      if (saved) {
        var result = JSON.parse(saved);
        document.getElementById('resultDaily').textContent = result.scans.daily;
        document.getElementById('resultWeekly').textContent = result.scans.weekly;
        document.getElementById('resultYearly').textContent = result.scans.yearly;
        document.getElementById('tierBadge').textContent = result.tierLabel;
        document.getElementById('tierDescription').textContent = result.tierDescription;

        var tierContainer = document.getElementById('resultTier');
        tierContainer.className = 'calculator__tier ' + result.tierCssClass;

        document.getElementById('calculatorResults').hidden = false;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  function init() {
    var form = document.getElementById('calculatorForm');
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }
    restoreResult();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
