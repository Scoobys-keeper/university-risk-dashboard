// src/App.js

import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import geojsonData from './data/UNI_shpfile_displayTrial.geojson';
import './App.css';

// Set your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1Ijoic2Nvb2J5ZG9vMjAyNCIsImEiOiJjbTQ4bHgyN2QwMHdrMnJzaDZxcGg1OXE3In0.uvYumaLxKLGsHPNrfYhPeg';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Update these coordinates to center over the UK
  const lng = -1.1743; // Longitude for the approximate center of the UK
  const lat = 52.3555; // Latitude for the approximate center of the UK
  const zoom = 5;      // Adjust zoom level to fit the UK in view

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    // Add navigation controls (optional)
    map.current.addControl(new mapboxgl.NavigationControl());

    // Add GeoJSON data as a source and set up event listeners after the map loads
    map.current.on('load', () => {
      map.current.addSource('uniData', {
        type: 'geojson',
        data: geojsonData,
      });

      // Add a layer to display the GeoJSON data
      map.current.addLayer({
        id: 'uniLayer',
        type: 'fill', // Change to 'circle', 'line', etc., depending on your data
        source: 'uniData',
        paint: {
          'fill-color': '#888888',
          'fill-opacity': 0.5,
          'fill-outline-color': '#000000',
        },
      });

      // **Add click event listener**
      map.current.on('click', 'uniLayer', (e) => {
        // Get the clicked feature
        const feature = e.features[0];

        // Extract properties (use bracket notation if property names have spaces)
        const operator = feature.properties['operator'];
        const UKPRN = feature.properties['UKPRN'];
        const KEFCluster = feature.properties['KEF Cluster'];
        const TRACGroup = feature.properties['TRAC Group'];

        // Create a popup content
        const popupContent = `
          <div>
            <strong>Operator:</strong> ${operator || 'N/A'}<br/>
            <strong>UKPRN:</strong> ${UKPRN || 'N/A'}<br/>
            <strong>KEF Cluster:</strong> ${KEFCluster || 'N/A'}<br/>
            <strong>TRAC Group:</strong> ${TRACGroup || 'N/A'}
          </div>
        `;

        // Display the popup
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(map.current);
      });

      // Change the cursor to a pointer when hovering over the layer
      map.current.on('mouseenter', 'uniLayer', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      // Change the cursor back to default when not hovering
      map.current.on('mouseleave', 'uniLayer', () => {
        map.current.getCanvas().style.cursor = '';
      });
    }); // End of 'load' event
  }, []); // End of useEffect

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;
