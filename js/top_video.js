// Params
let mainSliderSelector = '.main-slider',
    navSliderSelector = '.nav-slider';

// Main Slider
let mainSliderOptions = {
  loop: true,
  speed:800,
  parallax:true,
  autoplay:{
    delay:4500,
    
  },
  loopAdditionalSlides: 6,
  grabCursor: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  on: {
    init: function(){
      this.autoplay.stop();
    },
    imagesReady: function(){
      this.el.classList.remove('loading');
      this.autoplay.start();
    }
  }
};
let mainSlider = new Swiper(mainSliderSelector, mainSliderOptions);

// Navigation Slider
let navSliderOptions = {
      loop: true,
      loopAdditionalSlides: 6,
      speed:1000,
      spaceBetween: 3,
      slidesPerView: 3,
      centeredSlides : true,
      touchRatio: 0.2,
      slideToClickedSlide: true,
      direction: 'vertical',
      on: {
        imagesReady: function(){
          this.el.classList.remove('loading');
        },
        click: function(){
          mainSlider.autoplay.stop();
        }
      }
    };
let navSlider = new Swiper(navSliderSelector, navSliderOptions);

// Matching sliders
mainSlider.controller.control = navSlider;
navSlider.controller.control = mainSlider;