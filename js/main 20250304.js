/* LT100 MTB w/ Propportional Symbols*/

// Global Variables
var mymap; // Creating a variable that will hold the ma[ object created by Leaflet.  The map object is an instance of a Leaflet map.
let minValue;  // Global minValue variable, in this case is 0.72, or about 45 mins to arrive at the 1st checkpoint.  Used incalcPropRadius.
let minRadius = 7; // Used in calcPropRadius, it ensures even the smallest market is visible. 
let dataStats = {};

// L.map() is the function that creates a vanilla instance of the Leafelt map and displays it on a webpage.
function createMap(){
    // 'mapid' is the identifier of the HTML element (div) that will hold this map image in index.html.
    mymap = L.map('mapid').setView([39.152,-106.338], 11); // .setView() sets the coordinates and zoomlevel of the map object.
    // L.tileLayer is a Leaflet method used to add a tile layer to the map.      
    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    }).addTo(mymap);
    // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    // }).addTo(mymap);
    // mymap.on('click', onMapClick); is setting up an event listener on the map object (mymap) for the click event.
    // This means that whenever the user clicks on the map, the onMapClick function will be called, and the popup will appear at the clicked location.
    mymap.on('click', onMapClick);  // 'click' is the type of event being listened for and onMapClick() is the function that is called when that happens. 
    getData(); // Calling the getData() function.
};


// Calculating the radius of the propotional symbols to be displayed on the map, based on attribute value (attValue).
function calcPropRadius(attValue) { // attvalue is the current data point that will influence the size of the symbol on the map.  In this case durations to arrive at each Checkpoint.
    // Calculating the radius based on the Sullivan Approximation(?)
    var radius = (1.0083 * Math.pow(attValue / minValue, 0.5715))*minRadius;  // The Math.pow() function is used to raise a number to a given power. Here, it's raising the ratio of attValue to minValue to the power of 0.5715.
    return radius;
}

// Find the minimum value from a set of numerical data across various features.
function calculateMinValue(data) {
// function calculateStats(data) {
    var allValues = []; // Initialize an empty array that will hold all numeric values that are > 0 and valid.
    for (var checkpoint of data.features) { // Iterate through each checkpoint (feature) in the dataset, in this case: Carter Summit, Powerline, etc.
        for (var year in checkpoint.properties) { // Iterate through each property in the checkpoint/feature (excluding the "Checkpoint" name), i.e., Carter Summit 2017, 2018...Powerline 2017, 2018, etc.
            if (year !== "Checkpoint") {  // Ignore the "Checkpoint" property (non-numeric), i.e., ignore the column header.
                var value = checkpoint.properties[year]; // The line is dynamically accessing the value associated with each year key, i.e., var value = checkpoint.properties["2017"]; which would set the value to 179.
                // Only add valid values to the array (greater than 0 and valid numbers)
                if (value && !isNaN(value) && value > 0) {  // Check if the value associated with the year is a valid, positive number.
                    allValues.push(value);  // If the value is valid, it gets added to the allValues array for further processing (like finding the minimum value).
                }
            }
        }
    }
    // Calculate the minimum value from the array of all values that we created above.
    // Why Use the Spread Operator Here?
        // Math.min() does not accept an array as a single argument; it requires separate numeric arguments.
        // By using the spread operator, you’re able to "unpack" the array into individual arguments that Math.min() can work with.
    var minValue = Math.min(...allValues);
    // Ensure minValue is not zero (or too small).  Meaning that times at the Start Line Checkpoint of 00:00:00 would be filtered out here! Need to to figure out how to add thestart line in.
    if (minValue === 0) {
        console.warn("Min value is 0! Defaulting to 1.");
        minValue = 1; // Set minValue to 1 to avoid division by zero
    }
    console.log('Calculated minValue:', minValue); // Debug log
    return minValue;

}

