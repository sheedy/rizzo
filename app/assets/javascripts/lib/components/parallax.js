define([
  "jquery",
  "lib/page/viewport_helper"
], function($, withViewportHelper) {

  "use strict";

  var HeroParallax,
      _pageYOffset,
      _stopScroll,
      _frame,
      started = false,
      speed = 15,
      $els;

  HeroParallax = function( args ) {
    this.$els = args.$els || $(".js-bg-parallax");

    $.each(this.$els, $.proxy(function(i) {
      var $el = this.$els.eq(i),
        $animEl = $el.find(".hero-banner__image"),
        percent;
      percent = ((($el.offset().top - window.pageYOffset) * speed) / $el.height());
      if (withViewportHelper.withinViewport($el)) {
        $animEl.addClass("hero-banner__image-first-position")
                .on(window.lp.supports.transitionend, function() {
                  $(event.target).removeClass("hero-banner__image-first-position");
                });
      }

      $animEl.css({
        "-webkit-transform": "translate3d(0px, -" + percent.toFixed(2) + "%, 0px) scale(1) rotate(0deg)"
      });

    }, this));

    $(window).bind("scroll", $.proxy(this._onScroll, this));
  };

  withViewportHelper.call(HeroParallax.prototype);

  HeroParallax.prototype._updateBg = function( i ) {
    var $el = this.$els.eq(i);
    if (withViewportHelper.withinViewport($el)) {
      var $animEl = $el.find(".hero-banner__image"),
          percent = ((($el.offset().top - _pageYOffset) * speed) / $el.height());
      $animEl.css({
        "-webkit-transform": "translate3d(0px, -" + percent.toFixed(2) + "%, 0px) scale(1) rotate(0deg)"
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

  if ( true || window.lp.supports.requestAnimationFrame ){
    $els = $(".js-bg-parallax");
    if ($els.length) {
      new HeroParallax({
        $els: $els
      });
    }
  }

  return HeroParallax;

});
