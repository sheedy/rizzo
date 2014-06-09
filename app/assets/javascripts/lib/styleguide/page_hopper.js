require([ "jquery", "lib/components/lightbox" ], function($, LightBox) {

  "use strict";

  var $el = $("body"),
      linkClass = "js-page-hopper-opener",
      $link = $("<a class='" + linkClass + "' />"),
      lightbox, isOpen;

  $el
    .on("keydown", function(e) {
      if (isOpen) { return; }

      // 75 =k
      if ( e.keyCode == 75 && (e.metaKey || e.ctrlKey) ) {
        $link.trigger("click");
        e.preventDefault();
      }
    })
    .on(":lightbox/open", function(event, data) {
      if (data.opener == $link[0]) {
        isOpen = true;
        $el.trigger(":lightbox/renderContent", "<div class='card--layer__content'></div>");
      }
    })
    .on(":flyout/close", function() {
      isOpen = false;
    })
    .append($link);

  lightbox = new LightBox({
    $el: "body",
    $opener: "." + linkClass
  });
});
