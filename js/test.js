const data = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "2017": 0.87,
          "2018": 0.75,
          "2019": 0.88,
          "2022": 0.73,
          "2023": 0.72,
          "2024": 0.72,
          "Checkpoint": "Carter Summit Out"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-106.405794, 39.283689]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "2017": 1.83,
          "2018": 1.57,
          "2019": 2.05,
          "2022": 1.52,
          "2023": 1.48,
          "2024": 1.85,
          "Checkpoint": "Powerline Out"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-106.38713, 39.240504]
        }
      },
      // More features...
    ]
  };
  
  function createPopupContent(feature, year) {
    // Log the feature object (instead of properties)
    console.log("Feature:", feature);

    // Log the value for the specific year
    console.log(`Value for ${year}:`, feature.properties[year]);

    let popupContent = "<p><b>Checkpoint:</b> " + feature.properties.Checkpoint + "</p>";
    popupContent += "<p><b>Elapsed time in " + year + ":</b> " + feature.properties[year] + " hours</p>";
    return popupContent;
}

// Call the function for the first feature and use "2017" as the year
createPopupContent(data.features[1]);

  
<path class="leaflet-interactive" stroke="#fff" stroke-opacity="1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#ff7800" fill-opacity="0.3" fill-rule="evenodd" d="M428,613a21,21 0 1,0 42,0 a21,21 0 1,0 -42,0 "></path>




