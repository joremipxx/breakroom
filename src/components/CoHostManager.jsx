import React from 'react';

function CoHostManager({ coHosts, excludeCoHosts, onExcludeChange }) {
  return (
    <div className="feature-card">
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600',
        letterSpacing: '-0.5px',
        margin: '0 0 16px 0'
      }}>
        Co-Host Settings
      </h3>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          color: '#666',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={excludeCoHosts}
            onChange={(e) => onExcludeChange(e.target.checked)}
            style={{ margin: 0 }}
          />
          Exclude Co-hosts from Breakout Rooms
        </label>
      </div>

      <div>
        <h4 style={{ 
          fontSize: '14px',
          fontWeight: '600',
          color: '#666',
          marginBottom: '8px'
        }}>
          Current Co-hosts ({coHosts.length})
        </h4>
        
        {coHosts.length === 0 ? (
          <p style={{ 
            color: '#666',
            fontSize: '14px',
            textAlign: 'center',
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '6px',
            margin: 0
          }}>
            No co-hosts assigned
          </p>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '8px'
          }}>
            {coHosts.map((coHost) => (
              <div 
                key={coHost.userId}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ flex: 1, fontSize: '14px' }}>
                  {coHost.displayName}
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#fff',
                  backgroundColor: '#FF9800',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  Co-Host
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CoHostManager; 