// Function to calculate the maximum value from an array
function calculateMaxValue(data) {
    const allValues = [];
    
    // Loop through the features to gather all the values
    data.features.forEach(feature => {
      const properties = feature.properties;
      
      // Add each year's value to the allValues array
      for (const year in properties) {
        if (year !== "Checkpoint") {  // Skip the Checkpoint property
          allValues.push(properties[year]);
        }
      }
    });
    
    // Calculate and return the maximum value
    return Math.max(...allValues);
  }
  
// Function to calculate the mean value from an array
function calculateMeanValue(data) {
const allValues = [];

// Loop through the features to gather all the values
data.features.forEach(feature => {
    const properties = feature.properties;
    
    // Add each year's value to the allValues array
    for (const year in properties) {
    if (year !== "Checkpoint") {  // Skip the Checkpoint property
        allValues.push(properties[year]);
    }
    }
});

// Calculate the sum of all values and return the mean
const sum = allValues.reduce((a, b) => a + b, 0);
return sum / allValues.length;
}



// Creating an independent, global function createPopupContent, which takes:
// Properties, i.e., Features: {2017: 0.87, 2018: 0.75, 2019: 0.88, 2022: 0.73, 2023: 0.72, 2024: 0.72, Checkpoint: 'Carter Summit Out'}
// Attributes: e.g., 2017, 2018, etc., which would return the approptiate duration value. 
function createPopupContent(feature, year) {
    // Log the first feature's properties object
    // Here are the properties fo the first feature: {2017: 0.87, 2018: 0.75, 2019: 0.88, 2022: 0.73, 2023: 0.72, 2024: 0.72, Checkpoint: 'Carter Summit Out'}
    console.log("Feature:", feature);

    // Log the value for the given attribute (e.g., "2017")
    console.log(`Value for ${year}:`, feature.properties[year]);

    let popupContent = "<p><b>Checkpoint:</b> " + feature.properties.Checkpoint + "</p>";
    popupContent += "<p><b>Elapsed time in " + year + ":</b> " + feature.properties[year] + " hours</p>";
    return popupContent;
}

// Get the first feature and pass the entire feature object (not just properties) and an attribute (e.g., "2017")
// createPopupContent(feature[0], "2017");







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
   
    // Default a year if the attribute is not provided
    // var defaultYear = "2017";

    // Set a default year if the attribute is not provided
    var year = attribute || "2017";  // Default to "2017" if the attribute is falsy (e.g., undefined or null)

    // Add popup content
    var popupContent = createPopupContent(feature, year);

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
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        onAdd: function () {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

            // ... initialize other DOM elements
            //create range input element (slider)
            container.insertAdjacentHTML('beforeend', '<input class="range-slider" type="range">')

            // Add step buttons
            container.insertAdjacentHTML('beforeend', '<button class="step" id="reverse">Previous</button>');
            container.insertAdjacentHTML('beforeend', '<button class="step" id="forward">Next</button>');
            
            //disable any mouse event listeners for the container
            L.DomEvent.disableClickPropagation(container);

            return container;
        }
    });
    mymap.addControl(new SequenceControl());    // add listeners after adding control
    
    // Set slider properties (max, min, value, step) after adding control
    var maxSliderValue = attributes.length - 1; // Max value is the number of attributes minus one (for 0-based indexing)
    document.querySelector(".range-slider").max = maxSliderValue;
    document.querySelector(".range-slider").min = 0;
    document.querySelector(".range-slider").value = 0;
    document.querySelector(".range-slider").step = 1;
    
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
            updateLegend(attributes[index]);
        });
    });
    
    // Handle slider input events
    document.querySelector('.range-slider').addEventListener('input', function() {
        var index = parseInt(this.value); // Get the index from slider
        console.log('Slider value (index):', index);  // You can remove this line later
        updatePropSymbols(attributes[index]);
        updateLegend(attributes[index]);
    });
    };


