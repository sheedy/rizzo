require([ "jquery", "public/assets/javascripts/lib/components/lightbox.js" ], function($, LightBox) {

  "use strict";

  describe("LightBox", function() {

    var lightbox;

    beforeEach(function() {
      loadFixtures("lightbox.html");
      lightbox = new LightBox({ customClass: "lightbox-foo" });

    });

    describe("Initialisation", function() {

      it("is defined", function() {
        expect(lightbox).toBeDefined();
      });

      it("found the lightbox", function() {
        expect(lightbox.$lightbox.length).toBe(1);
      });

      it("found the lightbox opener", function() {
        expect(lightbox.$opener.length).toBe(1);
      });

      it("extends the flyout functionality", function() {
        expect(lightbox.listenToFlyout).toBeDefined();
      });

      it("should extend asEventEmitter functionality", function() {
        expect(lightbox.trigger).toBeDefined();
      });

      it("should extend viewport_helper functionality", function() {
        expect(lightbox.viewport).toBeDefined();
      });

      it("defines a way to render the contents", function() {
        expect(lightbox._renderContent).toBeDefined();
      });

      it("defines a way to fetch the contents via ajax", function() {
        expect(lightbox._fetchContent).toBeDefined();
      });

    });

    describe("Open/Close", function() {
      beforeEach(function() {
        loadFixtures("lightbox.html");
        jasmine.Clock.useMock();
        window.lp.supports = {
          transitionend: "webkitTransitionEnd"
        };
        lightbox = new LightBox({ showPreloader: true });

        $("#js-row--content").trigger(":lightbox/open");
        $("#js-lightbox").trigger("webkitTransitionEnd");
      });

      it("should have css classes", function() {
        expect($("#js-lightbox")).toHaveClass("is-active is-visible");
        expect($("html, body")).toHaveClass("lightbox--noscroll");
      });

      it("should close and clean the lightbox", function() {

        $("#js-row--content").trigger(":flyout/close");
        $("#js-lightbox").trigger("webkitTransitionEnd");
        $("#js-lightbox").trigger("webkitTransitionEnd");
        jasmine.Clock.tick(1);

        expect($("#js-lightbox")).not.toHaveClass("content-ready");
        expect($("#js-lightbox")).not.toHaveClass("is-active");
        expect($("html, body")).not.toHaveClass("lightbox--noscroll");
      });

      afterEach(function() {
        window.lp.supports = {};
      });

    });

    describe("Functionality", function() {
      beforeEach(function() {
        window.lp.supports = {
          transitionend: "webkitTransitionEnd"
        };
      });

      it("can update the lightbox contents", function() {
        $("#js-row--content").trigger(":lightbox/renderContent", "Test content here.");
        $("#js-lightbox").trigger("webkitTransitionEnd");
        $("#js-lightbox").trigger("webkitTransitionEnd");

        expect($(".js-lightbox-content").html()).toBe("Test content here.");
        expect($("#js-lightbox")).toHaveClass("content-ready");

      });

      it("can add a custom class to the lightbox", function() {
        expect($("#js-lightbox")).toHaveClass("lightbox-foo");
      });

      afterEach(function() {
        window.lp.supports = {};
      });

    });

    describe("Preloader", function() {
      beforeEach(function() {
        lightbox = new LightBox({ showPreloader: true });
      });

      it("should append the preloader HTML", function() {
        expect(lightbox.$lightbox.find(".preloader").length).toBe(1);
      });
    });

    describe("Lightbox centering", function() {

      it("sets up the container to be the full height and width of the viewport", function() {

        spyOn(lightbox, "viewport").andReturn({
          height: 800,
          width: 1000
        });

        lightbox._centerLightbox();

        expect($("#js-lightbox").height()).toBe(800);
        expect($("#js-lightbox").width()).toBe(1000 + 15); // 15 to cover the body scroll
      });

    });

  });
});
