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
    // console.log('Calculated radius for value', attValue, 'is', radius); // Debug log
    return radius;
}

// Calculate minimum value for data
function calculateMinValue(data) {
    var allValues = [];
    // Iterate through each checkpoint (feature)
    for (var checkpoint of data.features) {
        // Iterate through each property in the checkpoint (excluding the "Checkpoint" name)
        for (var year in checkpoint.properties) {
            if (year !== "Checkpoint") {  // Ignore the "Checkpoint" property (non-numeric)
                var value = checkpoint.properties[year];
                // Only add valid values to the array (greater than 0 and valid numbers)
                if (value && !isNaN(value) && value > 0) {
                    allValues.push(value);
                }
            }
        }
    }

    // Calculate the minimum value from the array of all values
    var minValue = Math.min(...allValues);

    // Ensure minValue is not zero (or too small)
    if (minValue === 0) {
        console.warn("Min value is 0! Defaulting to 1.");
        minValue = 1; // Set minValue to 1 to avoid division by zero
    }

    console.log('Calculated minValue:', minValue); // Debug log

    return minValue;
}


// New independent function to create the marker
function createMarker(feature, latlng, attribute) {
    var attValue = Number(feature.properties[attribute]);

    // Apply offset for specific checkpoints
    if (feature.properties["Checkpoint"] === "Powerline Out" || feature.properties["Checkpoint"] === "Twin Lakes Out") {
        latlng = [latlng.lat, latlng.lng - 0.001]; // Shift "Out" markers to the West (negative longitude)
    } else if (feature.properties["Checkpoint"] === "Powerline In" || feature.properties["Checkpoint"] === "Twin Lakes In") {
        latlng = [latlng.lat, latlng.lng + 0.001]; // Shift "In" markers to the East (positive longitude)
    } else if (feature.properties["Checkpoint"] === "Carter Summit Out" || feature.properties["Checkpoint"] === "Goat Trail Out") {
        latlng = [latlng.lat + 0.001, latlng.lng]; // Shift "Up" markers to the North (positive latitude)
    } else if (feature.properties["Checkpoint"] === "Carter Summit In" || feature.properties["Checkpoint"] === "Goat Trail In") {
        latlng = [latlng.lat - 0.001, latlng.lng]; // Shift "Down" markers to the South (negative latitude)
    }

    // Set the radius for the marker based on its attribute value
    var geojsonMarkerOptionsOut = {
        fillColor: "#ff7800", // Color for "Out" checkpoints
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.3,
        radius: calcPropRadius(attValue)
    };

    var geojsonMarkerOptionsIn = {
        fillColor: "#FFFF00", // Color for "In" checkpoints
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.3,
        radius: calcPropRadius(attValue)
    };

    // Choose the correct marker options based on "In" or "Out"
    var marker;
    if (feature.properties["Checkpoint"].includes("Out")) {
        marker = L.circleMarker(latlng, geojsonMarkerOptionsIn); // For "Out" checkpoints, use Yellow
    } else {
        marker = L.circleMarker(latlng, geojsonMarkerOptionsOut); // For "In" checkpoints, use Orange
    }

    // Add popup content
    var popupContent = "<p><b>Checkpoint:</b> " + feature.properties["Checkpoint"] + "</p>" +
                       "<p><b>2024 Elapsed Time:</b> " + feature.properties[attribute] + " hours (decimal format)" + "</p>";

    // Default a year if the attribute is not provided
    var defaultYear = "2017";
    var popupContent = "<p><b>Checkpoint:</b> " + feature.properties["Checkpoint"] + "</p>" +
                       "<p><b>" + defaultYear + " Elapsed Time:</b> " + feature.properties[defaultYear] + " hours (decimal format)" + "</p>";

    // Bind the popup with custom offset
    marker.bindPopup(popupContent, {
        offset: new L.Point(0, -geojsonMarkerOptionsOut.radius) // Adjust popup position with respect to the marker radius
    });

    return marker;
}

// Function to create proportional symbols
function createPropSymbols(data,attributes) {
    var attribute = attributes[0]; // Attribute to visualize with proportional symbols

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return createMarker(feature, latlng, attribute); // Call the createMarker function
        }
    }).addTo(mymap);
};

