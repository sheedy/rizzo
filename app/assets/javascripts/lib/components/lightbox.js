// ------------------------------------------------------------------------------
//
// LightBox
//
// ------------------------------------------------------------------------------
define([
  "jquery",
  "lib/mixins/flyout",
  "lib/mixins/events",
  "lib/utils/template",
  "lib/page/viewport_helper",
  "polyfills/function_bind"
], function($, asFlyout, asEventEmitter, Template, withViewportHelper) {

  "use strict";

  // @args = {}
  // el: {string} selector for parent element
  var LightBox = function(args) {
    this.customClass = args.customClass;
    this.$el = $(args.$el || "#js-row--content");
    this.$opener = $(args.$opener || ".js-lightbox-toggle");
    this.showPreloader = args.showPreloader || false;

    this.$lightbox = $("#js-lightbox");
    this.$lightboxContent = this.$lightbox.find(".js-lightbox-content");

    this.requestMade = false;

    this.init();
  };

  // -------------------------------------------------------------------------
  // Mixins
  // -------------------------------------------------------------------------

  asFlyout.call(LightBox.prototype);
  asEventEmitter.call(LightBox.prototype);
  withViewportHelper.call(LightBox.prototype);

  // -------------------------------------------------------------------------
  // Initialise
  // -------------------------------------------------------------------------

  LightBox.prototype.init = function() {

    this.customClass && this.$lightbox.addClass(this.customClass);

    // Just in case there are defined dimensions already specified.
    this._centerLightbox();

    if (this.showPreloader) {
      this.preloaderTmpl = Template.render($("#tmpl-preloader").text(), {});
      this.$lightboxContent.parent().append( this.preloaderTmpl );
    }

    this.listen();
  };

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  LightBox.prototype.listen = function() {

    this.$lightbox.on("click", ".js-lightbox-close", function(event) {
      event.preventDefault();
      this._closeFlyout(this.$el);
    }.bind(this));

    this.$opener.on("click", function(event) {
      event.preventDefault();
      this.trigger(":lightbox/open", { opener: event.currentTarget,  target: this.$lightboxContent, listener: this.$el });
    }.bind(this));

    this.$el.on(":lightbox/open", function(event, data) {

      $("html").addClass("lightbox--open");
      this.$lightbox.addClass("is-active is-visible");
      this._centerLightbox();

      setTimeout(function() {
        this.listenToFlyout(event, data);
      }.bind(this), 20);
    }.bind(this));

    this.$el.on(":lightbox/fetchContent", function(event, url) {
      this.requestMade = true;
      this._fetchContent(url);
    }.bind(this));

    this.$el.on(":flyout/close", function() {
      if (this.$lightbox.hasClass("is-active")){
        $("html").removeClass("lightbox--open");

        if (this.requestMade){
          this.requestMade = false;
          $("#js-card-holder").trigger(":controller/back");
        }

        // Waits for the end of the transition.
        setTimeout(function() {
          this.$lightboxContent.empty();
          this.$lightbox.removeClass("is-active is-visible");
        }.bind(this), 300);

        this.$lightbox.removeClass("content-ready");

      }

    }.bind(this));

    this.$el.on(":lightbox/renderContent", function(event, content) {
      this._renderContent(content);
    }.bind(this));

    $("#js-card-holder").on(":layer/received", function(event, data) {
      // TODO render pagination
      this._renderContent(data.content);
    }.bind(this));
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  LightBox.prototype._fetchContent = function(url) {
    this.$lightbox.addClass("is-loading");

    $("#js-card-holder").trigger(":layer/request", { url: url });
  };

  // @content: {string} the content to dump into the lightbox.
  LightBox.prototype._renderContent = function(content) {

    // Waits for the end of the transition.
    setTimeout(function() {
      this.$lightboxContent.html(content);
      this.$lightbox.addClass("content-ready");
      this.trigger(":lightbox/contentReady");
    }.bind(this), 300);

    this.$lightbox.removeClass("is-loading");
  };

  LightBox.prototype._centerLightbox = function() {
    var viewport = this.viewport();
    this.$lightbox.css({
      left: 0,
      height: viewport.height,
      width: viewport.width
    });
  };

  // Self instantiate if the default class is used.
  if ($(".js-lightbox-toggle").length) {
    var $lightboxToggle = $(".js-lightbox-toggle");
    new LightBox({
      customClass: $lightboxToggle.data("lightbox-class"),
      showPreloader: $lightboxToggle.data("lightbox-showpreloader")
    });
  }

  return LightBox;

});
