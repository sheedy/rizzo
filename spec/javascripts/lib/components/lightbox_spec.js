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

    describe("Functionality", function() {

      it("can update the lightbox contents", function() {
        $("#js-row--content").trigger(":lightbox/renderContent", "Test content here.");
        $("#js-lightbox").trigger("webkitTransitionEnd");

        expect($(".js-lightbox-content").html()).toBe("Test content here.");

      });

      it("can add a custom class to the lightbox", function() {
        expect($("#js-lightbox")).toHaveClass("lightbox-foo");
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

      it("sets up the container to be the full height and width of the viewport, with the header visible", function() {

        spyOn(lightbox, "viewport").andReturn({
          left: 0,
          height: 800,
          top: 0,
          width: 1000
        });

        lightbox._centerLightbox();

        expect($("#js-lightbox").height()).toBe(800 - 55);
        expect($("#js-lightbox").width()).toBe(1000 + 15);
      });

      it("sets up the container to be the full height and width of the viewport, with header visible", function() {

        spyOn(lightbox, "viewport").andReturn({
          left: 0,
          height: 800,
          top: 80,
          width: 1000
        });

        lightbox._centerLightbox();

        expect($("#js-lightbox").height()).toBe(800);
        expect($("#js-lightbox").width()).toBe(1000 + 15);
      });

    });

  });
});