function createSequenceControls(attributes){
    // Create the slider element
    var slider = "<input class='range-slider' type='range'></input>";
    document.querySelector("#panel").insertAdjacentHTML('beforeend', slider);

    // Dynamically set the max value of the slider
    var maxSliderValue = attributes.length - 1; // Max value is the number of attributes minus one (for 0-based indexing)
    document.querySelector(".range-slider").max = maxSliderValue;
    document.querySelector(".range-slider").min = 0;
    document.querySelector(".range-slider").value = 0;
    document.querySelector(".range-slider").step = 1;

    // Add step buttons
    document.querySelector('#panel').insertAdjacentHTML('beforeend', '<button class="step" id="reverse">Previous</button>');
    document.querySelector('#panel').insertAdjacentHTML('beforeend', '<button class="step" id="forward">Next</button>');

    // Handle button click events
    document.querySelectorAll('.step').forEach(function(step) {
        step.addEventListener("click", function() {
            var index = parseInt(document.querySelector('.range-slider').value); // Get current index from slider

            // Increment or decrement based on the button clicked
            if (step.id == 'forward') {
                index = (index + 1) % attributes.length;  // Wrap around if past the last attribute
            } else if (step.id == 'reverse') {
                index = (index - 1 + attributes.length) % attributes.length;  // Wrap around if past the first attribute
            }

            // Update the slider and call the updatePropSymbols function
            document.querySelector('.range-slider').value = index;
            updatePropSymbols(attributes[index]);
        });
    });

    // Handle slider input events
    document.querySelector('.range-slider').addEventListener('input', function() {
        var index = parseInt(this.value); // Get the index from slider
        console.log('Slider value (index):', index);  // You can remove this line later
        updatePropSymbols(attributes[index]);
    });
}


//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(attribute){
    mymap.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            // Access feature properties
            var props = layer.feature.properties;

            // Log the value of the current attribute
            console.log('Updating symbol for attribute:', attribute, 'Value:', props[attribute]);

            // Update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            // Add checkpoint to popup content string
            var popupContent = "<p><b>Checkpoint:</b> " + props.Checkpoint + "</p>"; // Corrected 'City' to 'Checkpoint'

            // Add formatted attribute to popup content string
            popupContent += "<p><b>Elapsed time in " + attribute + ":</b> " + props[attribute] + " hours</p>";

            // Update popup content            
            var popup = layer.getPopup();
            if (popup) {
                popup.setContent(popupContent).update(); // Update the popup content with the new value
            }
        }
    });
};


//Above Example 3.10...Step 3: build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    // Push each attribute name into the attributes array
    for (var attribute in properties) {
        // Only take attributes that contain '20' or '19'
        if (attribute.indexOf("20") > -1 || attribute.indexOf("19") > -1) {
            attributes.push(attribute);
        }
    }

    // Log the attributes to verify
    console.log("Attributes:", attributes);

    return attributes;
};

// Step 2: Import GeoJSON data
function getData() {
    // Load the data
    fetch("data/LT100MTBnumberNoZero.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (LT100MTBJSObject) {
            var attributes = processData(LT100MTBJSObject);
            // Calculate minimum data value
            minValue = calculateMinValue(LT100MTBJSObject);
            // Call function to create proportional symbols
            createPropSymbols(LT100MTBJSObject,attributes);
            createSequenceControls(attributes);

            // Log the attributes for debugging
            console.log("Attributes:", attributes);  // Debugging line
        })
        .catch(function (error) {
            console.error("Error fetching LT100MTBnumberNoZero.geojson file:", error);

        });
    
     // Load the second GeoJSON file (LT100track.geojson)
     fetch("data/LT100track.js")
     .then(function (response) {
         return response.json();
     })
     .then(function (LT100trackJSObject) {
         // Add the second GeoJSON data (track) to the map
         L.geoJson(LT100trackJSObject, {
             style: function (feature) {
                 return {
                     color: "#D5006D", // Customize track line color (blue)
                     weight: 3,         // Customize line weight
                     opacity: 0.5       // Customize line opacity
                 };
             },
             onEachFeature: function (feature, layer) {
                 // Optional: Customize the popup content for the track feature
                 layer.bindPopup('<h3>' + feature.properties.name + '</h3><p>' + feature.properties.description + '</p>');
             }
         }).addTo(mymap);
     })
     .catch(function (error) {
         console.error("Error loading the LT100track.geojson file:", error);
     });

};

// Function to check if the feature is after the Columbine Checkpoint
function isAfterColumbineCheckpoint(feature) {
    const columbineCheckpoint = [-106.364561, 39.03295]; // Coordinates for Columbine Checkpoint
    const featureCoordinates = feature.geometry.coordinates[0]; // GeoJSON coordinates for the feature
    
    // Use longitude or latitude comparison to determine if the feature is after Columbine
    // For this example, we check if the longitude of the feature is smaller than that of Columbine
    // Adjust the comparison logic based on your race route (longitude/latitude)
    const isAfter = featureCoordinates[0] > columbineCheckpoint[0]; // Checks if the feature is "after" Columbine based on longitude
  
    return isAfter;
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





