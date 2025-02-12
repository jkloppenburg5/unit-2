/* Map of GeoJSON data from MegaCities.geojson */

// Creating a variable that will hold the object created by Leaflet.  The map object is an instance of a Leaflet map.
var mymap; 


function createMap(){
    // L.map() is the function that create the instance of the Leafelt map. 'mapid' is the identifier of the HTML element (div) that will hold the map in index.html.
    // .setView() sets the coordinates and zoomlevel of the map object.
    mymap = L.map('mapid').setView([39.173,-106.338], 11);
    // L.tileLayer is a Leaflet method used to add a tile layer to the map.      
    
    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    }).addTo(mymap);

    // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    // }).addTo(mymap);

    // mymap.on('click', onMapClick); binds the onMapClick function to the map’s click event. 
    // This means that whenever the user clicks on the map, the onMapClick function will be called, and the popup will appear at the clicked location.
    mymap.on('click', onMapClick);

    getData();
};


// Function that runs for each feature in the GeoJSON data
function onEachFeature(feature, layer) {
    // Initialize an empty string to build the content for the popup
    var popupContent = "";

    // Check if the feature has properties (in case it's missing properties)
    if (feature.properties) {
        // Loop through each property in the 'properties' object of the feature
        for (var property in feature.properties){
            // Append each property name and its value as a paragraph to the popup content
            // "<p>" creates a new paragraph in HTML
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        
        // Bind the generated popup content to the layer
        // 'bindPopup' adds the popup content to the feature layer
        layer.bindPopup(popupContent);
    }
};


// Function to retrieve the GeoJSON data and add it to the map
function getData(){ 
    // Load the GeoJSON data from the specified file path
    fetch("data/MegaCitiesSavedinGeoJSON.geojson")
        .then(function(response){
            // First .then: Parse the JSON response from the fetch request
            // The response is a stream, so we need to call .json() to get the actual data in JSON format
            return response.json();
        })
        .then(function(json){
            // Second .then: After the data is parsed, we create a GeoJSON layer with the parsed data
            // 'L.geoJSON()' creates a new Leaflet GeoJSON layer from the json data
            // We pass an option 'onEachFeature' to bind a popup for each feature in the GeoJSON
            L.geoJSON(json, {onEachFeature: onEachFeature})
                .addTo(mymap); // Add the GeoJSON layer to the map
        })
        .catch(function(error) {  // Catch any errors that happen during the fetch request or data processing
            console.error('Error loading GeoJSON data:', error); // Log the error to the console
        });
};

// Wait for the HTML to be finished loading before adding anything to the map.
document.addEventListener('DOMContentLoaded',createMap)

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

