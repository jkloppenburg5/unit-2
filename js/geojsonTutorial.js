// ********************** Previous Quick Start Tutorial *************************

// Creating a variable that will hold the object created by Leaflet.  The map object is an instance of a Leaflet map.
// L.map() is the function that create the instance of the Leafelt map. 'mapid' is the identifier of the HTML element (div) that will hold the map in index.html.
// .setView() sets the coordinates and zoomlevel of the map object.
var mymap = L.map('mapid').setView([39.75, -104.99], 4);

// Add tile layer
// OpenStreetMap Example
// Adding a tile layer to the Leaflet map using the Leaflet method L.tileLayer().
// L.tileLayer is a Leaflet method used to add a tile layer to the map.   
// This is the URL template for fetching the tiles from OpenStreetMap.
// {s}: The subdomain part of the URL, which is typically used for load balancing (it could be a, b, or c to distribute the tile requests).
// {z}: The zoom level (how zoomed in or out the map is), where higher numbers mean closer zoom (more detail).
// {x} and {y}: These are the tile coordinates. As you move across the map, the tiles are loaded in grids, and {x} and {y} represent the position of the tile in that grid at a particular zoom level.
// Example of a complete tile URL: http://a.tile.openstreetmap.org/10/512/512.png
// 10 is the zoom level.
// 512 is the tile's x-coordinate.
// 512 is the tile's y-coordinate.
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
// The .addTo(mymap) part adds the tile layer to the map instance stored in the mymap variable.
// This method tells Leaflet to actually display the tile layer on the map.
}).addTo(mymap);


// Mapbox
/*
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'your.mapbox.project.id',
    accessToken: 'your.mapbox.public.access.token'
}).addTo(mymap);
*/


// L.popup(): This creates a new popup instance. This popup can be positioned anywhere on the map and can contain content such as text, images, or HTML elements. 
// Unlike bindPopup() (which is used to attach a popup to a specific map element), L.popup() creates a floating popup that is independent of any map object.

var popup = L.popup()
    // .setLatLng([39.75, -104.99]) //51.515046, -0.090809
    // .setContent("I am a standalone popup.")
    // .openOn(mymap) opens the popup at the given latitude/longitude (e.latlng) on the map.
    // .openOn(mymap);


// The onMapClick function takes an event object e as a parameter. 
// This event object contains information about the click, including the latitude and longitude of the point where the user clicked on the map.
function onMapClick(e) {
    popup
        // e.latlng represents the geographical coordinates (latitude and longitude) where the map was clicked.
        // .setLatLng(e.latlng) sets the popup's position to that location.  
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

// mymap.on('click', onMapClick); binds the onMapClick function to the map’s click event. 
// This means that whenever the user clicks on the map, the onMapClick function will be called, and the popup will appear at the clicked location.
mymap.on('click', onMapClick);




// ********************** Start of GeoJSON Tutorial *************************


var geojsonFeature = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
    
},
{
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}
];



// Creating a variable called myLines with a given type and coordinates.
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 39.75], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 39.75], [-110, 45], [-115, 55]]
}];

// Creating a variable that holds a style, 'myStyle.'
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

// Adding lines to the map, with the following format:
// L.geoJSON(geojsonFeature).addTo(map);
// With a style defined above, in myStyle.
L.geoJSON(myLines, {style: myStyle}).addTo(mymap);

// Creating a variable called states, that holds two Features.
let states = [
    {"type":"Feature",
    "properties":{"party":"Republican"},
    "geometry":{"type":"Polygon","coordinates":
    // The first level of the array ([]) represents the outer ring of the polygon.
    // The second level of the array ([]) contains pairs of coordinates that form the boundary of the polygon.
    // If your polygon has holes, you would add additional arrays for each hole (inner ring).
    [[[-104.05, 48.99],
    [-97.22,  48.98],
    [-96.58,  45.94],
    [-104.03, 45.94],
    [-104.05, 48.99]]]}},

    {"type":"Feature",
    "properties":{"party":"Democrat"},
    "geometry":{"type":"Polygon","coordinates":
    [[[-109.05, 41.00],
    [-102.06, 40.99],
    [-102.03, 36.99],
    [-109.04, 36.99],
    [-109.05, 41.00]]]}}
];

// L.geoJSON() is the Leaflet method to add GeoJSON data to the map, for example, points, lines and polygons.
L.geoJSON(states, // Passing the variable 'states,' which I defined above.
    {style: function(feature) // The Option here is Style, which receives a feature - in this case each of the states.
        // switch is a JavaScript control flow statement that allows you to check the value of an expression (in this case, feature.properties.party) 
        // and execute different blocks of code based on the value of that expression.
        // feature.properties.party is the value you're checking. 
        // It’s accessing the party property of each feature in the GeoJSON data. 
        // For example, if the party property is "Republican", it will execute the code inside the corresponding case.
        {switch(feature.properties.party) 
            {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat': return {color: "#0000ff"};
            }
        }
    }
).addTo(mymap);

