// reCAPTCHA v3 form token fetch & submit handler
(function () {
  'use strict';

  const SITE_KEY = '6LcSnvMrAAAAALvi54ybABIW1DQbC5opqhfeCeO3';
  const form = document.querySelector('.booking-form');
  const tokenInput = document.getElementById('g-recaptcha-response');

  if (!form || !tokenInput) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (typeof grecaptcha === 'undefined' || !grecaptcha.ready) {
      alert('reCAPTCHA not available. Please try again in a moment.');
      return;
    }

    grecaptcha.ready(function () {
      grecaptcha.execute(SITE_KEY, { action: 'booking_form' }).then(function (token) {
        tokenInput.value = token;
        form.submit();
      }).catch(function (err) {
        alert('reCAPTCHA failed to generate a token. Please try again.');
        console.error('reCAPTCHA error:', err);
      });

      // Fallback timeout: if token not set within 5s, show message
      setTimeout(function () {
        if (!tokenInput.value) {
          alert('reCAPTCHA timed out. Please try again.');
        }
      }, 5000);
    });
  });
})();