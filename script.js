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
    const point1 = turf.point([52.5123075107294, 13.327030194633902]);
    const point2 = turf.point([52.514512512991615, 13.350112104633283]);
    const options = { units: 'kilometers' };
    const distance = turf.distance(point1, point2, options);
    console.log(`Distance between points: ${distance} kilometers`);

    // Add another marker and a polyline to show the distance
    const marker2 = L.marker([52.514512512991615, 13.350112104633283]).addTo(map);
    const latlngs = [[52.514512512991615, 13.350112104633283], [52.5123075107294, 13.327030194633902]];
    const polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);
    marker2.bindPopup(`Distance to other marker: ${distance.toFixed(2)} km`).openPopup();

    // Add buffer example
    //const buffered = turf.buffer(point1, 0.5, { units: 'kilometers' });
    //const bufferedGeoJson = L.geoJSON(buffered, { color: 'green' }).addTo(map);

    // Add centroid example
    const points = turf.featureCollection([point1, point2]);
    const centroid = turf.centroid(points);
    L.marker([centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]])
    .addTo(map)
    .bindPopup('Centroid of points')
    .openPopup();

    // Add random points example
    const randomPoints = turf.randomPoint(5, { bbox: [52.5, 13.3, 52.11, 13.9] });
    const randomPointsLayer = L.geoJSON(randomPoints).addTo(map);
});


