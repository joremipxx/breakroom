import React from 'react';

function Timer({ 
  sessionDuration,
  onDurationChange
}) {
  return (
    <div className="feature-card">
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600',
        letterSpacing: '-0.5px',
        margin: 0,
        marginBottom: '16px'
      }}>
        Duration Settings
      </h3>

      <div className="duration-setter" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px'
      }}>
        <label htmlFor="duration" style={{ 
          fontSize: '14px',
          fontWeight: '500',
          color: '#666',
          flex: '1'
        }}>
          Duration (minutes):
        </label>
        <input
          type="number"
          id="duration"
          min="1"
          max="120"
          value={sessionDuration}
          onChange={(e) => onDurationChange(parseInt(e.target.value))}
          style={{ 
            width: '80px',
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #e1e1e1',
            borderRadius: '6px',
            textAlign: 'center',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
        />
      </div>
    </div>
  );
}

export default Timer; 