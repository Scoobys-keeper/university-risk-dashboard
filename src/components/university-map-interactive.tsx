import React, { useState } from 'react';
import universityData from '/Users/willyphillips/university-risk-dashboard/src/data/UNI_shpfile_displayTrial.geojson';

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
  const [hoveredUniversity, setHoveredUniversity] = useState(null);

  const operators = [...new Set(
    universityData.features.map(f => f.properties.operator)
  )];

  const filteredUniversities = universityData.features.filter(
    uni => selectedOperators.length === 0 || 
           selectedOperators.includes(uni.properties.operator)
  );

  return (
    <div style={{display: 'flex'}}>
      <div style={{width: '200px', padding: '10px'}}>
        <h3>Operators</h3>
        {operators.map(op => (
          <label key={op} style={{display: 'block'}}>
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

      <div style={{flex: 1}}>
        <svg viewBox="0 0 1000 800" style={{width: '100%', height: '600px'}}>
          {filteredUniversities.map((uni, index) => (
            <path 
              key={index}
              d={polygonToSVGPath(uni.geometry.coordinates[0])}
              fill={hoveredUniversity === uni ? "red" : "blue"}
              opacity={0.5}
              stroke="black"
              strokeWidth={2}
              onMouseEnter={() => setHoveredUniversity(uni)}
              onMouseLeave={() => setHoveredUniversity(null)}
            />
          ))}
        </svg>

        {hoveredUniversity && (
          <div style={{
            position: 'absolute', 
            border: '1px solid black', 
            padding: '10px', 
            backgroundColor: 'white'
          }}>
            <h4>{hoveredUniversity.properties.operator}</h4>
            <p>UKPRN: {hoveredUniversity.properties.UKPRN}</p>
            <p>KEF Cluster: {hoveredUniversity.properties['KEF CLuster']}</p>
            <p>TRAC Cluster: {hoveredUniversity.properties['TRAC Cluster']}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityMap;
