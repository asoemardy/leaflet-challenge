var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


function createMap(earthquake){

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Light Map": lightmap
    };

    // Create an overlayMaps object to hold the earthquake layer
    var overlayMaps = {
        "Earthquakes": earthquake
    };

    // Create the map object with options
    var map = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 5,
        layers:[lightmap, earthquake]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);


    //Set up Legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function(){
        var div = L.DomUtil.create("div", "info legend");
        var magnitude = [0,1,2,3,4,5];
        var color = ['#84FA74','#F8F762','#FFDF94','#FFC131','#FF8C31','#FF4731'];
        label = [];

        for (var i = 0; i < magnitude.length; i++){
            div.innerHTML +=
                '<ul><i style="background:' + color[i] + '"></i> '+
                magnitude[i] + (magnitude[i+1] ? '&ndash;' + magnitude[i+1] + '<br>':'+') + '</ul>';
        }
        return div;
    };
    legend.addTo(map);
};

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    console.log(data.features[0].properties.mag);
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  function colorSelection(data){
      if (data.properties.mag < 1)
      {
          return "#84FA74";
      }
      else if (data.properties.mag < 2)
      {
          return "#F8F762";
      }
      else if (data.properties.mag <3)
      {
          return "#FFDF94"
      }
      else if (data.properties.mag <4)
      {
          return "#FFC131"
      }
      else if (data.properties.mag < 5)
      {
          return "#FF8C31" 
      }
      else
      {
          return "#FF4731"
      }
  };
  
    var geoJSONOption = {
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng){
        return L.circleMarker(latlng, geoJSONOption)
    },
    style: function(feature){
        return{radius: (feature.properties.mag * 3),
        color: colorSelection(feature)}
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
};