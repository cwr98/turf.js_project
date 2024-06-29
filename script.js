// script.js

document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([52.508, 13.336], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Function to style points
    function pointStyle(feature) {
        return {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    }

    // Function to style lines
    function lineStyle(feature) {
        return {
            color: "#0000ff",
            weight: 2,
            opacity: 1
        };
    }

    // Function to handle each feature
    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
        }
    }

     var geojsonLayer = new L.GeoJSON.AJAX("zoo_points_working.geojson", {
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    });
    geojsonLayer.addTo(map);
    
    var geojsonLayer = new L.GeoJSON.AJAX("zoo_paths_working.geojson", {
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    });
    geojsonLayer.addTo(map);

    // Load GeoJSON for lines
    var linesLayer = new L.GeoJSON.AJAX("zoo_paths_working.geojson", {
        style: lineStyle,
        onEachFeature: onEachFeature
    });
    linesLayer.addTo(map);
    
});


