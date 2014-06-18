define([
  "jquery",
  "lib/components/poi_map",
  "lib/components/map_styles",
  "polyfills/function_bind"
], function($, POIMap, MapStyles) {

  "use strict";

  var defaults = {
    pois: ".js-poi",
    el: ".js-poi-list"
  };

  function POIList(args, poiMap) {
    this.poiMap = poiMap || new POIMap;
    this.config = $.extend({}, defaults, args);

    this.$el = $(this.config.el);
    this.$pois = this.$el.find(this.config.pois);

    this.poisData = [];
    this.poisMarkers = [];
    this.markerImages = {};

    if (this.$pois.length) {
      this._init();
    }
  }

  POIList.prototype._init = function() {
    if (this.poiMap.isOpen) {
      this._build();
    } else {
      this.poiMap.$el.on(":map/open", this._build.bind(this));
    }
  };

  POIList.prototype._build = function() {
    for (var i = 0, len = this.$pois.length; i < len; i++) {
      this.poisData.push(this.$pois.eq(i).data());
    }

    if (this.poiMap.marker) {
      this.poiMap.marker.setIcon(this._createMarkerImage(null, "dot"));
    }

    this._addPOIs();
  };

  POIList.prototype._getIcon = function( topic, size ) {
    if (topic === "lodging"){
      topic = "hotel";
    }

    if (this.markerImages[topic + "-" + size]){
      return this.markerImages[topic + "-" + size];
    } else {
      return this.markerImages[topic + "-" + size] = this._createMarkerImage(topic, size);
    }
  };

  POIList.prototype._createMarkerImage = function(topic, size) {
    var markerStyle = MapStyles.markerStyles(topic, size);

    return {
      url: MapStyles.markerBackgroundImage,
      size: new window.google.maps.Size(markerStyle.size.width, markerStyle.size.height),
      origin: new window.google.maps.Point( -markerStyle.position.x, -markerStyle.position.y )
    };
  };

  POIList.prototype._addPOIs = function(data) {
    data = data || this.poisData;

    for (var i = 0, len = data.length; i < len; i++){
      setTimeout(this._createMarker.bind(this, i), (i + 1) * 150);
    }

    setTimeout(this._listen.bind(this), 200);
  };

  POIList.prototype._createMarker = function(i) {
    var marker = new window.google.maps.Marker({
      icon: this._getIcon( this.poisData[ i ].topic, "small" ),
      animation: window.google.maps.Animation.DROP,
      position: new window.google.maps.LatLng(
                  this.poisData[ i ].latitude,
                  this.poisData[ i ].longitude ),
      map: this.poiMap.map
    });

    this.poisMarkers.push( marker );
  };

  POIList.prototype._listen = function() {
    this.$pois.on("click", function(event) {
      this.selectPOI( $(event.target).closest("li").index() );
    }.bind(this));

    for (var i = 0, len = this.poisMarkers.length; i < len; i++){
      window.google.maps.event.addListener(this.poisMarkers[i], "click", this.selectPOI.bind(this, i));
    }
  };

  POIList.prototype.resetSelectedPOI = function() {
    this.$el.find(".is-selected").removeClass("is-selected");
    for (var i = 0, len = this.poisMarkers.length; i < len; i++){
      this.poisMarkers[ i ].setIcon(this._getIcon( this.poisData[ i ].topic, "small" ));
    }
  };

  POIList.prototype.selectPOI = function(i) {
    var $poiItem = this.$pois.eq(i),
        poiData = this.poisData[ i ],
        poiMarker = this.poisMarkers[ i ];

    this.resetSelectedPOI();

    $poiItem.addClass("is-selected");
    poiMarker.setIcon( this._getIcon( poiData.topic, "large" ) );

    // Take into account the list overlay
    this.poiMap.map.setCenter( poiMarker.getPosition() );
    this.poiMap.map.panBy( this.poiMap.$container.width() / 6, 0 );
  };

  return POIList;
});
