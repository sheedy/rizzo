require([ "public/assets/javascripts/lib/components/slider.js" ], function(Slider) {
  "use strict";
  describe("Slider", function() {

    var config = {
        animateDelay: 0,
        assetReveal: true,
        createControls: true,
        el: "#js-slider"
      };

    describe("object", function() {
      it("is defined", function() {
        expect(Slider).toBeDefined();
      });
    });

    describe("initialising", function() {
      beforeEach(function() {
        window.slider = new Slider(config);
        spyOn(window.slider, "init");
      });

      it("does not initialise when the parent element does not exist", function() {
        expect(window.slider.init).not.toHaveBeenCalled();
      });
    });

    describe("set up", function() {
      beforeEach(function() {
        loadFixtures("slider.html");
        window.slider = new Slider(config);
      });

      it("adds the next/prev links", function() {
        expect($(".slider__control--next").length).toBeGreaterThan(0);
        expect($(".slider__control--prev").length).toBeGreaterThan(0);
      });

      it("has the correct slides state", function() {
        expect($(".slider__control--next").html()).toBe("2 of 5");
      });

    });

    describe("standard functionality:", function() {
      beforeEach(function() {
        loadFixtures("slider.html");
        window.slider = new Slider(config);
      });

      it("updates the slide counter after navigating", function() {
        window.slider._nextSlide();
        expect($(".slider__control--next").html()).toBe("3 of 5");
        expect($(".slider__control--prev").html()).toBe("1 of 5");
      });

      it("goes to the next slide (first -> second)", function() {
        window.slider._nextSlide();
        window.slide  = $(".js-slide");
        expect($(".js-slide").get(2)).toHaveClass("is-next")
      });

      it("goes to a given slide", function() {
        window.slider._goToSlide(4);
        expect($(".js-slide").get(3)).toHaveClass("is-current")
      });

      it("goes to the previous slide (third -> second)", function() {
        window.slider._goToSlide(3);
        window.slider._previousSlide();
        expect($(".js-slide").get(0)).toHaveClass("is-previous")
      });

      it("knows when at the beginning", function() {
        expect($(".js-slider-controls-container")).toHaveClass("at-beginning");
      });

      it("knows when at the end", function() {
        slider._goToSlide($(".slider__slide").length);
        expect($(".js-slider-controls-container")).toHaveClass("at-end");
      });
    });

    describe("hidden dynamically loaded content", function() {
      beforeEach(function() {
        loadFixtures("slider_hidden_content.html");
        config.deferLoading = true;
        window.slider = new Slider(config);
        spyOnEvent($(window.slider.$el), ":asset/uncomment");
      });

      it("loads hidden content", function() {
        expect($(".slider__slide:nth-of-type(3) img").length).toBe(0);
        $(".slider__control--next").trigger("click");
        expect(":asset/uncomment").toHaveBeenTriggeredOn($(window.slider.$el), [ $(".slider__slide").slice(1), "[data-uncomment]" ]);
      });
    });
  });
});
