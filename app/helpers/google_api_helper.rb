module GoogleApiHelper

  def google_js_api_uri(js_api_key = 'ABQIAAAADUr8Vd6I7bfZ5k4c27F7KxR5cxXriAJsP5a75Cx4cnHTXGWMNxQxhFddQkNg7EBCllU86qgA_ugglg')
    javascript_path "http://www.google.com/jsapi?key=#{js_api_key}"
  end

  def google_maps_url(latitude, longitude)
    "https://www.google.com/maps/place/#{latitude},#{longitude}/"
  end

  def google_static_map_src(properties, use_stylers=true)
    src = "https://maps.googleapis.com/maps/api/staticmap"
    src += "?key=AIzaSyDbrk3TRuBye8K33U23ixYzmOpiLKZ58JY"
    src += "&size=#{properties[:width]}x#{properties[:height]}"
    src += "&zoom=#{properties[:zoom]}&scale=#{properties[:scale]}"

    if properties[:marker]
      src+= "&markers=icon:#{CGI.escape(properties[:icon])}|#{properties[:latitude]},#{properties[:longitude]}"
    else
      src+= "&center=#{properties[:latitude]},#{properties[:longitude]}"
    end

    if use_stylers
      stylers = [
        "feature:water|element:geometry|color:0xcbdae7",
        "feature:landscape.man_made|element:geometry.fill|color:0xeff1f3",
        "feature:road|element:labels.text.stroke|color:0xffffff",
        "feature:road.arterial|element:geometry.fill|color:0xffffff",
        "feature:road.arterial|element:geometry.stroke|visibility:off",
        "feature:road.highway|element:geometry.fill|color:0x16c98d",
        "feature:road.highway|element:geometry.stroke|visibility:off",
        "feature:road.local|element:geometry.stroke|visibility:off",
        "feature:road.local|element:labels|visibility:off",
        "feature:poi.park|element:geometry.fill|color:0xc8e6aa",
        "feature:poi.school|element:geometry|color:0xdfdad3",
        "feature:poi.medical|element:geometry|color:0xfa5e5b"
      ]

      src+= "&style=#{stylers.join('&style=')}"
    end

    src
  end

end
