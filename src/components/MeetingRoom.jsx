import React, { useEffect, useState } from 'react';
import zoomSdk from '@zoom/appssdk';
import '../styles/ZoomMeeting.css';

function MeetingRoom() {
  const [meetingContext, setMeetingContext] = useState(null);
  const [breakoutRooms, setBreakoutRooms] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const initializeMeeting = async () => {
      try {
        // Get meeting context
        const context = await zoomSdk.getMeetingContext();
        setMeetingContext(context);
        setIsHost(context.role === 1); // 1 = host, 0 = participant

        // Get initial breakout rooms and participants
        const roomList = await zoomSdk.getBreakoutRoomList();
        setBreakoutRooms(roomList);
        
        const participantList = await zoomSdk.getMeetingParticipants();
        setParticipants(participantList);

        // Set up event listeners
        zoomSdk.addEventListener('onBreakoutRoomChange', handleBreakoutRoomChange);
        zoomSdk.addEventListener('onParticipantChange', handleParticipantChange);
        zoomSdk.addEventListener('onMeetingConfigChanged', handleMeetingConfigChange);
      } catch (error) {
        console.error('Failed to initialize meeting:', error);
      }
    };

    initializeMeeting();

    // Cleanup
    return () => {
      zoomSdk.removeEventListener('onBreakoutRoomChange');
      zoomSdk.removeEventListener('onParticipantChange');
      zoomSdk.removeEventListener('onMeetingConfigChanged');
    };
  }, []);

  const handleBreakoutRoomChange = (event) => {
    console.log('Breakout room change:', event);
    setBreakoutRooms(event.rooms);
  };

  const handleParticipantChange = (event) => {
    console.log('Participant change:', event);
    setParticipants(event.participants);
  };

  const handleMeetingConfigChange = (event) => {
    console.log('Meeting config change:', event);
    setMeetingContext(prev => ({ ...prev, ...event }));
  };

  const handleCreateRoom = async () => {
    try {
      await zoomSdk.createBreakoutRooms({
        name: `Room ${breakoutRooms.length + 1}`,
        participantCount: 0
      });
    } catch (error) {
      console.error('Failed to create breakout room:', error);
    }
  };

  const handleAssignParticipant = async (participantId, roomId) => {
    try {
      await zoomSdk.assignParticipantToBreakoutRoom({
        participantId,
        roomId
      });
    } catch (error) {
      console.error('Failed to assign participant:', error);
    }
  };

  const handleOpenRooms = async () => {
    try {
      await zoomSdk.openBreakoutRooms();
    } catch (error) {
      console.error('Failed to open breakout rooms:', error);
    }
  };

  const handleCloseRooms = async () => {
    try {
      await zoomSdk.closeBreakoutRooms();
    } catch (error) {
      console.error('Failed to close breakout rooms:', error);
    }
  };

  return (
    <div className="meeting-room">
      <div className="meeting-header">
        <h2>Meeting Room</h2>
        {isHost && (
          <div className="host-controls">
            <button 
              className="zoom-button"
              onClick={handleCreateRoom}
              aria-label="Create Breakout Room"
            >
              Create Room
            </button>
            <button 
              className="zoom-button"
              onClick={handleOpenRooms}
              disabled={breakoutRooms.length === 0}
              aria-label="Open Breakout Rooms"
            >
              Open Rooms
            </button>
            <button 
              className="zoom-button secondary"
              onClick={handleCloseRooms}
              disabled={breakoutRooms.length === 0}
              aria-label="Close Breakout Rooms"
            >
              Close Rooms
            </button>
          </div>
        )}
      </div>

      <div className="meeting-content">
        <div className="rooms-panel">
          <h3>Breakout Rooms ({breakoutRooms.length})</h3>
          <div className="rooms-list">
            {breakoutRooms.map(room => (
              <div 
                key={room.id} 
                className={`room-item ${selectedRoom === room.id ? 'selected' : ''}`}
                onClick={() => setSelectedRoom(room.id)}
              >
                <span className="room-name">{room.name}</span>
                <span className="participant-count">{room.participantCount} participants</span>
              </div>
            ))}
          </div>
        </div>

        <div className="participants-panel">
          <h3>Participants ({participants.length})</h3>
          <div className="participants-list">
            {participants.map(participant => (
              <div key={participant.userId} className="participant-item">
                <span className="participant-name">{participant.displayName}</span>
                <span className="participant-room">{participant.roomName || 'Main Room'}</span>
                {isHost && selectedRoom && (
                  <button
                    className="zoom-button small"
                    onClick={() => handleAssignParticipant(participant.userId, selectedRoom)}
                    disabled={participant.roomId === selectedRoom}
                  >
                    Assign to Room
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingRoom; 