function createLegend(attributes, maxValue, meanValue) {
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function () {
            // Create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            // Create the legend with an initial year (first year in the attributes array)
            container.innerHTML = '<p class="temporalLegend">Duration in <span class="year">' + attributes[0] + '</span></p>';

            // Step 1: Start attribute legend SVG string
            var svgHeight = 105; // Height of the SVG container
            var svg = '<svg id="attribute-legend" width="260px" height="' + svgHeight + 'px">';

            // Define gradients for "Out" and "In" checkpoints
            svg += '<defs>';
            svg += '<linearGradient id="outGradient" x1="0%" y1="0%" x2="100%" y2="0%">';
            svg += '<stop offset="50%" style="stop-color:#FFFF00;stop-opacity:0.3" />'; // Left half: yellow
            svg += '<stop offset="50%" style="stop-color:#ff7800;stop-opacity:0.3" />'; // Right half: orange
            svg += '</linearGradient>';
            svg += '<linearGradient id="inGradient" x1="0%" y1="0%" x2="100%" y2="0%">';
            svg += '<stop offset="50%" style="stop-color:#FFFF00;stop-opacity:0.3" />'; // Left half: yellow
            svg += '<stop offset="50%" style="stop-color:#ff7800;stop-opacity:0.3" />'; // Right half: orange
            svg += '</linearGradient>';
            svg += '</defs>';

            // Array of circle names and their corresponding values
            var circles = [
                { id: "max", value: maxValue, label: "Max: " + maxValue.toFixed(2) + " Hours", type: "out" },
                { id: "mean", value: meanValue, label: "Mean: " + meanValue.toFixed(2) + " Hours", type: "in" },
                { id: "min", value: minValue, label: "Min: " + minValue.toFixed(2) + " Hours", type: "out" }
            ];

            // Step 2: Loop to add each circle and text to SVG string
            circles.forEach(function (circle, index) {
                // Calculate the radius for the current circle
                var radius = calcPropRadius(circle.value);

                // Calculate the cy value to center the circle vertically
                var cy = 78 - radius; // Adjust this value to maintain nesting

                // Determine the gradient based on the circle type ("out" or "in")
                var gradientId = circle.type === "out" ? "outGradient" : "inGradient";

                // Add the circle with the appropriate gradient fill
                svg += '<circle class="legend-circle" id="' + circle.id + 
                    '" fill="url(#' + gradientId + ')" stroke="#000000" cx="40" cy="' + cy + '" r="' + radius + '"/>';

                // Calculate the y position for the value label
                var textY = index * 25 + 25; // Evenly space labels vertically

                // Add a label for the circle value
                svg += '<text x="90" y="' + textY + '" font-size="12" font-weight="normal" text-anchor="start">' + circle.label + '</text>';
            });

            // Add "Out" label to the left of the largest circle
            var maxRadius = calcPropRadius(maxValue);
            var maxCy = 78 - maxRadius;
            svg += '<text x="0" y="' + (maxCy + -35) + '" font-size="10" font-weight="normal" text-anchor="start">Outbound</text>';

            // Add "In" label to the right of the largest circle
            svg += '<text x="40" y="' + (maxCy + 45) + '" font-size="10" font-weight="normal" text-anchor="start">Inbound</text>';

            // Close SVG string
            svg += "</svg>";

            // Add attribute legend SVG to container
            container.insertAdjacentHTML('beforeend', svg);

            return container;
        }
    });

    mymap.addControl(new LegendControl());
}
    
// function createLegend(attributes,maxValue, meanValue) {
//     var LegendControl = L.Control.extend({
//         options: {
//             position: 'bottomright'
//         },

//         onAdd: function () {
//             // Create the control container with a particular class name
//             var container = L.DomUtil.create('div', 'legend-control-container');

//             // Create the legend with an initial year (first year in the attributes array)
//             container.innerHTML = '<p class="temporalLegend">Duration in <span class="year">' + attributes[0] + '</span></p>';

