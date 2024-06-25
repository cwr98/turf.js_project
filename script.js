// Define the projections
const PSEUDO_MERC_DATUM = 'EPSG:3857';
const WGS84_DATUM = 'EPSG:4326';

// Coordinate conversion functions
const xyCoordsToLatLong = (xy_pair) => {
    return proj4(PSEUDO_MERC_DATUM, WGS84_DATUM, xy_pair);
}

const latLongCoordsToXY = (latlong_pair) => {
    return proj4(WGS84_DATUM, PSEUDO_MERC_DATUM, latlong_pair);
}

// Wrapper functions for Turf.js
const turfBufferWithConversion = (point, radius, options) => {
    // Convert coordinates to WGS84 for Turf.js
    const pointWGS84 = {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: xyCoordsToLatLong(point.geometry.coordinates)
        },
        properties: point.properties
    };

    // Perform the buffer operation
    const bufferedWGS84 = turf.buffer(pointWGS84, radius, options);

    // Convert the resulting buffered coordinates back to Pseudo-Mercator
    const buffered = {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: bufferedWGS84.geometry.coordinates.map(ring =>
                ring.map(coord => latLongCoordsToXY(coord))
            )
        },
        properties: bufferedWGS84.properties
    };
    console.log("Buffered result:", buffered);
    return buffered;
}

// script.js

document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([52.513581140378086, 13.33484121096129], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker to the map
    const marker = L.marker([52.5123075107294, 13.327030194633902]).addTo(map);
    marker.bindPopup('A simple marker.').openPopup();
    
    // Example Turf.js feature: calculate the distance between two points
    const point1Coords = [52.5123075107294, 13.327030194633902]; //[latitude, longitude]
    const point2Coords = [52.514512512991615, 13.350112104633283]; //[latitude, longitude]
    const point1 = turf.point(xyCoordsToLatLong(point1Coords)); // Convert to WGS84 for Turf.js
    const point2 = turf.point(xyCoordsToLatLong(point2Coords)); // Convert to WGS84 for Turf.js
    const options = { units: 'kilometers' };
    const distance = turf.distance(point1, point2, options);
    console.log(`Distance between points: ${distance} kilometers`);

    // Add another marker and a polyline to show the distance
    const marker2 = L.marker([52.514512512991615, 13.350112104633283]).addTo(map); 
    const latlngs = [[52.514512512991615, 13.350112104633283], [52.5123075107294, 13.327030194633902]];
    const polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);
    marker2.bindPopup(`Distance to other marker: ${distance.toFixed(2)} km`).openPopup();
    
    // Add random points example
    const randomPoints = turf.randomPoint(5, { bbox: [13.3, 52.5, 13.9, 52.11] });
    const randomPointsLayer = L.geoJSON(randomPoints).addTo(map);

    // Add centroid example
    const points = turf.featureCollection([point1, point2]);
    const centroid = turf.centroid(points);
    L.marker([centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]])
    .addTo(map)
    .bindPopup('Centroid of points')
    .openPopup();

    // Add buffer example
    const buffered = turf.buffer(point1, 0.5, { units: 'kilometers' });
    const bufferedGeoJson = L.geoJSON(buffered, { color: 'green' }).addTo(map);
});


