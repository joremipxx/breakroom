import React from 'react';

function RoomAssignmentSettings({ assignmentMode, onModeChange }) {
  const modes = [
    {
      id: 'random',
      title: 'Total Random',
      description: 'Assign participants to rooms completely at random, ignoring any criteria.'
    },
    {
      id: 'mix',
      title: 'Total Mix',
      description: 'Distribute participants evenly across rooms while balancing the selected criteria (e.g., skill levels, interests).'
    },
    {
      id: 'criteria',
      title: 'Criteria-Based Assignment',
      description: 'Group participants based on instructor-defined criteria (e.g., skill level, interests, or personality types).'
    }
  ];

  return (
    <div className="feature-card">
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600',
        letterSpacing: '-0.5px',
        margin: 0,
        marginBottom: '16px'
      }}>
        Room Settings Features
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {modes.map((mode) => (
          <div
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: `2px solid ${assignmentMode === mode.id ? '#8D2146' : '#e1e1e1'}`,
              backgroundColor: assignmentMode === mode.id ? '#FFF5F8' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid #8D2146',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px'
              }}>
                {assignmentMode === mode.id && (
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#8D2146'
                  }} />
                )}
              </div>
              <span style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#333'
              }}>
                {mode.title}
              </span>
            </div>
            <p style={{
              margin: '0 0 0 28px',
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.4'
            }}>
              {mode.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomAssignmentSettings; 