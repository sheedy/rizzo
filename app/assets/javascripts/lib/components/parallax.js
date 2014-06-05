define([
  "jquery",
  "lib/page/viewport_helper",
  "lib/core/feature_detect"
], function($, withViewportHelper) {

  "use strict";

  var HeroParallax,
      _autoInit,
      _pageYOffset,
      _stopScroll,
      _frame,
      _started = false,
      _heroBanners = [];

  HeroParallax = function( args ) {
    this.$els = args.$els || $(".js-bg-parallax");
    _pageYOffset = this.viewport().top;

    $.each(this.$els, function(i) {

      var $el = this.$els.eq(i),
          $animEl = $el.find(".hero-banner__image");

      _heroBanners[ i ] = {
        $el: $el,
        $animEl: $animEl,
        imageHeight: $animEl.height(),
        heroHeight: $el.height()
      };

      if (this.withinViewport($el)) {
        $animEl
          .addClass("hero-banner__image-first-position")
          .on(window.lp.supports.transitionend, function() {
            $(event.target).removeClass("hero-banner__image-first-position");
          });
      }

      $animEl.css({
        "-webkit-transform": "translate3d(0px, -" + this.calculatePosition( i ).toFixed(2) + "px, 0px) scale(1) rotate(0deg)"
      });

    }.bind(this));

    $(window).on("scroll", this._onScroll.bind(this));
  };

  withViewportHelper.call(HeroParallax.prototype);

  HeroParallax.prototype.calculatePosition = function( i ) {
    var maxParallax = (_heroBanners[ i ].imageHeight - _heroBanners[ i ].heroHeight),
        topPosition = _heroBanners[ i ].$el.offset().top - _pageYOffset + (_heroBanners[ i ].heroHeight ),
        midPosition;

    if ( topPosition > 0 ) {
      midPosition = ( Math.abs(topPosition) / (this.viewport().height) );
    } else {
      midPosition = 0;
    }

    return (midPosition * maxParallax);
  };

  HeroParallax.prototype._updateBg = function( i ) {
    var $el = _heroBanners[ i ].$el,
        $animEl = _heroBanners[ i ].$animEl;

    if (this.withinViewport($el)) {
      $animEl.css({
        "-webkit-transform": "translate3d(0px, -" + this.calculatePosition( i ).toFixed(2) + "px, 0px) scale(1) rotate(0deg)"
      });
    }
  };

  HeroParallax.prototype._update = function() {
    _frame = window.lp.supports.requestAnimationFrame.call(window, this._update.bind(this));
    $.each(this.$els, this._updateBg.bind(this));
  };

  HeroParallax.prototype._startRAF = function() {
    if (!_started){
      window.lp.supports.requestAnimationFrame.call(window, this._update.bind(this));
      _started = true;
    }
  };

  HeroParallax.prototype._stopRAF = function() {
    window.lp.supports.cancelAnimationFrame.call(window, _frame);
    _started = false;
  };

  HeroParallax.prototype._onScroll = function() {
    _pageYOffset = this.viewport().top;
    clearTimeout(_stopScroll);
    _stopScroll = setTimeout(this._stopRAF.bind(this), 100);
    this._startRAF();
  };

  _autoInit = function() {
    if ( window.lp.supports.requestAnimationFrame ){
      var $els = $(".js-bg-parallax");
      if ($els.length) {
        new HeroParallax({
          $els: $els
        });
      }
    }
  };

  //Waits for feature detect to be available
  if (window.lp.supports.requestAnimationFrame){
    _autoInit();
  }else {
    $(document).on(":featureDetect/available", function() {
      _autoInit();
    });
  }

  return HeroParallax;

});
