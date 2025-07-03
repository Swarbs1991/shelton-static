document.addEventListener('scroll', function () {
  const parallaxEls = document.querySelectorAll('.parallax, .banner--wrapper.parallax');
  parallaxEls.forEach(function (el) {
    const speed = 0.5; // Adjust for stronger/weaker effect
    const offset = window.scrollY * speed;
    el.style.transform = `translateY(${offset}px)`;
  });
});