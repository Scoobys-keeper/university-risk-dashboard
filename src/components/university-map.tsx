import React, { useState } from 'react';
import * as turf from '@turf/turf';

// Import your GeoJSON directly
import universityData from '/Users/willyphillips/university-risk-dashboard/src/data/UNI_shpfile_displayTrial.geojson'; 

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
          <label key={op}>
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
            d={/* Convert GeoJSON coordinates to SVG path */}
            fill="blue" 
            opacity={0.5}
          />
        ))}
      </svg>
    </div>
  );
};

export default UniversityMap;
