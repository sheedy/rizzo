define(function() {

  "use strict";

  if (!document.addEventListener) { return false; }

  var first = {},
      listener = document.getElementById("js-row--content");

  function updateClass(deviceType) {
    var match = document.documentElement.className.match(/last-input-(\w+)/),
        oldClass = match && match[0],
        oldDevice = match && match[1],
        event;

    if (oldDevice == deviceType) { return; }

    if (match && oldClass) {
      document.documentElement.className = document.documentElement.className.replace(oldClass, "last-input-" + deviceType);
    } else {
      document.documentElement.className += " last-input-" + deviceType;
    }

    if (!listener || !first[deviceType]) { return; }

    first[deviceType] = true;

    event = document.createEvent("CustomEvent");
    event.initCustomEvent(":device/" + deviceType);
    listener.dispatchEvent(event);
  }

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
    event.pointerType && updateClass(event.pointerType);
  });

});
