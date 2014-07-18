// ------------------------------------------------------------------------------
//
// Timeago config with responsive strings
//
// ------------------------------------------------------------------------------

define([ "jquery", "lib/utils/debounce", "jtimeago" ], function($, debounce) {

  "use strict";

  function TimeAgo() {
    this.monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

    var calculateMonth = function(number, distanceMillis) {
          return this.monthNames[new Date(Date.now() - distanceMillis).getMonth()];
        },
        calculateYear = function(number, distanceMillis) {
          return new Date(Date.now() - distanceMillis).getFullYear().toString();
        };

    this.breakpoint = 768;
    this.refreshMillis = 60000;
    this.strings = {
      full: {
        suffixAgo: null,
        seconds: "just now",
        minute: "a minute ago",
        minutes: "%d minutes ago",
        hour: "an hour ago",
        hours: "%d hours ago",
        day: "a day ago",
        days: "%d days ago",
        month: "a month ago",
        months: "%d months ago",
        year: "a year ago",
        years: "%d years ago"
      },
      short: {
        suffixAgo: null,
        seconds: "%ds",
        minute: "%dm",
        minutes: "%dm",
        hour: "%dh",
        hours: "%dh",
        day: "%dd",
        days: "%dd",
        month: calculateMonth,
        months: calculateMonth,
        year: calculateYear,
        years: calculateYear
      }
    };

    this.init();
  }

  TimeAgo.prototype.init = function() {
    this._updateStrings();
    this._refreshOnInterval();
    this._refreshOnResize();
  };

  TimeAgo.prototype._isAboveBreakpoint = function() {
    return document.documentElement.clientWidth >= this.breakpoint;
  };

  TimeAgo.prototype._updateStrings = function() {
    $.extend($.timeago.settings.strings, this._isAboveBreakpoint() ? this.strings.full : this.strings.short);
    $("time.js-timeago").timeago();

    $.extend($.timeago.settings.strings, this.strings.full);
    $("time.js-timeago-full").timeago();
  };

  TimeAgo.prototype._refreshOnInterval = function() {
    var _this = this;
    // Had to disable original refresh function
    // in order to extend to proper strings 
    // basing on selectors in "_updateStrings"
    $.timeago.settings.refreshMillis = 0;
    setInterval(function() { _this._updateStrings(); }, this.refreshMillis);
  };

  TimeAgo.prototype._refreshOnResize = function() {
    $(window).resize(debounce(this._updateStrings.bind(this), 300));
  };

  return TimeAgo;
});
