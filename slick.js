$(function(){
  // Gallery slider
      $('.gallery-slider').slick({
          centerMode: true,
          centerPadding: '60px',
          slidesToShow: 3,
          arrows: false,
          dots: true,
          responsive: [
              {
                  breakpoint: 900,
                  settings: {
                      slidesToShow: 1,
                      centerPadding: '20px'
                  }
              },
              {
                  breakpoint: 430,
                  settings: {
                      slidesToShow: 1,
                      centerPadding: '20px',
                      dots: true
                  }
              }
          ]
      });

      // Testimonial slider - default mode
      $('.testimonial-slider').slick({
          dots: true,
          arrows: false,
          autoplay: true,
          autoplaySpeed: 5000,
          adaptiveHeight: true
      });

      // Songs slider with center mode, no arrows
      $('.songs-slider').slick({
          centerMode: true,
          centerPadding: '60px',
          slidesToShow: 3,
          arrows: false,
          dots: true,
          responsive: [
              {
                  breakpoint: 900,
                  settings: {
                      slidesToShow: 1,
                      centerPadding: '20px'
                  }
              }
          ]
      });

      // Packages slider - multiple items, dots only on small screens
      $('.packages-slider').slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: false,
          arrows: false,
          responsive: [
              {
                  breakpoint: 900,
                  settings: {
                      slidesToShow: 1
                  }
              },
              {
                  breakpoint: 430,
                  settings: {
                      slidesToShow: 1,
                      dots: true
                  }
              }
          ]
      });

});