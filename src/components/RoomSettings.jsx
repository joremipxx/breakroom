import React from 'react';

function RoomSettings({ 
  minParticipants,
  preferredSize,
  maxParticipants,
  totalParticipants,
  onMinChange,
  onPreferredChange,
  onMaxChange
}) {
  return (
    <div className="feature-card">
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600',
        letterSpacing: '-0.5px',
        margin: '0 0 16px 0'
      }}>
        Room Size Settings
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 100px',
        gap: '12px',
        alignItems: 'center'
      }}>
        <label style={{ 
          fontSize: '14px',
          color: '#666',
          fontWeight: '500'
        }}>
          Min Participants:
        </label>
        <input
          type="number"
          min="1"
          value={minParticipants}
          onChange={(e) => onMinChange(parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #e1e1e1',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />

        <label style={{ 
          fontSize: '14px',
          color: '#666',
          fontWeight: '500'
        }}>
          Preferred Size:
        </label>
        <input
          type="number"
          min={minParticipants}
          max={maxParticipants}
          value={preferredSize}
          onChange={(e) => onPreferredChange(parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #e1e1e1',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />

        <label style={{ 
          fontSize: '14px',
          color: '#666',
          fontWeight: '500'
        }}>
          Max Participants:
        </label>
        <input
          type="number"
          min={preferredSize}
          value={maxParticipants}
          onChange={(e) => onMaxChange(parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #e1e1e1',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />

        <label style={{ 
          fontSize: '14px',
          color: '#666',
          fontWeight: '500'
        }}>
          Total Participants:
        </label>
        <div style={{
          padding: '8px',
          background: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#8D2146',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {totalParticipants}
        </div>
      </div>
    </div>
  );
}

export default RoomSettings; 