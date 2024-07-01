// script.js

document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([52.508, 13.336], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Define GeoJSON data holders
    var entrancePoints;
    var pathLines;

    // Define styles for lines and points
    var lineStyle = {
        "color": "#0000FF",
        "weight": 4,
        "opacity": 0.65
    };
    var pointStyle = {
        radius: 5,
        fillColor: "#FF0000",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    // Create a feature group for storing the lines
    var linesLayer = L.featureGroup();

    // Load GeoJSON for point
    var entrancesLayer = new L.GeoJSON.AJAX("zoo_points_working.geojson", {
        onEachFeature: function (feature, layer) {
            if (!entrancePoints) entrancePoints = feature;
            // Add entrance points to map
            L.geoJson(feature, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, pointStyle);
                }
            }).addTo(map);
        },
        onError: function(err) {
            console.error('Error loading entrances.geojson:', err);
        } 
    });    
    
    // Load GeoJSON for path
    var pathsLayer  = new L.GeoJSON.AJAX("zoo_paths_working.geojson", {
        onEachFeature: function (feature, layer) {
            if (!pathLines) pathLines = feature;
            // Add path lines to map
            L.geoJson(feature, {
                style: lineStyle
            }).addTo(map);
        },
        onError: function(err) {
            console.error('Error loading zoo_paths_working.geojson:', err);
        }
    });
    //pathsLayer.addTo(map);

    // Function to find the nearest point on the path for each entrance
    function findNearestPoints() {
        console.log('Finding nearest points...');
        // Loop through each entrance point
        if (entrancePoints && pathLines) {
            entrancePoints.features.forEach(function (entrancePoint) {
                // Find the nearest point on the path lines
                var nearest = turf.nearestPointOnLine(pathLines, entrancePoint);
                console.log("yionk")
                // Create a GeoJSON LineString from entrance point to nearest point on path
                var lineCoordinates = [
                    [entrancePoint.geometry.coordinates[0], entrancePoint.geometry.coordinates[1]],
                    [nearest.geometry.coordinates[0], nearest.geometry.coordinates[1]] // Corrected variable name
                ];

                var lineString = {
                    "type": "LineString",
                    "coordinates": lineCoordinates
                };

                // Add the line to the map
                var lineLayer = L.geoJson(lineString, {
                    style: {
                        color: "#FF0000",
                        weight: 20,
                        opacity: 1
                    }
                });
                linesLayer.addLayer(lineLayer); // Add line to feature group
            });
            // Add the feature group with all lines to the map
            linesLayer.addTo(map);
            console.log('All nearest points processed.');
            } else {
                console.log('GeoJSON data for entrances or paths is missing.');
            }
        }

    // Wait until both GeoJSON files are loaded
    map.on('layeradd', function () {
        console.log('Layer added to map');
        if (entrancePoints && pathLines) {
            findNearestPoints();
        }
    });
});


