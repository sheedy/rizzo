require([ "jquery", "public/assets/javascripts/lib/components/poi_list.js" ], function($, POIList) {

  "use strict";

  describe("POI List", function() {

    var instance, mockAPI;

    beforeEach(function() {
      loadFixtures("poi_list.html");

      jasmine.Clock.useMock();

      mockAPI = jasmine.createSpyObj("Google Maps", [ "Map", "LatLng", "Marker", "Point", "Size", "Animation" ]);

      mockAPI.Map.andCallFake(function() {
        return jasmine.createSpyObj("Google Map Instance", [ "setCenter", "panBy" ]);
      });

      mockAPI.Marker.andCallFake(function() {
        return jasmine.createSpyObj("Google Maps Marker", [ "setIcon", "getPosition", "setZIndex" ]);
      });

      instance = new POIList(null, {
        $container: $("div.js-poi-map-container"),
        $el: $("div.js-poi-map"),
        marker: mockAPI.Marker(),
        map: mockAPI.Map(),
        isOpen: false
      });

      window.google = {
        maps: mockAPI
      };
    });

    afterEach(function() {
      window.google = window.mapsCallback = instance = undefined;
    });

    describe("Initialisation", function() {
      beforeEach(function() {
        spyOn(instance, "_addPOIs").andCallThrough();
      });

      it("should wait until POIMap is initialized", function() {
        expect(instance._addPOIs).not.toHaveBeenCalled();

        $(".js-poi-map").trigger(":map/open");

        expect(instance._addPOIs).toHaveBeenCalled();
      });

      it("should collect POI data", function() {
        $(".js-poi-map").trigger(":map/open");
        jasmine.Clock.tick(1000);

        expect(instance.poiData.length).toBe(4);
      });
    });

    describe("Markers", function() {
      beforeEach(function() {
        $(".js-poi-map").trigger(":map/open");
        jasmine.Clock.tick(1000);
      });

      it("should create all the markers", function() {
        // Parent POI maps component will also call Marker
        expect(window.google.maps.Marker.callCount - 1).toBe(4);
        expect(instance.poiMarkers.length).toBe(4);
      });
    });

    describe("POI Highlight", function() {
      beforeEach(function() {
        $(".js-poi-map").trigger(":map/open");
        jasmine.Clock.tick(1000);

        spyOn(instance, "_getIcon").andCallThrough();
      });

      it("should select poi on click", function() {
        instance.selectPOI(0);

        expect(instance._getIcon.mostRecentCall.args[1]).toBe("large");
        expect(instance.$pois.eq(0)).toHaveClass("is-selected");
      });

      it("should reset the selected poi", function() {
        instance.resetSelectedPOI();

        expect(instance._getIcon.mostRecentCall.args[1]).toBe("small");
        expect(instance.$pois.eq(0)).not.toHaveClass("is-selected");
      });
    });

  });

});
