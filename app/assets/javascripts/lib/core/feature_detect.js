// ------------------------------------------------------------------------------
// Bucket Class for all our feature detection
//
// To add a new feature, extend the features object.
// The key will become the class added to the <html>.
// The corresponding function should return true or false.
//
// ------------------------------------------------------------------------------
require([ "jquery" ], function($) {
  "use strict";

  var camelFeature, feature, features;

  features = {};

  features["3d"] = function() {
    var el = document.createElement("p"),
      transform = features.transform(),
      has3d;

    document.body.insertBefore(el, document.body.firstChild);

    if (transform) {
      el.style[transform.css] = "translate3d(1px,1px,1px)";
      has3d = window.getComputedStyle(el).getPropertyValue(transform.css);
    }

    document.body.removeChild(el);

    return has3d != null && has3d.length > 0 && has3d != "none";
  };

  features.cssmasks = function() {
    return document.body.style["-webkit-mask-repeat"] != null;
  };

  features.cssfilters = function() {
    return document.body.style.webkitFilter != null && document.body.style.filter != null;
  };

  features.placeholder = function() {
    return "placeholder" in document.createElement("input");
  };

  features["pointer-events"] = function() {
    var element;
    element = document.createElement("smile");
    element.style.cssText = "pointer-events: auto";
    return element.style.pointerEvents == "auto";
  };

  features.transform = function() {
    var transforms = {
      webkitTransform: "-webkit-transform",
      OTransform: "-o-transform",
      msTransform: "-ms-transform",
      MozTransform: "-moz-transform",
      transform: "transform"
    },
    properties = {},
    transform;

    for (transform in transforms) {
      if (transform in document.documentElement.style) {
        properties.js = transform;
        properties.css = transforms[transform];
      }
    }
    return properties.js && properties.css && properties;
  };

  features.transitionend = function() {
    var element = document.createElement("div"),
    transitions = {
      webkitTransition: "webkitTransitionEnd",
      oTransition: "oTransitionEnd otransitionend",
      mozTransition: "transitionend",
      transition: "transitionend"
    },
    transition;

    for (transition in transitions) {
      if (element.style[transition] != null) {
        return transitions[transition];
      }
    }
    return false;
  };

  features.touch = function() {
    var $window = $(window);
    $window = $(window);
    $window.on("touchstart", function firstTouch() {
      if (window.lp.supportsAvailable) {
        window.lp.supports.touch = true;
      } else {
        $(document).on(":featureDetect/available", function() {
          window.lp.supports.touch = true;
        });
      }
      $(document).trigger(":featureDetect/supportsTouch");
      return $window.off("touchstart", firstTouch);
    });
    return "ontouchstart" in window && "maybe";
  };

  features.requestAnimationFrame = function() {
    var _requestAnimationFrame = (function( win, t ) {
      return win["webkitR" + t] || win["r" + t] || win["mozR" + t] || win["msR" + t] || false;
    }(window, "equestAnimationFrame"));

    return _requestAnimationFrame;
  };

  features.cancelAnimationFrame = function() {
    var _cancelAnimationFrame = (function( win, t ) {
      return win["webkitC" + t] || win["c" + t] || win["mozC" + t] || win["msC" + t] || false;
    }(window, "ancelAnimationFrame"));

    return _cancelAnimationFrame;
  };

  for (feature in features) {
    camelFeature = ($.camelCase && $.camelCase(feature)) || feature;
    window.lp.supports[camelFeature] = features[feature]();

    if (window.lp.supports[camelFeature]) {
      document.documentElement.className += " supports-" + feature;
    } else {
      document.documentElement.className += " no-" + feature + "-support";
    }
  }

  if (!window.lp.supportsAvailable) {
    window.lp.supportsAvailable = true;
    $(document).trigger(":featureDetect/available");
  }

});
