import React, { useState } from 'react';

function CriteriaGrouping({ onCriteriaChange }) {
  const [selectedCriteria, setSelectedCriteria] = useState('skill');
  const [customCriteria, setCustomCriteria] = useState('');

  const criteriaOptions = [
    { value: 'skill', label: 'Skill Level' },
    { value: 'interest', label: 'Interests' },
    { value: 'personality', label: 'Personality Type' },
    { value: 'custom', label: 'Custom Criteria' }
  ];

  const handleCriteriaChange = (event) => {
    const newCriteria = event.target.value;
    setSelectedCriteria(newCriteria);
    onCriteriaChange(newCriteria === 'custom' ? customCriteria : newCriteria);
  };

  const handleCustomCriteriaChange = (event) => {
    const newCustomCriteria = event.target.value;
    setCustomCriteria(newCustomCriteria);
    if (selectedCriteria === 'custom') {
      onCriteriaChange(newCustomCriteria);
    }
  };

  return (
    <div className="feature-card">
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600',
        letterSpacing: '-0.5px',
        margin: 0,
        marginBottom: '16px'
      }}>
        Grouping Criteria
      </h3>

      <div className="criteria-selector" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%'
      }}>
        <div className="criteria-field" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px'
        }}>
          <label style={{ 
            fontSize: '14px',
            fontWeight: '500',
            color: '#666',
            flex: '1'
          }}>
            Group By:
          </label>
          <select
            value={selectedCriteria}
            onChange={handleCriteriaChange}
            style={{ 
              width: '160px',
              padding: '8px',
              fontSize: '14px',
              border: '1px solid #e1e1e1',
              borderRadius: '6px',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              backgroundColor: 'white'
            }}
          >
            {criteriaOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {selectedCriteria === 'custom' && (
          <div className="custom-criteria-field" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px'
          }}>
            <label style={{ 
              fontSize: '14px',
              fontWeight: '500',
              color: '#666',
              flex: '1'
            }}>
              Custom Criteria:
            </label>
            <input
              type="text"
              value={customCriteria}
              onChange={handleCustomCriteriaChange}
              placeholder="Enter criteria name"
              style={{ 
                width: '160px',
                padding: '8px',
                fontSize: '14px',
                border: '1px solid #e1e1e1',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
            />
          </div>
        )}

        <div className="criteria-description" style={{
          marginTop: '10px',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#666'
        }}>
          {selectedCriteria === 'skill' && 'Group participants based on their skill or proficiency levels'}
          {selectedCriteria === 'interest' && 'Group participants based on shared interests or topics'}
          {selectedCriteria === 'personality' && 'Group participants based on personality types or working styles'}
          {selectedCriteria === 'custom' && 'Group participants based on your custom criteria'}
        </div>
      </div>
    </div>
  );
}

export default CriteriaGrouping; 