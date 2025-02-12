// Add all scripts to the JS folder

// Creating a variable that will hold the object created by Leaflet.  The map object is an instance of a Leaflet map.
// L.map() is the function that create the instance of the Leafelt map. 'mapid' is the identifier of the HTML element (div) that will hold the map in index.html.
// .setView() sets the coordinates and zoomlevel of the map object.
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

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


// Add marker, circle, polygon, and popup (same code as you provided)
// L.marker() is a Leaflet function used to create a marker on the map. A marker represents a point on the map at a specific latitude and longitude.
var marker = L.marker([51.5, -0.09]).addTo(mymap); 
// L.circle() is a Leaflet method used to create a circle at a specific geographic location on the map.
// radius: 500: This sets the radius of the circle to 500 meters.
var circle = L.circle([51.508, -0.11], { color: 'red', fillColor: '#f03', fillOpacity: 0.5, radius: 500 }).addTo(mymap);
// No color is specified for the polygon, so Leaflet assigns it by default.
var polygon = L.polygon([[51.509, -0.08], [51.503, -0.06], [51.51, -0.047]]).addTo(mymap);

// bindPopup(): This method is used to attach a popup to the marker. The popup is the content that will appear when the marker is clicked.
// .openPopup(), the popup is opened automatically when the marker is placed on the map.
marker.bindPopup("<strong>Hello world!</strong><br />I am a popup.").openPopup();
// Trying to get this popup and the L.popup() to open, but not working!
/*
setTimeout(function() {
    marker.openPopup();
}, 100);  // Wait 100ms before opening the popup
*/
// bindPopup(): This method is used to attach a popup to the circle. The popup contains the content that will be displayed when the circle is clicked by the user.
circle.bindPopup("I am a circle.");
// Same as above.
polygon.bindPopup("I am a polygon.");

// L.popup(): This creates a new popup instance. This popup can be positioned anywhere on the map and can contain content such as text, images, or HTML elements. 
// Unlike bindPopup() (which is used to attach a popup to a specific map element), L.popup() creates a floating popup that is independent of any map object.
var popup = L.popup()
    .setLatLng([51.51, -0.09]) //51.515046, -0.090809
    .setContent("I am a standalone popup.")
    // .openOn(mymap) opens the popup at the given latitude/longitude (e.latlng) on the map.
    .openOn(mymap);

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




/*
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

// Add OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(mymap);

// Add marker, circle, polygon, and popup
var marker = L.marker([51.5, -0.09]).addTo(mymap);

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);

marker.bindPopup("<strong>Hello world!</strong><br />I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

// Standalone popup
var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);

// Function to show popup when clicking on the map
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);
*/

