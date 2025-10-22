// reCAPTCHA v3 form token fetch & submit handler

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const SITE_KEY = '6LcSnvMrAAAAALvi54ybABIW1DQbC5opqhfeCeO3';
  const form = document.querySelector('.booking-form');
  const tokenInput = document.getElementById('g-recaptcha-response');

  if (!form || !tokenInput) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('.send-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnIcon = btn.querySelector('.btn-icon');
    const btnLoading = btn.querySelector('.btn-loading');

    // Show loading GIF, hide icon
    btnIcon.style.display = 'none';
    btnLoading.style.display = 'inline-block';
    btnText.textContent = 'Sending...';
    btn.disabled = true;

    if (typeof grecaptcha === 'undefined') {
      alert('reCAPTCHA is still loading. Please wait a moment and try again.');
      btnIcon.style.display = '';
      btnLoading.style.display = 'none';
      btnText.textContent = 'Send';
      btn.disabled = false;
      return;
    }

    grecaptcha.ready(function () {
      grecaptcha.execute(SITE_KEY, { action: 'booking_form' })
        .then(function (token) {
          tokenInput.value = token;

          // Submit via AJAX to PHP
          const xhr = new XMLHttpRequest();
          xhr.open('POST', form.action, true);
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr.onload = function () {
            if (xhr.status === 200 || xhr.status === 302) {
              // Success: reload homepage, update button
              btn.classList.add('success');
              btn.style.background = '#28a745';
              btnText.textContent = 'Sent!';
              btnIcon.className = 'fa-solid fa-check btn-icon';
              btnIcon.style.display = 'inline-block';
              btnLoading.style.display = 'none';
              btn.disabled = true;
              setTimeout(function () {
                window.location.href = '/';
              }, 1200);
            } else {
              // Failure: restore button
              btnIcon.style.display = 'inline-block';
              btnIcon.className = 'fa-solid fa-paper-plane btn-icon';
              btnLoading.style.display = 'none';
              btnText.textContent = 'Send';
              btn.disabled = false;
              alert('Submission failed. Please try again.');
            }
          };
          // Serialize form data
          const data = Array.from(form.elements)
            .filter(el => el.name)
            .map(el => encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value))
            .join('&');
          xhr.send(data);
        })
        .catch(function (err) {
          alert('reCAPTCHA failed to generate a token. Please try again.');
          btnIcon.style.display = 'inline-block';
          btnIcon.className = 'fa-solid fa-paper-plane btn-icon';
          btnLoading.style.display = 'none';
          btnText.textContent = 'Send';
          btn.disabled = false;
          console.error('reCAPTCHA error:', err);
        });
    });
  });
});