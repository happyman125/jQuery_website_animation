// Plugin: jQuery.scrollSpeed
// Source: github.com/nathco/jQuery.scrollSpeed
// Author: Nathan Rutzky
// Update: 1.0.2

(function ($) {

  jQuery.scrollSpeed = function (step, speed, easing) {

    var $document = $(document),
      $window = $(window),
      $body = $('html, body'),
      option = easing || 'default',
      root = $(window).scrollTop() || 0,
      scroll = false,
      scrollY,
      scrollX,
      view,
      select = false;

    $('select').on('keyup', function () {
      select = true;
    })
      .on('mouseenter', 'option', function () {
        select = true;
      })
      .on('mouseleave', function () {
        select = false;
      })
      .on('blur', function () {
        select = false;
      });

    $window.on('mousewheel DOMMouseScroll MozMousePixelScroll', function (e) {
      if (select)
        return;

      var deltaY = e.originalEvent.wheelDelta,
      detail = e.originalEvent.detail;
      scrollY = document.body.clientHeight > $window.height();
      scrollX = document.body.clientWidth > $window.width();
      scroll = true;

      if (scrollY) {

        view = $window.height();

        if (deltaY < 0 || detail > 0)

          root = (root + view) >= $document.height() ? root : root += step;

        if (deltaY > 0 || detail < 0)

          root = root <= 0 ? 0 : root -= step;

        if ($window.scrollTop() > root && deltaY < 0) {

          root = root + $window.scrollTop();

          $body.stop().animate({

            scrollTop: root

          }, speed, option, function () {

            scroll = false;

          });
        } else {
          $body.stop().animate({

            scrollTop: root

          }, speed, option, function () {

            scroll = false;

          });
        }
      }

      if (scrollX) {

        view = $window.width();

        if (deltaY < 0 || detail > 0)

          root = (root + view) >= $document.width() ? root : root += step;

        if (deltaY > 0 || detail < 0)

          root = root <= 0 ? 0 : root -= step;

        $body.stop().animate({

          scrollLeft: root

        }, speed, option, function () {

          scroll = false;

        });
      }

      return false;

    }).on('scroll', function () {

      if (scrollY && !scroll) root = $window.scrollTop();
      if (scrollX && !scroll) root = $window.scrollLeft();

    }).on('resize', function () {

      if (scrollY && !scroll) view = $window.height();
      if (scrollX && !scroll) view = $window.width();

    });
  };

  jQuery.easing.default = function (x, t, b, c, d) {

    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  };

})(jQuery);