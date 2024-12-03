import React, { useState } from 'react';
import * as turf from '@turf/turf';

// Import your GeoJSON directly
import universityData from '/Users/willyphillips/university-risk-dashboard/src/data/UNI_shpfile_displayTrial.geojson';

// Convert GeoJSON polygon to SVG path
const polygonToSVGPath = (coordinates, scale = 10, offsetX = 0, offsetY = 0) => {
  const path = coordinates.map((ring, index) => {
    const pathCommands = ring.map((coord, i) => {
      const x = (coord[0] - universityData.features[0].geometry.coordinates[0][0][0]) * scale + offsetX;
      const y = (coord[1] - universityData.features[0].geometry.coordinates[0][0][1]) * scale + offsetY;
      return i === 0 ? `M${x},${y}` : `L${x},${y}`;
    });
    return [...pathCommands, 'Z'].join(' ');
  }).join(' ');
  
  return path;
};

const UniversityMap = () => {
  const [selectedOperators, setSelectedOperators] = useState([]);

  // Extract unique operators
  const operators = [...new Set(
    universityData.features.map(f => f.properties.operator)
  )];

  // Filter universities based on selected operators
  const filteredUniversities = universityData.features.filter(
    uni => selectedOperators.length === 0 || 
           selectedOperators.includes(uni.properties.operator)
  );

  return (
    <div>
      {/* Operator Selection */}
      <div>
        {operators.map(op => (
          <label key={op} style={{marginRight: '10px'}}>
            <input 
              type="checkbox" 
              checked={selectedOperators.includes(op)}
              onChange={() => {
                setSelectedOperators(current => 
                  current.includes(op) 
                    ? current.filter(o => o !== op)
                    : [...current, op]
                );
              }}
            />
            {op}
          </label>
        ))}
      </div>

      {/* SVG Visualization */}
      <svg viewBox="0 0 1000 800" style={{width: '100%', height: '600px'}}>
        {filteredUniversities.map((uni, index) => (
          <path 
            key={index}
            d={polygonToSVGPath(uni.geometry.coordinates[0])}
            fill="blue" 
            opacity={0.5}
            stroke="black"
            strokeWidth={2}
          />
        ))}
      </svg>
    </div>
  );
};

export default UniversityMap;
