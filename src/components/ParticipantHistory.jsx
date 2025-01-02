import React from 'react';

function ParticipantHistory({ participants, roomHistory, onReassign }) {
  // Filter participants who are in the main room but have room history
  const disconnectedParticipants = participants.filter(p => 
    !p.roomName && roomHistory[p.userId]
  );

  if (disconnectedParticipants.length === 0) {
    return null;
  }

  return (
    <div className="feature-card">
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600',
        letterSpacing: '-0.5px',
        margin: '0 0 16px 0'
      }}>
        Recently Disconnected
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {disconnectedParticipants.map((participant) => (
          <div
            key={participant.userId}
            style={{
              padding: '12px',
              border: '1px solid #e1e1e1',
              borderRadius: '8px',
              backgroundColor: '#fff5f8',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: '500',
                marginBottom: '4px'
              }}>
                {participant.displayName}
              </div>
              <div style={{ 
                fontSize: '13px',
                color: '#666'
              }}>
                Previous room: {roomHistory[participant.userId]}
              </div>
            </div>
            
            <button
              className="zoom-button"
              onClick={() => onReassign(participant.userId, roomHistory[participant.userId])}
              style={{
                padding: '8px 12px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M13 8l-3-3M13 8l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Reassign
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParticipantHistory; 