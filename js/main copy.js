/* LT100 MTB w/ Propportional Symbols*/

// Creating a variable that will hold the object created by Leaflet.  The map object is an instance of a Leaflet map.
var mymap; 
let minValue;
let minRadius = 7; 

function createMap(){
    // L.map() is the function that create the instance of the Leafelt map. 'mapid' is the identifier of the HTML element (div) that will hold the map in index.html.
    // .setView() sets the coordinates and zoomlevel of the map object.
    mymap = L.map('mapid').setView([39.152,-106.338], 11);
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


// Ensure that this function is defined before it is used
function calcPropRadius(attValue) {
    // No longer using minRadius, calculating radius directly based on the attribute value
    var radius = (1.0083 * Math.pow(attValue / minValue, 0.5715))*minRadius;
    console.log('Calculated radius for value', attValue, 'is', radius); // Debug log
    return radius;
}

// Calculate minimum value for data
function calculateMinValue(data) {
    var allValues = [];
    for (var city of data.features) {
        var value = city.properties["2024"];
        if (value && !isNaN(value) && value > 0) {
            allValues.push(value);
        }
    }
    var minValue = Math.min(...allValues);

    // Ensure minValue is not zero (or too small)
    if (minValue === 0) {
        console.warn("Min value is 0! Defaulting to 1.");
        minValue = 1; // Set minValue to 1 to avoid division by zero
    }

    console.log('Calculated minValue:', minValue); // Debug log

    return minValue;
}

// Step 3: Add circle markers for point features to the map
function createPropSymbols(data) {
    var attribute = "2024"; // Attribute to visualize with proportional symbols

    // Create marker options
    var geojsonMarkerOptionsOut = {
        fillColor: "#ff7800", // Color for "Out" checkpoints
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.3,
        radius: 8
    };

    var geojsonMarkerOptionsIn = {
        fillColor: "#FFFF00", // Color for "In" checkpoints
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.3,
        radius: 8
    };

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            var attValue = Number(feature.properties[attribute]);

            // Apply offset for specific checkpoints (Out being to the West, In being to the East)
            if (feature.properties["Checkpoint"] === "Powerline Out" || feature.properties["Checkpoint"] === "Twin Lakes Out") {
                latlng = [latlng.lat, latlng.lng - 0.005]; // Shift "Out" markers to the West (negative longitude)
            } else if (feature.properties["Checkpoint"] === "Powerline In" || feature.properties["Checkpoint"] === "Twin Lakes In") {
                latlng = [latlng.lat, latlng.lng + 0.005]; // Shift "In" markers to the East (positive longitude)
            } else if (feature.properties["Checkpoint"] === "Carter Summit Out" || feature.properties["Checkpoint"] === "Goat Trail Out") {
                latlng = [latlng.lat + 0.005, latlng.lng]; // Shift "Up" markers to the North (positive latitude)
            }
            else if (feature.properties["Checkpoint"] === "Carter Summit In" || feature.properties["Checkpoint"] === "Goat Trail In") {
                latlng = [latlng.lat - 0.005, latlng.lng]; // Shift "Down" markers to the South (negative latitude)
            }

            // Set the radius for the marker based on its attribute value
            geojsonMarkerOptionsOut.radius = calcPropRadius(attValue);
            geojsonMarkerOptionsIn.radius = calcPropRadius(attValue);

            // Choose the correct marker options based on "In" or "Out"
            if (feature.properties["Checkpoint"].includes("Out")) {
                return L.circleMarker(latlng, geojsonMarkerOptionsIn); // For "Out" checkpoints, use Yellow (geojsonMarkerOptionsIn)
            } else {
                return L.circleMarker(latlng, geojsonMarkerOptionsOut); // For "In" checkpoints, use Orange (geojsonMarkerOptionsOut)
            }
        }
    }).addTo(mymap);
};


// Step 2: Import GeoJSON data
function getData() {
    // Load the data
    fetch("data/LT100MTBnumberNoZero.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (LT100MTBJSObject) {
            // Calculate minimum data value
            minValue = calculateMinValue(LT100MTBJSObject);
            // Call function to create proportional symbols
            createPropSymbols(LT100MTBJSObject);
        })
};

// Wait for the HTML to be finished loading before adding anything to the map.
// JavaScript Execution Flow:
// When the browser loads a webpage, it processes the HTML and then loads and executes the JavaScript.
// The document.addEventListener('DOMContentLoaded', createMap) is telling the browser to execute the createMap() function only after the HTML is fully loaded.
// If you put document.addEventListener('DOMContentLoaded', createMap) before the createMap() function definition, it will try to reference createMap() before that 
// function has been defined, which would lead to an error because the function doesn't exist yet at the point the event listener is registered.
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




