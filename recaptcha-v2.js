// reCAPTCHA v3 form token fetch & submit handler

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const SITE_KEY = '6LcSnvMrAAAAALvi54ybABIW1DQbC5opqhfeCeO3';
  const form = document.querySelector('.booking-form');
  const tokenInput = document.getElementById('g-recaptcha-response');

  if (!form || !tokenInput) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (typeof grecaptcha === 'undefined') {
      alert('reCAPTCHA is still loading. Please wait a moment and try again.');
      return;
    }

    grecaptcha.ready(function () {
      grecaptcha.execute(SITE_KEY, { action: 'booking_form' })
        .then(function (token) {
          tokenInput.value = token;
          form.submit();
        })
        .catch(function (err) {
          alert('reCAPTCHA failed to generate a token. Please try again.');
          console.error('reCAPTCHA error:', err);
        });
    });
  });
});