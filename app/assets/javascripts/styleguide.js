require([ "jquery" ], function($) {

  "use strict";

  require([
    "lib/page/swipe",
    "lib/utils/konami",
    "lib/page/scroll_perf",
    "lib/styleguide/charts",
    "lib/components/poi_map",
    "lib/components/poi_list",
    "lib/components/slider",
    "lib/components/toggle_active",
    "lib/components/select_group_manager",
    "lib/components/parallax",
    "lib/styleguide/svg",
    "lib/styleguide/copy",
    "lib/styleguide/swipe",
    "pickadate/lib/legacy",
    "pickadate/lib/picker",
    "lib/styleguide/konami",
    "lib/styleguide/colours",
    "lib/components/lightbox",
    "lib/styleguide/lightbox",
    "lib/styleguide/typography",
    "pickadate/lib/picker.date",
    "lib/utils/last_input_device",
    "lib/components/range_slider",
    "lib/styleguide/snippet-expand",
    "lib/styleguide/page_hopper"
  ], function(Swipe, Konami, ScrollPerf, Charts, POIMap, POIList, Slider, ToggleActive, SelectGroupManager) {

    new ScrollPerf();
    new ToggleActive();
    new Konami();
    new Swipe();
    new POIList(null, new POIMap);
    new Slider({ el: ".js-slider", assetReveal: true });
    new SelectGroupManager();
    new SelectGroupManager();

    var d = new Date();
    $(".input--datepicker").pickadate({
      min: [ d.getFullYear(), (d.getMonth() + 1), d.getDate() ]
    });

  });
});
