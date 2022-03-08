var mySwiper = new Swiper('.swiper-container', {
    loop: true,
    speed: 600,
    autoplay: {
        delay: 40000,
    },
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 1.5,
    coverflowEffect: {
        rotate: -50,
        stretch: 80,
        depth: 250,
        modifier: 1,
        slideShadows: true,
    },
    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }

})
