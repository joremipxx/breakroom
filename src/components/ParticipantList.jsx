import React, { useState } from 'react';

function ParticipantList({ 
  participants, 
  roomHistory, 
  onReassign 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const participantsPerPage = 20;

  // Filter participants based on search query
  const filteredParticipants = participants
    .filter(participant => !participant.roomName) // Only main room participants
    .filter(participant => 
      participant.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (roomHistory[participant.userId] && 
       roomHistory[participant.userId].toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Calculate pagination
  const totalPages = Math.ceil(filteredParticipants.length / participantsPerPage);
  const startIndex = (currentPage - 1) * participantsPerPage;
  const endIndex = startIndex + participantsPerPage;
  const currentParticipants = filteredParticipants.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Search Bar */}
      <div style={{ 
        marginBottom: '16px',
        width: '100%',
        position: 'relative'
      }}>
        <input
          type="text"
          placeholder="Search participants..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #e1e1e1',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            maxWidth: '100%'
          }}
        />
      </div>

      {/* Participants List */}
      {currentParticipants.length === 0 ? (
        <p style={{ 
          color: '#666',
          fontSize: '14px',
          textAlign: 'center',
          padding: '20px'
        }}>
          {filteredParticipants.length === 0 ? 'All participants are in breakout rooms' : 'No matching participants found'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {currentParticipants.map((participant) => (
            <div 
              key={participant.userId}
              style={{
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: roomHistory[participant.userId] ? '#fff5f8' : 'transparent'
              }}
            >
              <span style={{ flex: 1 }}>
                {participant.displayName}
                {roomHistory[participant.userId] && (
                  <span style={{
                    fontSize: '13px',
                    color: '#666',
                    marginLeft: '8px'
                  }}>
                    (Previously in {roomHistory[participant.userId]})
                  </span>
                )}
              </span>
              {participant.isCoHost && (
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
              )}
              {roomHistory[participant.userId] && (
                <button
                  className="zoom-button"
                  onClick={() => onReassign(participant.userId, roomHistory[participant.userId])}
                  style={{
                    padding: '4px 8px',
                    fontSize: '13px'
                  }}
                >
                  Reassign
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px',
          padding: '8px'
        }}>
          <button
            className="zoom-button secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ padding: '4px 8px' }}
          >
            Previous
          </button>
          <span style={{ 
            fontSize: '14px',
            color: '#666'
          }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="zoom-button secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ padding: '4px 8px' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ParticipantList; 