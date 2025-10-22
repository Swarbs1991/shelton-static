// reCAPTCHA v3 form token fetch & submit handler
(function () {
  'use strict';

  // Load site key from server file. The server must expose this file over HTTP (e.g. via your server config).
  let SITE_KEY = null;
  (function fetchSiteKey() {
    fetch('/etc/shelton/G-reCAPTCHA-key', { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch reCAPTCHA key: ' + res.status);
        return res.text();
      })
      .then(text => { SITE_KEY = text.trim(); })
      .catch(err => { console.error('Could not load reCAPTCHA site key:', err); });
  })();
  const form = document.querySelector('.booking-form');
  const tokenInput = document.getElementById('g-recaptcha-response');

  if (!form || !tokenInput) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (typeof grecaptcha === 'undefined' || !grecaptcha.ready) {
      // grecaptcha not loaded yet — fallback after short delay
      setTimeout(() => {
        if (typeof grecaptcha !== 'undefined' && grecaptcha.ready) {
          executeAndSubmit();
        } else {
          alert('reCAPTCHA not available. Please try again in a moment.');
        }
      }, 500);
      return;
    }

    executeAndSubmit();

    // Fallback timeout: if token not set within 5s, show message
    setTimeout(function () {
      if (!tokenInput.value) {
        alert('reCAPTCHA timed out. Please try again.');
      }
    }, 5000);
  });

  function executeAndSubmit() {
    grecaptcha.ready(function () {
      grecaptcha.execute(SITE_KEY, { action: 'booking_form' }).then(function (token) {
        tokenInput.value = token;
        form.submit();
      });
    });
  }
})();