//             // Step 1: Start attribute legend SVG string
//             var svgHeight = 135; // Height of the SVG container
//             var centerY = svgHeight / 2; // Vertical center of the SVG
//             var svg = '<svg id="attribute-legend" width="260px" height="80px">';

//             // Array of circle names and their corresponding values
//             var circles = [
//                 { id: "max", value: maxValue, label: "Max: " + maxValue + " Hours" },
//                 { id: "mean", value: meanValue, label: `Mean: ${meanValue.toFixed(2)} Hours` },
//                 { id: "min", value: minValue, label: "Min: " + minValue + " Hours" }
//             ];

//             // Step 2: Loop to add each circle and text to SVG string
//             circles.forEach(function (circle, index) {
//                 // Normalize the value relative to minValue
//                 var normalizedValue = circle.value / minValue;

//                 // Calculate the radius for the current circle
//                 var radius = calcPropRadius(circle.value);
//                 var cy = 78 - radius;  

//                 // Circle string
//                 // svg += '<circle class="legend-circle" id="' + circle.id + 
//                 //     '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="80" cy="' + (80 + index * 40) + '" r="' + radius + '"/>';
//                 // Circle string
//                 svg += '<circle class="legend-circle" id="' + circle.id + 
//                     '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="40" cy="' + cy + '" r="' + radius + '"/>';

//                 // Calculate the y position for the text label
//                 var textY = index * 25 + 25; // Evenly space labels vertically

//                 // Add a label for the circle
//                 svg += '<text x="90" y="' + textY + '" font-size="12" font-weight="normal" text-anchor="start">' + circle.label + '</text>';

//                 // // Add a label for the circle
//                 // svg += '<text x="100" y="' + cy + '" font-size="12" text-anchor="start">' + circle.label + '</text>';
//             });

//             // Close SVG string
//             svg += "</svg>";

//             // Add attribute legend SVG to container
//             container.insertAdjacentHTML('beforeend', svg);

//             return container;
//         }
//     });

//     mymap.addControl(new LegendControl());
// }






// The updateLegend function takes the current year (attributes[index]) and updates the <span class="year"> element in the legend.
function updateLegend(year) {
    // Find the legend's year span
    const yearSpan = document.querySelector('.year');
    
    // Update the text with the selected year
    yearSpan.textContent = year;
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
            // var popupContent = "<p><b>Checkpoint:</b> " + props.Checkpoint + "</p>"; // Corrected 'City' to 'Checkpoint'

            // Create popup content using the correct year (attribute) for the current layer
            var popupContent = createPopupContent(layer.feature, attribute); // Use the layer feature and attribute here

            // Add formatted attribute to popup content string
            // popupContent += "<p><b>Elapsed time in " + attribute + ":</b> " + props[attribute] + " hours</p>";

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
    // console.log("Attributes:", attributes);

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
            //calling our renamed function  
            // calculateStats(LT100MTBJSObject); 
            minValue = calculateMinValue(LT100MTBJSObject); // Assigning value returned by calculateMinValue to global variable minValue, above.  In this case 0.72 which is the the shortest time to the first Checkpoint.
            const maxValue = calculateMaxValue(LT100MTBJSObject); // Calculate max value
            const meanValue = calculateMeanValue(LT100MTBJSObject); // Calculate mean value

            // Log the calculated values for debugging
            console.log('Min Value:', minValue);
            console.log('Max Value:', maxValue);
            console.log('Mean Value:', meanValue);

            // Call function to create proportional symbols
            createPropSymbols(LT100MTBJSObject,attributes);
            createSequenceControls(attributes);

             // Call createLegend to add the legend control
             createLegend(attributes, maxValue, meanValue); // Here we call createLegend and pass the attributes

            // Log the attributes for debugging
            // console.log("Attributes:", attributes);  // Debugging line
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
                 layer.bindPopup('<h3>' + feature.properties.name + '</h3><p>' + feature.properties.desc + '</p>');
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





