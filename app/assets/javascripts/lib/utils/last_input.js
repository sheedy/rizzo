define(function() {

  "use strict";

  if (!document.addEventListener) { return false; }

  var updateClass;

  updateClass = function(deviceType) {
    var match = document.documentElement.className.match(/last-input-(\w+)/),
        oldClass = match && match[0],
        oldDevice = match && match[1];

    if (oldDevice == deviceType) { return; }

    if (match && oldClass) {
      document.documentElement.className = document.documentElement.className.replace(oldClass, "last-input-" + deviceType);
    } else {
      document.documentElement.className += " last-input-" + deviceType;
    }
  };

  document.addEventListener("mousemove", function() {
    updateClass("mouse");
  });

  document.addEventListener("touchmove", function() {
    updateClass("touch");
  });

  document.addEventListener("keyup", function() {
    updateClass("keyboard");
  });

  document.addEventListener("pointermove", function(event) {
    event.pointerType && (updateClass(event.pointerType));
  });

});
