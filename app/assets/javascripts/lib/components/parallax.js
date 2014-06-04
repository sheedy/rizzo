define([
  "jquery",
  "lib/page/viewport_helper",
  "lib/core/feature_detect"
], function($, withViewportHelper) {

  "use strict";

  var HeroParallax,
      _pageYOffset = window.pageYOffset,
      _stopScroll,
      _frame,
      started = false,
      $els,
      autoInit,
      heroBanners = [];

  HeroParallax = function( args ) {
    this.$els = args.$els || $(".js-bg-parallax");

    $.each(this.$els, $.proxy(function(i) {

      var $el = this.$els.eq(i),
        $animEl = $el.find(".hero-banner__image");

      heroBanners[ i ] = {
        $el: $el,
        $animEl: $animEl,
        imageHeight: $animEl.height(),
        heroHeight: $el.height()
      };

      if (this.withinViewport($el)) {
        $animEl.addClass("hero-banner__image-first-position")
                .on(window.lp.supports.transitionend, function() {
                  $(event.target).removeClass("hero-banner__image-first-position");
                });
      }

      $animEl.css({
        "-webkit-transform": "translate3d(0px, -" + this.calculatePosition( i ).toFixed(2) + "px, 0px) scale(1) rotate(0deg)"
      });

    }, this));

    $(window).bind("scroll", $.proxy(this._onScroll, this));
  };

  withViewportHelper.call(HeroParallax.prototype);

  HeroParallax.prototype.calculatePosition = function( i ) {
    var maxParallax = (heroBanners[ i ].imageHeight - heroBanners[ i ].heroHeight),
        topPosition = heroBanners[ i ].$el.offset().top - _pageYOffset + (heroBanners[ i ].heroHeight / 2 ),
        midPosition;

    if ( topPosition > 0 ) {
      midPosition = 1 - ( Math.abs(topPosition) / (this.viewport().height) );
    }else {
      midPosition = 1;
    }
    return midPosition * maxParallax;
  };

  HeroParallax.prototype._updateBg = function( i ) {
    var $el = heroBanners[ i ].$el,
        $animEl = heroBanners[ i ].$animEl;

    if (this.withinViewport($el)) {
      $animEl.css({
        "-webkit-transform": "translate3d(0px, -" + this.calculatePosition( i ).toFixed(2) + "px, 0px) scale(1) rotate(0deg)"
      });
    }
  };

  HeroParallax.prototype._update = function() {
    _frame = window.lp.supports.requestAnimationFrame.call(window, $.proxy(this._update, this));
    $.each(this.$els, $.proxy(this._updateBg, this));
  };

  HeroParallax.prototype._startRAF = function() {
    if (!started){
      window.lp.supports.requestAnimationFrame.call(window, $.proxy(this._update, this));
      started = true;
    }
  };

  HeroParallax.prototype._stopRAF = function() {
    window.lp.supports.cancelAnimationFrame.call(window, _frame);
    started = false;
  };

  HeroParallax.prototype._onScroll = function() {
    _pageYOffset = window.pageYOffset;
    clearTimeout(_stopScroll);
    _stopScroll = setTimeout($.proxy(this._stopRAF, this), 100);
    this._startRAF();
  };

  autoInit = function() {
    if ( window.lp.supports.requestAnimationFrame ){
      $els = $(".js-bg-parallax");
      if ($els.length) {
        new HeroParallax({
          $els: $els
        });
      }
    }
  };

  //Waits for feature detect to be available
  if (window.lp.supports.requestAnimationFrame){
    autoInit();
  }else {
    $(document).on(":featureDetect/available", function() {
      autoInit();
    });
  }

  return HeroParallax;

});
