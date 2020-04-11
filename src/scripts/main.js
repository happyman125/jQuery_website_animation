$(document).ready(function () {

  $.reject({
      reject: {
        msie: 10,
      },
      header: 'DIN BROWSER ER FORAELDET!',
      paragraph1: 'Opdater din browser for at fa vist denne hjemmeside korrekt.',
      paragraph2: '',
      closeMessage: '',
      closeURL: 'http://outdatedbrowser.com/da',
      closeLink: 'Opdater Din browser nu',
      closeCookie: false
    }
  );


  var body = $('body');
  var width = $(window).width();
  var headerLineAnimation = {
    headerLine: $('#scroll-line'),
    headerLineText: $('#scroll-line-text'),
    marker: true,
    controlAnimation: true,
    lineShow: function (element) {
      if (headerLineAnimation.controlAnimation) {
        headerLineAnimation.controlAnimation = false;
        $.Velocity.animate(element,
          {
            width: "100%",
          }, {
            duration: 700,
            delay: 200,
            easing: [0.05, 0.78, 1, 1],
          }).then(function () {
          headerLineAnimation.headerLineText.css('display', 'inline-block');
          headerLineAnimation.textShow();
        });
      }
    },
    textShow: function () {
      $.Velocity.animate(this.headerLineText, "transition.fadeIn",
        {
          duration: 300
        }).then(function () {
        headerLineAnimation.controlAnimation = true;
      })
    },
    textHidden: function (delay) {
      if (headerLineAnimation.controlAnimation) {
        headerLineAnimation.controlAnimation = false;
        $.Velocity.animate(this.headerLineText, {opacity: 0},
          {
            duration: 300,
          }).then(function () {
          headerLineAnimation.headerLineText.css('display', 'none');
          headerLineAnimation.lineHidden(headerLineAnimation.headerLine, delay);
        })
      }
    },
    lineHidden: function (element, delay) {
      var delayTime = delay;

      if (!delayTime) {
        delayTime = 700
      }
      $.Velocity.animate(element,
        {
          width: "0%",
        }, {
          duration: delayTime,
          easing: [0.05, 0.78, 1, 1]
        }).then(function () {
        headerLineAnimation.marker = true;
        headerLineAnimation.controlAnimation = true;
      })
    },
    scroll: function (element) {
      $(window).on('scroll', function () {
        if ($(window).scrollTop() > 0 && headerLineAnimation.marker) {
          headerLineAnimation.lineShow(element);
          headerLineAnimation.marker = false;
        } else if ($(window).scrollTop() === 0 && !headerLineAnimation.marker) {
          headerLineAnimation.textHidden();

        }
      })
    }
  };
  var headerBtn = {
    menuBtn: $('.menu-btn-wrap'),
    menui: $('.icon-menu'),
    mapi: $('.icon-map-icon'),
    mapBtn: $('.map-btn-wrp'),
    showIcon: function () {
      $(this.menui).velocity({opacity: 1}, {easing: 'easeIn', delay: 0});
      $(this.mapi).velocity({opacity: 1}, {easing: 'easeIn', delay: 0});
    },
    scaleLoad: function () {
      $(this.menuBtn).velocity({scale: 1}, {easing: 'easeIn', delay: 2000});
      $.Velocity.animate($(this.mapBtn), {scale: 1}, {easing: 'easeIn', delay: 2000}).then(function () {
        headerLineAnimation.scroll(headerLineAnimation.headerLine);
        headerBtn.showIcon();
      })
    }
  };
  var heroSection = {
    logo: $('.logo'),
    banner: $('.js-animation-banner'),
    downArrow: $('.btn-scroll-down'),
    body: $('body'),
    bannerShow: function () {
      var self = this;
      $.Velocity.animate(this.banner,
        {
          opacity: 1
        }, {
          easing: 'linear',
          delay: 600,
          duration: 800,
          progress: function (start) {
            if (start) {
              self.body.addClass('blocked');
            }
          }
        }).then(function (elements) {
        if (elements) {
          heroSection.showLogo();
          heroSection.showArrow();
        }
      });
    },
    showLogo: function () {
      var self = this;
      $.Velocity.animate(this.logo, {
        opacity: 1,
      }, {
        easing: 'easeIn',
        delay: 500
      }).then(function () {
        self.body.removeClass('blocked')
      })
    },
    showArrow: function () {
      var self = this;
      this.downArrow.velocity({
        opacity: 1,
      }, {
        easing: 'easeIn',
        delay: 500
      })
    },
    minScale: function () {

      $.Velocity.animate($('#hero-img-bord-left'), {
        scale: 7,
      }, {
        easing: 'linear',
        duration: 300,
      });

      $.Velocity.animate($('#hero-img-bord-right'), {
        scale: 7,
      }, {
        easing: 'linear',
        duration: 300,
      });

      $.Velocity.animate($('#hero-img-bord-top'), {
        scale: 7,
      }, {
        easing: 'linear',
        duration: 300,
      });

      $.Velocity.animate($('#hero-img-bord-bot'), {
        scale: 7,
      }, {
        easing: 'linear',
        duration: 300,
      });
    },
    defaultScale: function () {

      $.Velocity.animate($('#hero-img-bord-left'), {
        scale: 0,
      }, {
        easing: 'linear',
        duration: 300,
        delay: 500
      });

      $.Velocity.animate($('#hero-img-bord-right'), {
        scale: 0,
      }, {
        easing: 'linear',
        duration: 300,
        delay: 500
      });

      $.Velocity.animate($('#hero-img-bord-bot'), {
        scale: 0,
      }, {
        easing: 'linear',
        duration: 300,
        delay: 500
      });

      $.Velocity.animate($('#hero-img-bord-top'), {
        scale: 0,
      }, {
        easing: 'linear',
        duration: 300,
        delay: 500
      });
    },
  };
  var menu = {
    menuBtn: $('.menu-btn-wrap'),
    menuWrapper: $('.menu-wrp'),
    leftPart: $('.left-part'),
    rightPart: $('#right-content'),
    menuLogo: $('.menu-logo'),
    menu: $('.menu'),
    openIconClass: 'icon-close',
    signUpBtn: $('#sign-up'),
    signUpForm: $('.sign-up-form'),
    hiddenText: $('#text-hidden'),

    signUpFormShow: function () {
      if ($(this).hasClass('show')) {
        $(this).removeClass('show');
        menu.signUpForm.slideUp();
      } else {
        $(this).addClass('show');
        menu.signUpForm.slideDown();
      }
    },

    slideMenu: function () {
      var self = this;
      $.Velocity.animate(self.menuWrapper, {
        translateX: "0%"
      }, {
        easing: 'linear',
        delay: 300,
      }).then(function () {
        menu.slideLeftPart();
        setTimeout(function(){
          $("footer, section, #scroll-line").hide();
         }, 300);
      })
    },

    slideLeftPart: function () {
      var self = this;
      $.Velocity.animate(self.leftPart, {
        translateX: '0%',
      }, {
        easing: 'linear',
        delay: 300,
        progress: function (elements, complite, start) {
          if (start) {
            menu.menuBtn.addClass('trans-bg');

            if (width < 1024) {
              $('.map-btn-wrp').addClass('trans-bg');
            }
          }
        }
      }).then(function () {
        menu.showMenuLogo();
        menu.showLeftContent();
        menu.showRightContent();
      })
    },

    showMenuLogo: function () {
      $.Velocity.animate(this.menuLogo, {
        opacity: 1,
      }, {
        easing: 'linear',
        delay: 200,
        duration: 400,
      });
    },

    showLeftContent: function () {
      $.Velocity.animate(this.menu, {
        opacity: 1,
      }, {
        easing: 'linear',
        duration: 450,
        delay: 250
      })
    },

    showRightContent: function () {
      $.Velocity.animate(this.rightPart, {
        opacity: 1,
      }, {
        easing: 'linear',
        duration: 500,
        delay: 250
      }).then(function () {
        menu.menuBtn.prop('disabled', false);
      })
    },

    hiddenMenuLogo: function () {
      this.menuBtn.prop('disabled', true);
      $.Velocity.animate(this.menuLogo, {
        opacity: 0,
      }, {
        easing: 'linear',
        delay: 150,
        duration: 150,
      }).then(function () {
        menu.hiddenLeftContent();
        menu.hiddenRightContent();
      });
    },

    hiddenLeftContent: function () {
      $.Velocity.animate(this.menu, {
        opacity: 0,
      }, {
        easing: 'linear',
        duration: 250,
        delay: 200
      })
    },

    hiddenRightContent: function () {
      $.Velocity.animate(this.rightPart, {
        opacity: 0,
      }, {
        easing: 'linear',
        duration: 300,
        delay: 250
      }).then(function () {
        menu.hiddenLeftPart();
      })
    },

    hiddenLeftPart: function () {
      $.Velocity.animate(this.leftPart, {
        translateX: '-300%',
      }, {
        easing: 'linear',
        duration: 150,
      }).then(function () {
        menu.menuBtn.removeClass('trans-bg');
        if (width < 1024) {
          $('.map-btn-wrp').removeClass('trans-bg');
        }
        menu.hiddenOveraly();
      })
    },

    hiddenOveraly: function () {
      var self = this;
      if ($(window).scrollTop() !== 0) {
        headerLineAnimation.lineShow(headerLineAnimation.headerLine);
      }
      $.Velocity.animate(self.menuWrapper, {
        translateX: "100%"
      }, {
        easing: 'linear',
        delay: 200,
      }).then(function () {
        heroSection.defaultScale();
        menu.menuBtn.prop('disabled', false);
        $("footer, section, #scroll-line").show();
      })
    },

    hiddenMenu: function () {
      this.hiddenMenuLogo();
    },

    clickBtn: function () {
      if ($(this).hasClass('icon-closes')) {
        $(this).removeClass('icon-closes');
        menu.hiddenMenu();
        body.removeClass('blocked');
        menu.signUpBtn.removeClass('show');
        menu.hiddenText.slideDown();
        menu.signUpForm.slideUp();
      } else {
        $(this).addClass('icon-closes').prop('disabled', true);
        body.addClass('blocked');
        heroSection.minScale();
        headerLineAnimation.textHidden(100);
        menu.slideMenu();
      }
    },

    init: function () {
      this.menuBtn.on('click', this.clickBtn);
      this.signUpBtn.on('click', this.signUpFormShow)
    }
  };


  //bg image loaded
  function getBgUrl(el) {
    var bg = "";
    if (el.currentStyle) { // IE
        bg = el.currentStyle.backgroundImage;
    } else if (document.defaultView && document.defaultView.getComputedStyle) { // Firefox
        bg = document.defaultView.getComputedStyle(el, "").backgroundImage;
    } else { // try and get inline style
        bg = el.style.backgroundImage;
    }
    return bg.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
  }

  //align my backgroundheight...
  function fitsectionsheights() {
    $.each($('.fit-overlay-content'), function(){
        $(this).parent().find(".fit-overlay-overlay").css("height", $(this).outerHeight());
    })
  }


  //banner height
  function fitbannerheight() {

      $.each($('.intro .overlay-intro-text, .intro .tool-overlay,.intro .godt-overlay'), function(){
        var bannerelm = $(this).closest(".intro").find(".intro__text");
        $(this).css("height", bannerelm.outerHeight());
        $(this).closest(".intro").height(bannerelm.offset().top+bannerelm.outerHeight());

        if(bannerelm.outerHeight() > 0){
          var image = document.createElement('img');
          image.src = getBgUrl($('.intro__bg')[0]);
          image.onload = function () {
          $("#tadaoverlay").hide();
          $("#tada").velocity({ opacity: 0 },{
            easing: 'linear',
            duration: 1000,
            delay: 0
          });
        }
      };
      });
  }

  if ($('.intro').length){
    fitbannerheight();
    fitsectionsheights();
  }
  //window resize
  if(window.attachEvent) {
    window.attachEvent('onresize', function() {
      fitbannerheight();
      fitsectionsheights();
    });
  }
  else if(window.addEventListener) {
      window.addEventListener('resize', function() {
        fitbannerheight();
        fitsectionsheights();
      }, true);
  }




  var heightHeader = $('.page-header').height();
  heroSection.downArrow.click(function () {
    $('html, body').animate({
      scrollTop: $("#section-info").offset().top - heightHeader
    }, 2000);
  });

  /*Scroll */
  var $window = $(window);
  var scrollTime = 1;
  var scrollDistance = 250;

  if ($("body").attr('data-scrolltime')) {
    scrollTime = $("body").data("scrolltime");
  }
  if ($("body").attr('data-scrollistance')) {
    scrollDistance = $("body").data("scrolldistance");
  }

  if (true) {
    function bodyScroll(event){
      if (!menu.menuBtn.hasClass('icon-closes')) {
    
        event.preventDefault();
    
        var delta = event.wheelDelta/120 || -event.detail/3;
        var scrollTop = $window.scrollTop();
        var finalScroll = scrollTop - parseInt(delta*scrollDistance);
    
        TweenMax.to($window, scrollTime, {
          scrollTo: {y: finalScroll, autoKill: true},
          ease: Power1.easeOut,
          overwrite: 5
        });
    
      }
    }
    
    document.body.addEventListener('mousewheel', bodyScroll, {passive: false});
    document.body.addEventListener('DOMMouseScroll', bodyScroll, {passive: false});
    
    /*$('body').on("mousewheel DOMMouseScroll", function (event) {

      if (!menu.menuBtn.hasClass('icon-closes')) {

        event.preventDefault();

        var delta = event.originalEvent.wheelDelta / 120 || -event.originalEvent.detail / 3;
        var scrollTop = $window.scrollTop();
        var finalScroll = scrollTop - parseInt(delta * scrollDistance);

        TweenMax.to($window, scrollTime, {
          scrollTo: {y: finalScroll, autoKill: true},
          ease: Power1.easeOut,
          overwrite: 5
        });

      }

    });*/
    /* /Scroll */
  }
  /* /Scroll*/

  /*Animation Home page*/
  if (true) {
    /*
    check for is removed -  $('body').hasClass('home-page')
    */
    /*Animation*/
    var controller = new ScrollMagic.Controller();

    var InfoImg = TweenMax.to("#info-img-translate, #info-img-bord-left, #info-img-bord-top", 2, {
      scale: 1,
      y: 0
    });
    var InfoText = TweenMax.to("#info-text", 3, {
      y: 0,
    });

    var timelineImgText = new TimelineLite();

    timelineImgText.to("#find-img-bord-left, #find-img-bord-right", 2, {
      scaleX: 0,
    })
      .to("#find-img-bord-top", 2, {
        scaleY: 0,
      }, 0)
      .to(".img-desc", 4, {
        y: 0,
      }, 0.5);

    var timeLineSliderOverlay = new TimelineLite();

    timeLineSliderOverlay.to("#slider-img-bord-left, #slider-img-bord-right", 2, {
      scaleX: 0,
    })
      .to("#slider-img-bord-top", 2, {
        scaleY: 0,
      }, 0);

    var ekologyTimeLine = new TimelineLite();

    ekologyTimeLine.to("#ecology-img-bord-left, #ecology-img-bord-right", 2, {scaleX: 0})
      .to("#ecology-img-bord-top", 2, {scaleY: 0}, 0)
      .to(".ecology-text", 8, {y: -60});

    var mapText = TweenMax.to("#find-text", 1, {
      opacity: 1,
    });

    var boy = TweenMax.to("#boy", 5, {
      y: -550
    });

    var sliderText = TweenMax.to("#slider-text", 2, {
      opacity: 1,
      y: -50
    });

    var marketImg = TweenMax.to("#market-img", 2, {y: 0});

    var contactImgOwerlay = new TimelineLite();
    contactImgOwerlay.to("#contact-img-bord-left, #contact-img-bord-right", 4, {scaleX: 0})
      .to("#contact-img-bord-top", 4, {scaleY: 0}, 0);

    var marketText = TweenMax.to(".market-text", 2, {y: -100});

    var contactText = TweenMax.to("#contact-text", 4, {opacity: 1});

    var contactImgText = TweenMax.to(".contact-img-text", 5, {y: 0});
    var sliderControl = TweenMax.to('#control-slider', 1, {scaleX: 1});

    var durationInfoImg;
    var s3offset = -15;
    var s0offset = -350;
    var s5offset = -200;

    if (width < 1024){
      s3offset = -340;
      s0offset = -150;
      s5offset = -400;
    }

    if (width > 1200) {
      durationInfoImg = 900;
    } else {
      durationInfoImg = 600;
    }


    var s = new ScrollMagic.Scene({
      triggerElement: "#trigger",
      duration: durationInfoImg,
      offset: s0offset
    }).setTween(InfoImg)
    /* .addIndicators({name: 'Video'})*/
      .addTo(controller);

    var s2 = new ScrollMagic.Scene({
      triggerElement: "#trigger",
      duration: 1250,
      offset: -350
    }).setTween(InfoText)
    /*.addIndicators({name: 'Video text'})*/
      .addTo(controller);


    var s3 = new ScrollMagic.Scene({
      triggerElement: "#trigger2",
      duration: 1000,
      offset: s3offset
    }).setTween(timelineImgText)
    /*.addIndicators({name: 'Find img'})*/
      .addTo(controller);

    var s4 = new ScrollMagic.Scene({
      triggerElement: "#trigger2",
      duration: 400,
      offset: 300
    }).setTween(mapText)
    /*.addIndicators({name: "Map Text"})*/
      .addTo(controller);

    var s5 = new ScrollMagic.Scene({
      triggerElement: "#trigger3",
      duration: 490,
      offset: s5offset
    }).setTween(timeLineSliderOverlay)
    /*.addIndicators({name: "Slider"})*/
      .addTo(controller);


    var offsetControlSlider;
    if (width > 1440) {
      offsetControlSlider = 300;
    }
    else {
      offsetControlSlider = 300;
    }

    var s5_1 = new ScrollMagic.Scene({
      triggerElement: "#trigger3",
      duration: 80,
      offset: offsetControlSlider
    }).setTween(sliderControl)
      /*.addIndicators({name: "Slider Control"})*/
      .addTo(controller);

    var s6 = new ScrollMagic.Scene({
      triggerElement: "#trigger3",
      duration: 1800,
      offset: 290
    }).setTween(boy)
    /* .addIndicators({name: "boy"})*/
      .addTo(controller);


    var offsetTextSlider;
    if (width > 1200) {
      offsetTextSlider = 700;
    } else {
      offsetTextSlider = 300;
    }

    var s7 = new ScrollMagic.Scene({
      triggerElement: "#trigger3",
      duration: 1200,
      offset: offsetTextSlider
    }).setTween(sliderText)
    /*.addIndicators({name: "Text"})*/
      .addTo(controller);

    var s8 = new ScrollMagic.Scene({
      triggerElement: "#trigger4",
      duration: 1200,
      offset: -250
    }).setTween(ekologyTimeLine)
    /*.addIndicators({name: "Ecology"})*/
      .addTo(controller);

    var s9 = new ScrollMagic.Scene({
      triggerElement: "#trigger5",
      duration: 1000,
      offset: -270
    }).setTween(marketImg)
    /*.addIndicators({name: "marketOverlay"})*/
      .addTo(controller);

    var s11 = new ScrollMagic.Scene({
      triggerElement: "#trigger5",
      duration: 1000,
      offset: 0
    }).setTween(marketText)
    /*.addIndicators({name: "marketText"})*/
      .addTo(controller);

    var s12 = new ScrollMagic.Scene({
      triggerElement: "#trigger6",
      duration: 500,
      offset: 0
    }).setTween(contactImgOwerlay)
    /*.addIndicators({name: "contactO"})*/
      .addTo(controller);

    var s13 = new ScrollMagic.Scene({
      triggerElement: "#trigger6",
      duration: 500,
      offset: 200
    }).setTween(contactText)
    /*.addIndicators({name: "contactT"})*/
      .addTo(controller);

    var s14 = new ScrollMagic.Scene({
      triggerElement: "#trigger6",
      duration: 700,
      offset: 250
    }).setTween(contactImgText)
    /*.addIndicators({name: "contactIT"})*/
      .addTo(controller);
  }
  /* /Animation Home page*/

  /*Slider Home page*/
  if ($("#slider").length != 0) {
    /*Slider*/
    var slick = $("#slider").slick({
      appendArrows: $('.slider-control'),
      prevArrow: $('.slick-prev'),
      nextArrow: $('.slick-next'),
    });

    var cSlide = $('#cSlide');
    var aSlides = $('#aSlides');
    var cS = slick.slick('slickCurrentSlide');
    var gSlick = slick.slick('getSlick');

    aSlides.text(gSlick.$slides.length);
    cSlide.text(cS + 1);

    slick.on('afterChange', function (event, slick, currentSlide) {
      cSlide.text(currentSlide + 1);
    });
  }
  /*Slider Home page*/

  var markerTime = true;

  $("#bgvid").on("timeupdate", function () {
    var timeVideo = Math.round(this.duration * 1000);
    var cTime = Math.floor(this.currentTime);
    if (cTime === 0 && markerTime) {
      markerTime = false;
      bar(timeVideo);
    }

  });

  function bar(duration) {
    var bar = new ProgressBar.Circle(time_line, {
      strokeWidth: 50,
      easing: 'linear',
      duration: duration,
      color: '#FFF',
      svgStyle: null
    });

    bar.animate(1, function () {
      bar.destroy();
      markerTime = true;
    });
  }

  /*Main Init*/
  heroSection.bannerShow();
  headerBtn.scaleLoad();
  menu.init();

  //Validation email
  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  $('#submit-btn').on('click', function (event) {
    var email = $('#email');
    var emailVal = email.val();
    if (!validateEmail(emailVal)) {
      event.preventDefault();
      email.addClass('no-valid');
    }
  });

  $('#email').on('keydown', function () {
    if ($(this).hasClass('no-valid')) {
      $(this).removeClass('no-valid');
    }
  });
  // /Validation email

  // https://www.primebox.co.uk/projects/jquery-cookiebar/
  $.cookieBar({
    message: $(body).data("cookie-message"),
    acceptButton: true,
    acceptText: $(body).data("cookie-policyurl-accepttext"),
    policyButton: true,
    policyText: $(body).data("cookie-policyurl-text"),
    policyURL: $(body).data("cookie-policyurl"),
    append: false,
  });

  setTimeout(function () {
    $('.popup').css('display', 'flex');
  }, 1000);

  $('#close-popup').on('click', function (event) {
    event.preventDefault();
    $('.popup').removeAttr('style');
  });

  $('.popuo-overlay').on('click', function () {
    $('.popup').removeAttr('style');
  });

  $('#next').on('click', function () {
    $('.second-step').removeClass('hidden-input');
    $('.first-step').addClass('hidden-input')
  });
  
  var playYoutubeButton = $('.js-play-y-video'),
    currentPlayer,
    currentPlayerIndex,
    players = [],
    aspectRatio = 0.5625;
    // aspectRatio = 1.78;
  
  var YTPlayer = {
    
    init () {
      this.addListener();
    },
    
    addListener (event) {
      this._listeners.initPlayer(event);
      this._listeners.setIframeContainerHeight();
      playYoutubeButton.on('click', event,  this._listeners.playVideo);
      $window.on('resize', event,  this._listeners.setIframeSize);
      $window.on('resize', event,  this._listeners.setIframeContainerHeight);
    },
    
    _listeners: {
      
      initPlayer(event) {
        // 2. This code loads the IFrame Player API code asynchronously.
        var tag = document.createElement('script');
        
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      },
      
      playVideo(event) {
        
        var areaForInsertingVideo = $(this).next(),
          videoId = $(this).attr('data-videoid');
  
        currentPlayer = $(this);
        currentPlayerIndex = playYoutubeButton.index(currentPlayer);
        
        if (currentPlayer.hasClass('played')) {
          players[currentPlayerIndex].pauseVideo();
          currentPlayer.removeClass('played');
          currentPlayer.addClass('paused');
        } else if ( currentPlayer.hasClass('paused')) {
          playYoutubeButton.each(function (index) {
            if ( $(this).hasClass('played')){
              $(this).removeClass('played').addClass('paused');
              players[index].pauseVideo();
            }
          });
          players[currentPlayerIndex].playVideo();
          currentPlayer.removeClass('paused');
          currentPlayer.addClass('played');
        } else {
          
          var player = new YT.Player(areaForInsertingVideo[0], {
            width : '320',
            height : '180',
            videoId : videoId,
            playerVars: { 'showinfo': 0, 'controls': 0},
            events : {
              'onReady' : YTPlayer._listeners.onPlayerReady,
              'onStateChange' : YTPlayer._listeners.onPlayerStateChange
            }
          });
          players[currentPlayerIndex] = player;
          playYoutubeButton.each(function (index) {
            if ( $(this).hasClass('played')){
              $(this).removeClass('played').addClass('paused');
              players[index].pauseVideo();
            }
          });
          currentPlayer.addClass('played');
        }
        
      },
      
      setIframeContainerHeight(){
        playYoutubeButton.each(function () {
          
          var iframeWidth = $(this).outerWidth(),
            newParentHeight= iframeWidth*aspectRatio;
  
          $(this).parent().css({"min-height":newParentHeight+"px", "max-height":newParentHeight+"px", "height":newParentHeight+"px"});
        });
      },
  
      setIframeSize(event) {
        
        if( currentPlayer ){
          var youtubeFrames = $("iframe[src^='https://www.youtube.com']");
          
          youtubeFrames.each(function () {
            
            var iframeWidth = $(this).outerWidth(),
              newParentHeight= iframeWidth*aspectRatio;
  
            $(this).parent().css({"min-height":newParentHeight+"px", "max-height":newParentHeight+"px", "height":newParentHeight+"px"});
          });
        }
      },
      
      onPlayerReady(event) {
  
        players[currentPlayerIndex].playVideo();
  
        var iframe = $(event.target.a),
          iframeWidth = iframe.outerWidth(),
          newParentHeight= iframeWidth*aspectRatio;
  
        iframe.parent().css({"min-height":newParentHeight+"px", "max-height":newParentHeight+"px", "height":newParentHeight+"px"});
      },
      
      onPlayerStateChange(event){
        if(event.data === YT.PlayerState.ENDED) {
          players[currentPlayerIndex].destroy();
          currentPlayer.removeClass('played');
        }
      }
    }
  };
  
  if ( playYoutubeButton ) YTPlayer.init();

  /*Scroll top btn*/
  var triggerSection =  $('section:last').offset().top-1000;
  $(window).on('scroll load', function () {

    if($(window).scrollTop() > triggerSection){
      $('#btn-up').css({opacity:1, visibility: 'visible'});
    } else {
      $('#btn-up').removeAttr('style');
    }

  });

  $('#btn-up').on('click', function () {
    $('html, body').animate({scrollTop : 0},1000);
    return false;
  });

});




