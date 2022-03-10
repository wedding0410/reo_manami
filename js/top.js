var $images = $(".slide");
var $slides = $(".slide-wrap");
var slides = [];
var windowWidth, windowHeight, windowRatio;
var imageWidth, imageHeight, imageTop, imageLeft;
var imageRatio = 1200/900;
var fontSize = 20;
var parallaxTarget = {x: 0, y: 0};
var parallaxPosition = {x: 0, y: 0};
var mouseDownPosition = {};
var moveSlidePosition = {x: 0, y: 0};
var currentSlide, slideMoving;
var easeOutQuad = "cubic-bezier(0.215, 0.61, 0.355, 1)";

function Slide(elem) {
  this.init(elem);
  this.splitText();
}

Slide.prototype = {
  init: function (elem) {
    this.wrap = $(elem);
    this.image = $(this.wrap.find(".slide")[0]);
    this.text = $(this.wrap.find(".text")[0]);
  },
  splitText: function() {
    var lines = this.text.find("p");
    this.lines = [];
    for (var i = 0, l = lines.length; i < l; i++) {
      var t = lines[i].innerText || lines[i].textContent;
      var letters = t.split("");
      var text = letters.map(function(l) {
        return "<span>"+l+"</span>";
      });
      lines[i].innerHTML = text.join("");
      lines.css({position: "relative"});
      this.lines.push($(lines[i]).find("span"));
    }
    this.letters = this.text.find("span");
    this.resetText();
  },
  resetText: function() {
    for (var i = 0, l = this.letters.length; i < l; i++) {
      this.letters[i].style.opacity = 0;
      this.letters[i].style.transform = "translate3d(0, "+(fontSize*0.5)+"px, 0)";
    }
  },
  animateTextIn: function() {
    for (var i = 0, l = this.lines.length; i < l; i++) {
      var delay = i*400;
      for (var j = 0, m = this.lines[i].length; j < m; j++) {
        this.lines[i][j].style.transition = "opacity 300ms linear "+(delay+(j*100))+"ms, " +
          "transform 300ms "+easeOutQuad+" "+(delay+(j*100))+"ms";
        this.lines[i][j].style.opacity = 1;
        this.lines[i][j].style.transform = "translate3d(0, 0, 0)";
      }   
    }
  },
  transitionOut: function(e) {
    var tweenTo, _this = this;
    if (-(mouseDownPosition.x - e.pageX) > 0) {
      tweenTo = windowWidth;
    } else {
      tweenTo = -windowWidth;
    }
    this.wrap.css({transition: "transform 300ms "+easeOutQuad, transform: "translateX("+tweenTo+"px)"});
    this.wrap.on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
      _this.wrap.css({transition: "", transform: "translateX(0px)"});
      updateStack();
      _this.wrap.off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend");
    })
  },
  move: function() {
    this.image.css({transform: "translateX("+parallaxPosition.x+"px)"});
    this.image.css({webkitTransform: "translateX("+parallaxPosition.x+"px)"});
  },
  resize: function() {
    this.wrap.css({width: windowWidth, height: windowHeight});
    this.image.css({width: imageWidth, height: imageHeight, top: imageTop, left: imageLeft});
    this.text.css({fontSize: fontSize, height: fontSize*5, top: "50%", marginTop: fontSize*5*-0.5});
    this.text.find("p").css({height: fontSize*1.2});
    for (var i = 0, l = this.lines.length; i < l; i++) {
      this.lines[i].css({position: "relative"});
      var left = 0;
      for (var j = 0, m = this.lines[i].length; j < m; j++) {
        this.lines[i][j].style.left = left+"px";
        this.lines[i][j].style.width = this.lines[i][j].offsetWidth+"px";
        left += this.lines[i][j].offsetWidth;
      }
      this.lines[i].css({position: "absolute"});
    }
  }
}

function initSlides() {
  for (var i = 0, l = $slides.length; i < l; i++) {
    var slide = new Slide($slides[i]);
    slides.push(slide);
  }
}

/*
* resize
*/
function resize() {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  windowRatio = windowWidth/windowHeight;
  if (windowRatio > imageRatio) {
    imageWidth = windowWidth*1.1;
    imageHeight = imageWidth/imageRatio;
  } else {
    imageHeight = windowHeight;
    imageWidth = imageHeight*imageRatio;
  }
  imageTop = (imageHeight-windowHeight)*-0.5;
  imageLeft = (imageWidth-windowWidth)*-0.5;
  fontSize = windowHeight*0.18;
  if (windowWidth < fontSize*6) {
    fontSize = windowWidth/6;
  }
  
  for (var i = 0, l = slides.length; i < l; i++) {
    slides[i].resize();
  }
}

function mousedown(e) {
  if (e.type == "mousedown") {
    mouseDownPosition.x = e.pageX;
    mouseDownPosition.y = e.pageY;
  } else if (e.type == "touchstart") {
    mouseDownPosition.x = e.pageX = e.originalEvent.touches[0].pageX;
    mouseDownPosition.y = e.pageY = e.originalEvent.touches[0].pageY;
  }
  
  slideMoving = true;
  moveSlide(e);
}

function mousemove(e) {
  if (e.type == "touchmove") {
    e.preventDefault();
    e.pageX = e.originalEvent.touches[0].pageX;
    e.pageY = e.originalEvent.touches[0].pageY;
  } else {
    parallaxSlide(e);
  }
  moveSlide(e);
}

function motion(e) {
  parallaxSlideMotion(e);
}

function mouseup(e) {
  if (e.type == "touchend") {
    e.pageX = e.originalEvent.changedTouches[0].pageX;
    e.pageY = e.originalEvent.changedTouches[0].pageY;
  }
  releaseSlide(e);
}

function parallaxSlide(e) {
  parallaxTarget.x = (windowWidth/2 - e.pageX);
}

function parallaxSlideMotion(e) {
  parallaxTarget.x = event.accelerationIncludingGravity.x*900;
}

function moveSlide(e) {
  moveSlidePosition.x = -(mouseDownPosition.x - e.pageX);
}

function releaseSlide(e) {
  var leavingSlide = currentSlide;
  leavingSlide.transitionOut(e);
  currentSlide = null;
  slideMoving = false;
}

function updateStack() {
  slides.unshift(slides.pop());
  $.each(slides, function(i, slide) {
    slide.wrap.css({zIndex: i*100});
  })
  slides[0].resetText();
  currentSlide = slides[slides.length-1];
  currentSlide.animateTextIn();
}

function loop() {
  requestAnimationFrame(loop);
  moveSlides();
}

function moveSlides() {
  parallaxPosition.x = (parallaxTarget.x - parallaxPosition.x)*0.01;
  for (var i = 0, l = slides.length; i < l; i++) {
    slides[i].move();
  }
  if (currentSlide && slideMoving) currentSlide.wrap.css({transform: "translateX("+moveSlidePosition.x+"px)", webkitTransform: "translateX("+moveSlidePosition.x+"px)"});
}

initSlides();
resize();
updateStack();

loop();
$(window).on("resize", resize);
$(document).on("mousedown touchstart", mousedown);
$(document).on("mousemove touchmove", mousemove);
$(document).on("mouseup touchend", mouseup);
$(document).on("devicemotion", motion);