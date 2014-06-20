require 'spec_helper'

describe GoogleApiHelper do

  describe "Google JS API URI" do

    it "should return a uri to the goole js_api with the key set" do
      helper.google_js_api_uri.should eq "http://www.google.com/jsapi?key=ABQIAAAADUr8Vd6I7bfZ5k4c27F7KxR5cxXriAJsP5a75Cx4cnHTXGWMNxQxhFddQkNg7EBCllU86qgA_ugglg"
    end

    it "should allow you to set a different js_api key" do
      helper.google_js_api_uri('wombats!').should eq "http://www.google.com/jsapi?key=wombats!"
    end

  end

  describe "Google Maps URL" do

    let(:latitude) { 51.5073 }
    let(:longitude) { -0.1277 }

    it "should return a URL based on given coordinates" do
      helper.google_maps_url(latitude, longitude).should eq "https://www.google.com/maps/place/51.5073,-0.1277/"
    end

  end

  describe "Static Maps image SRC" do

    let(:properties) do
      {
        zoom: 15,
        scale: 2,
        width: 320,
        height: 240,
        marker: false,
        latitude: 51.5073,
        longitude: -0.1277
      }
    end

    it "should return static map SRC" do
      helper.google_static_map_src(properties, false).should eq "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyDbrk3TRuBye8K33U23ixYzmOpiLKZ58JY&size=320x240&zoom=15&scale=2&center=51.5073,-0.1277"
    end

  end

end
