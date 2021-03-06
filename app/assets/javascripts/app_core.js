require([ "jquery" ], function($) {

  "use strict";

  require([
    "lib/core/base",
    "lib/page/scroll_perf",
    "flamsteed",
    "lib/components/toggle_active",
    "trackjs",
    "polyfills/function_bind",
    "polyfills/xdr"
  ], function(Base, ScrollPerf, Flamsteed, ToggleActive) {

    $(function() {

      var secure = window.location.protocol === "https:";

      new Base({ secure: secure });
      new ScrollPerf;
      new ToggleActive;

      // Currently we can"t serve Flamsteed over https because of f.staticlp.com
      // https://trello.com/c/2RCd59vk/201-move-f-staticlp-com-off-cloudfront-and-on-to-fastly-so-we-can-serve-over-https
      if (!secure) {
        if (window.lp.getCookie) {
          window.lp.fs = new Flamsteed({
            events: window.lp.fs.buffer,
            u: window.lp.getCookie("lpUid")
          });
        }

        require([ "sailthru" ], function() {
          window.Sailthru.setup({ domain: "horizon.lonelyplanet.com" });
        });
      }

    });

  });
});
