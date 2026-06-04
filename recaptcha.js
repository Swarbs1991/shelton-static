// reCAPTCHA v2 (checkbox) client handler

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const form = document.querySelector('.booking-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('.send-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnIcon = btn.querySelector('.btn-icon');
    const btnLoading = btn.querySelector('.btn-loading');

    // Show loading GIF, hide icon
    if (btnIcon) btnIcon.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline-block';
    if (btnText) btnText.textContent = 'Sending...';
    btn.disabled = true;

    if (typeof grecaptcha === 'undefined' || typeof grecaptcha.getResponse !== 'function') {
      alert('reCAPTCHA is still loading. Please wait a moment and try again.');
      if (btnIcon) btnIcon.style.display = '';
      if (btnLoading) btnLoading.style.display = 'none';
      if (btnText) btnText.textContent = 'Send';
      btn.disabled = false;
      return;
    }

    // For v2 checkbox, the widget injects a textarea named 'g-recaptcha-response'
    const token = grecaptcha.getResponse();
    if (!token) {
      alert('Please complete the reCAPTCHA checkbox.');
      if (btnIcon) btnIcon.style.display = '';
      if (btnLoading) btnLoading.style.display = 'none';
      if (btnText) btnText.textContent = 'Send';
      btn.disabled = false;
      return;
    }

    // Submit via AJAX to PHP
    const xhr = new XMLHttpRequest();
    xhr.open('POST', form.action, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
      if (xhr.status === 200 || xhr.status === 302) {
        // Success: reload homepage, update button
        btn.classList.add('success');
        btn.style.background = '#28a745';
        if (btnText) btnText.textContent = 'Sent!';
        if (btnIcon) {
          btnIcon.className = 'fa-solid fa-check btn-icon';
          btnIcon.style.display = 'inline-block';
        }
        if (btnLoading) btnLoading.style.display = 'none';
        btn.disabled = true;
        setTimeout(function () {
          window.location.href = '/';
        }, 1200);
      } else {
        // Failure: restore button
        if (btnIcon) {
          btnIcon.style.display = 'inline-block';
          btnIcon.className = 'fa-solid fa-paper-plane btn-icon';
        }
        if (btnLoading) btnLoading.style.display = 'none';
        if (btnText) btnText.textContent = 'Send';
        btn.disabled = false;
        alert('Submission failed. Please try again.');
      }
    };

    // Serialize form data (includes the g-recaptcha-response injected by the widget)
    const data = Array.from(form.elements)
      .filter(el => el.name)
      .map(el => encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value))
      .join('&');
    xhr.send(data);
  });
});