// Creating a variable to hold stylistic inforamation related to a point.
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

// L.geoJSON() is the Leaflet method to add GeoJSON data to the map, for example, points, lines and polygons.
// In this case I am passing the variable from above, which is a point representing Coors Field.
L.geoJSON(geojsonFeature, {
    // pointToLayer is responsible for the representation of a point on the map.
    // By default, Leaflet will render points as simple markers, but here I am customizing to a circleMarker.
    // The callabck function accepts the Coors Field feature and its coordinates.
    pointToLayer: function (feature, latlng) {  
        // A customized circleMarker is returned that is stylized by geojsonMarkerOptions.
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(mymap);

// onEachFeature is a function that will be executed for each individual feature in the GeoJSON data. 
// In this case, there is only one feature (Coors Field), but the method is still used.
// function (feature, layer): This is the function that will be called for each feature in the GeoJSON. It takes two arguments:
// feature: This represents the current feature being processed (in this case, the GeoJSON object for Coors Field).
// layer: This is the Leaflet layer that corresponds to the current feature (i.e., the marker or shape that represents the feature on the map). 
// For a Point feature, it will be a marker.  Inside this function, you can define what to do for each feature. 
// In this case, we are binding a popup to the layer (marker or shape), which we will do next.
function forEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    // if (feature.properties && feature.properties.popupContent) // Checking if the feature has content is a nice-to-have, but will not crash without it.
    {
        // layer.bindPopup(): This method binds a popup to the layer (in this case, the Coors Field marker)
        // feature.properties.popupContent: This accesses the popupContent property from the properties object of the geojsonFeature. 
        // The value of popupContent is the HTML string 'This is where the Rockies play!'.
        layer.bindPopup(feature.properties.popupContent);
    }
}

// L.geoJSON() is the Leaflet method to add GeoJSON data to the map, for example, points, lines and polygons.
// geojsonFeature is the variable that holds the actual GeoJSON object that you want to display on the map. 
L.geoJSON(geojsonFeature, {
    // The option onEachFeature is first, which is a GeoJSON option.  This calls the forEachFeature which is a function.
    // Which binds a popup to a layer.
    onEachFeature: forEachFeature
}).addTo(mymap);


// ********* Or alternatively, to add a point with a manual or automatic popup **********

// Add GeoJSON feature to the map and open the popup immediately
/*
var geojsonLayer = L.geoJSON(geojsonFeature, {
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.popupContent).openPopup(); // Bind and open the popup immediately
    }
}).addTo(mymap);
*/

// Open the popup for the first (and only) layer after the GeoJSON is added
/*
setTimeout(function() {
    geojsonLayer.getLayers()[0].openPopup();  // Open popup for the first feature
}, 500);  // Delay of 500ms to ensure the map has finished adding the feature
*/

/*
// Add GeoJSON feature to the map and open the popup when clicked
// L.geoJSON() is the Leaflet method to add GeoJSON data to the map, for example, points, lines and polygons.
// geojsonFeature is the variable that holds the actual GeoJSON object that you want to display on the map. 
// In this case, it's a point feature representing Coors Field with a popupContent property.
var geojsonLayer = L.geoJSON(geojsonFeature, {
    // This part of the code tells Leaflet, "Take the geojsonFeature and add it to the map as a layer."
    // onEachFeature is a function that will be executed for each individual feature in the GeoJSON data. 
    // In this case, there is only one feature (Coors Field), but the method is still used.
    // function (feature, layer): This is the function that will be called for each feature in the GeoJSON. It takes two arguments:
    // feature: This represents the current feature being processed (in this case, the GeoJSON object for Coors Field).
    // layer: This is the Leaflet layer that corresponds to the current feature (i.e., the marker or shape that represents the feature on the map). 
    // For a Point feature, it will be a marker.  Inside this function, you can define what to do for each feature. 
    // In this case, we are binding a popup to the layer (marker or shape), which we will do next.
    onEachFeature: function (feature, layer) {
        // layer.bindPopup(): This method binds a popup to the layer (in this case, the Coors Field marker)
        // feature.properties.popupContent: This accesses the popupContent property from the properties object of the geojsonFeature. 
        // The value of popupContent is the HTML string 'This is where the Rockies play!'.
        layer.bindPopup(feature.properties.popupContent); // Bind and open the popup when clicked
    }
// .addTo(mymap): This method tells Leaflet to add the geojsonLayer (which now contains the GeoJSON data and associated popups) to the map stored in the mymap variable. 
// So, the GeoJSON feature (Coors Field) will appear on the map at the correct coordinates.
}).addTo(mymap);
*/


var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(mymap);