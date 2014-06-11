define([
  "jquery",
  "lib/components/poi_map",
  "lib/components/map_styles",
  "polyfills/function_bind"
], function($, POIMap, MapStyles) {

  "use strict";

  var
    poisData,
    poisMarkers,
    defaults = {
      el: ".js-poi-list",
      pois: ".js-poi"
    };

  function POIList( args ) {
    poisMarkers = poisData = [];

    this.config = $.extend({}, defaults, args);

    if (!this.poiMap){
      this.poiMap = new POIMap();
      this.poiMap.$el.on(":map/open", this._build.bind(this));
    } else {
      this._build();
    }
  }

  POIList.prototype._build = function() {
    this.markerImages = {};

    if ( this.poiMap.$container.data().pois ){
      this._addPOIs();
    }

    this.$el = $(this.config.el);
    this.$pois = this.$el.find( this.config.pois );
    setTimeout(this._listen.bind(this), 200);

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

  POIList.prototype._addPOIs = function( event, pois ) {
    poisData = pois || this.poiMap.$container.data().pois;

    for ( var i = 0, len = poisData.length; i < len; i++ ){
      setTimeout(this._createMarker.bind(this, i), (i + 1) * 150);
    }
  };

  POIList.prototype._createMarker = function(iterator) {
    var marker = new window.google.maps.Marker({
      icon: this._getIcon( poisData[ iterator ].topic, "small" ),
      animation: window.google.maps.Animation.DROP,
      position: new window.google.maps.LatLng(
                  poisData[ iterator ]["location-latitude"],
                  poisData[ iterator ]["location-longitude"] ),
      map: this.poiMap.gmap
    });

    poisMarkers.push( marker );
  };

  POIList.prototype._listen = function() {

    this.$pois.on("click", function(event) {
      this._selectPOI( $(event.target).closest("li").index() );
    }.bind(this));

    for (var i = 0, len = poisMarkers.length; i < len; i++){
      window.google.maps.event.addListener(poisMarkers[i], "click", this._selectPOI.bind(this, i));
    }

  };

  POIList.prototype._resetSelectedPOI = function() {
    this.$el.find(".is-selected").removeClass("is-selected");
    for (var i = 0, len = poisMarkers.length; i < len; i++){
      poisMarkers[ i ].setIcon(this._getIcon( poisData[ i ].topic, "small" ));
    }
  };

  POIList.prototype._selectPOI = function( poiIndex ) {
    var $poiItem = this.$el.find("[data-slug='" + poisData[ poiIndex ].slug + "']"),
        poiData = poisData[ poiIndex ],
        poiMarker = poisMarkers[ poiIndex ];

    this._resetSelectedPOI();

    $poiItem.addClass("is-selected");
    poiMarker.setIcon( this._getIcon( poiData.topic, "large" ) );
    this.poiMap.gmap.setCenter( poiMarker.getPosition() );
    this.poiMap.gmap.panBy( this.poiMap.$container.width() / 6, 0 );
  };

  return POIList;
});
