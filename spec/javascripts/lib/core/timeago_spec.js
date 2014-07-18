require([ "jquery", "lib/core/timeago" ], function($, TimeAgo) {

  "use strict";

  describe("TimeAgo", function() {

    var timeago,
        convertToRegExp,
        fullStrings,
        shortStrings;

    convertToRegExp = function(hash, array) {
      var arrayOfValues = [],
          value;

      for (var key in hash) {
        value = hash[key];
        if ((typeof value === "string") && (value.length > 0)) {
          arrayOfValues.push(value.replace("%d", "").trim());
        }
      }
      if (array) { arrayOfValues = arrayOfValues.concat(array); }

      return new RegExp(arrayOfValues.join("|"));
    };

    timeago = new TimeAgo();

    fullStrings = convertToRegExp(timeago.strings.full);
    shortStrings = convertToRegExp(timeago.strings.short, timeago.monthNames);

    beforeEach(function() {
      loadFixtures("timeago.html");
      timeago = new TimeAgo();
    });

    describe("Initialisation", function() {

      it("is defined", function() {
        expect(timeago).toBeDefined();
      });

      it("defines a way to update strings", function() {
        expect(timeago, "_updateStrings").toBeDefined();
      });

      it("defines a way to determine if screen width breakpoint was crossed", function() {
        expect(timeago, "_isAboveBreakpoint").toBeDefined();
      });

    });

    describe("Screen width > breakpoint", function() {

      it("each occurence should have full strings", function() {
        spyOn(timeago, "_isAboveBreakpoint").andReturn(true);
        timeago._updateStrings();
        expect($("time.js-timeago").text()).toMatch(fullStrings);
        expect($("time.js-timeago-full").text()).toMatch(fullStrings);
      });

    });

    describe("Screen width < breakpoint", function() {

      beforeEach(function() {
        spyOn(timeago, "_isAboveBreakpoint").andReturn(false);
        timeago._updateStrings();
      });

      it("should have full strings if selector is '.js-timeago-full'", function() {
        expect($("time.js-timeago-full").text()).toMatch(fullStrings);
      });

      it("should have short strings if selector is '.js-timeago'", function() {
        expect($("time.js-timeago").text()).not.toMatch(fullStrings);
        expect($("time.js-timeago").text()).toMatch(shortStrings);
      });

    });
  });
});
