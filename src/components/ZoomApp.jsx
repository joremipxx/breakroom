import React, { useEffect, useState } from 'react';
import { useZoom } from '../context/ZoomContext';
import Timer from './Timer';
import RoomSettings from './RoomSettings';
import ParticipantImport from './ParticipantImport';
import CoHostManager from './CoHostManager';
import RoomAssignmentSettings from './RoomAssignmentSettings';
import ParticipantHistory from './ParticipantHistory';
import ShuffleSettings from './ShuffleSettings';
import ParticipantList from './ParticipantList';
import '../App.css';

function ZoomApp() {
  const { 
    client, 
    isInitialized, 
    error, 
    breakoutRooms, 
    participants, 
    updateParticipantCriteria,
    participantCriteria
  } = useZoom();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('Initializing...');
  const [sessionDuration, setSessionDuration] = useState(15); // Default 15 minutes
  const [remainingTime, setRemainingTime] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [excludeCoHosts, setExcludeCoHosts] = useState(false);

  // Room settings state
  const [minParticipants, setMinParticipants] = useState(2);
  const [preferredSize, setPreferredSize] = useState(3);
  const [maxParticipants, setMaxParticipants] = useState(3);

  const [activeTab, setActiveTab] = useState('manage'); // 'manage' or 'import'
  const [importedParticipants, setImportedParticipants] = useState([]);
  const [coHosts, setCoHosts] = useState([]);

  const [assignmentMode, setAssignmentMode] = useState('random'); // 'random', 'mix', or 'criteria'

  const [roomHistory, setRoomHistory] = useState({}); // Track participant room history

  const [enableReshuffle, setEnableReshuffle] = useState(false);
  const [reshuffleTime, setReshuffleTime] = useState(30);
  const [hasShuffled, setHasShuffled] = useState(false);

  useEffect(() => {
    console.log('ZoomApp: Checking initialization status');
    console.log('isInitialized:', isInitialized);
    console.log('error:', error);
    console.log('client:', client);

    if (isInitialized && client) {
      console.log('ZoomApp: Initialization complete');
      setIsLoading(false);
      setStatus('Connected');
    } else if (error) {
      console.error('ZoomApp: Error during initialization:', error);
      setIsLoading(false);
      setStatus(`Error: ${error}`);
    }
  }, [isInitialized, error, client]);

  // Timer controls
  const startTimer = () => {
    setRemainingTime(sessionDuration * 60);
    setTimerActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setRemainingTime(sessionDuration * 60);
    setIsPaused(false);
  };

  const updateDuration = (minutes) => {
    setSessionDuration(minutes);
    if (!timerActive) {
      setRemainingTime(minutes * 60);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (timerActive && remainingTime > 0 && !isPaused) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          // Check if it's time to shuffle
          if (enableReshuffle && !hasShuffled && prev === reshuffleTime * 60) {
            handleReshuffle();
          }
          
          if (prev <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isPaused, remainingTime, enableReshuffle, reshuffleTime, hasShuffled]);

  // Reset shuffle state when starting new session
  useEffect(() => {
    if (!timerActive) {
      setHasShuffled(false);
    }
  }, [timerActive]);

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Add debug logs for loading state
  useEffect(() => {
    console.log('Loading state changed:', isLoading);
  }, [isLoading]);

  // Add this function to filter out co-hosts if needed
  const filterParticipants = (participants) => {
    return excludeCoHosts 
      ? participants.filter(participant => participant && participant.isCoHost !== true)
      : participants;
  };

  // Modify handleCreateBreakoutRoom to use the assignment mode
  const handleCreateBreakoutRoom = async () => {
    try {
      const filteredParticipants = filterParticipants(participants);
      await client.createBreakoutRooms({
        name: `Room ${breakoutRooms.length + 1}`,
        participantCount: 0,
        participants: filteredParticipants,
        duration: sessionDuration,
        assignmentMode: assignmentMode // Add the assignment mode
      });
    } catch (err) {
      console.error('Error creating breakout room:', err);
    }
  };

  const handleOpenBreakoutRooms = async () => {
    try {
      console.log('Starting breakout room creation...');
      console.log('Client state:', client);
      console.log('Participants:', participants);
      
      const filteredParticipants = filterParticipants(participants);
      console.log('Filtered participants:', filteredParticipants);
      
      // Group participants based on criteria if using criteria-based assignment
      if (assignmentMode === 'criteria') {
        console.log('Using criteria-based assignment');
        const groupedParticipants = {};
        
        filteredParticipants.forEach(participant => {
          const criteria = participantCriteria[participant.userId];
          console.log(`Processing participant ${participant.displayName}:`, criteria);
          
          if (criteria) {
            // Use the selected criteria (skillLevel, interestArea, or experience)
            const groupKey = criteria.skillLevel || criteria.interestArea || criteria.experience || 'unspecified';
            if (!groupedParticipants[groupKey]) {
              groupedParticipants[groupKey] = [];
            }
            groupedParticipants[groupKey].push(participant);
          } else {
            // Handle participants without criteria
            if (!groupedParticipants['unspecified']) {
              groupedParticipants['unspecified'] = [];
            }
            groupedParticipants['unspecified'].push(participant);
          }
        });

        console.log('Grouped participants:', groupedParticipants);

        // Create rooms for each criteria group
        let roomNumber = 1;
        for (const [criteria, groupParticipants] of Object.entries(groupedParticipants)) {
          console.log(`Creating rooms for criteria: ${criteria}`);
          const numberOfRooms = Math.ceil(groupParticipants.length / preferredSize);
          
          for (let i = 0; i < numberOfRooms; i++) {
            const roomParticipants = groupParticipants.slice(i * preferredSize, (i + 1) * preferredSize);
            console.log(`Creating room ${roomNumber} with participants:`, roomParticipants);
            
            try {
              await client.createBreakoutRooms({
                name: `${criteria} - Room ${i + 1}`,
                participantCount: roomParticipants.length,
                participants: roomParticipants,
                duration: sessionDuration,
                assignmentMode: 'manual' // Use manual assignment for criteria-based groups
              });
              console.log(`Room ${roomNumber} created successfully`);
            } catch (error) {
              console.error(`Error creating room ${roomNumber}:`, error);
            }
            roomNumber++;
          }
        }
      } else {
        console.log('Using random assignment');
        // Original random assignment logic
        const numberOfRooms = Math.ceil(filteredParticipants.length / preferredSize);
        console.log(`Creating ${numberOfRooms} rooms with preferred size ${preferredSize}`);
        
        for (let i = 0; i < numberOfRooms; i++) {
          const roomParticipants = filteredParticipants.slice(i * preferredSize, (i + 1) * preferredSize);
          console.log(`Creating room ${i + 1} with participants:`, roomParticipants);
          
          try {
            await client.createBreakoutRooms({
              name: `Room ${i + 1}`,
              participantCount: preferredSize,
              participants: roomParticipants,
              duration: sessionDuration,
              assignmentMode: assignmentMode
            });
            console.log(`Room ${i + 1} created successfully`);
          } catch (error) {
            console.error(`Error creating room ${i + 1}:`, error);
          }
        }
      }

      // Open the rooms and start the timer
      console.log('Opening breakout rooms...');
      await client.openBreakoutRooms();
      console.log('Breakout rooms opened successfully');
      startTimer();
    } catch (err) {
      console.error('Error managing breakout rooms:', err);
    }
  };

  const handleCloseBreakoutRooms = async () => {
    try {
      await client.closeBreakoutRooms();
      setTimerActive(false); // Stop the timer when rooms are closed
    } catch (err) {
      console.error('Error closing breakout rooms:', err);
    }
  };

  // Add debug logs
  useEffect(() => {
    console.log('Component mounted');
    console.log('Session duration:', sessionDuration);
    console.log('Timer active:', timerActive);
    console.log('Remaining time:', remainingTime);
  }, [sessionDuration, timerActive, remainingTime]);

  // Add more debug logs
  useEffect(() => {
    console.log('=== Debug Logs ===');
    console.log('Is Loading:', isLoading);
    console.log('Client:', client);
    console.log('Timer States:', {
      sessionDuration,
      remainingTime,
      timerActive,
      isPaused
    });
  }, [isLoading, client, sessionDuration, remainingTime, timerActive, isPaused]);

  // Add debug logs for client state
  useEffect(() => {
    console.log('ZoomApp: Client state changed:', {
      hasClient: !!client,
      isInitialized,
      error,
      breakoutRoomsCount: breakoutRooms.length,
      participantsCount: participants.length
    });
  }, [client, isInitialized, error, breakoutRooms, participants]);

  const handleImport = (importedParticipants) => {
    setImportedParticipants(importedParticipants);
    
    // Match imported participants with Zoom participants
    importedParticipants.forEach(imported => {
      const matchedParticipant = participants.find(p => 
        p.displayName.toLowerCase() === imported.name.toLowerCase() ||
        (imported.email && p.email && p.email.toLowerCase() === imported.email.toLowerCase())
      );

      if (matchedParticipant) {
        // Store the criteria for this participant
        updateParticipantCriteria(matchedParticipant.userId, {
          skillLevel: imported.skillLevel,
          interestArea: imported.interestArea,
          experience: imported.experience
        });

        console.log(`Matched participant ${matchedParticipant.displayName} with imported criteria`);
      } else {
        console.log(`No match found for imported participant: ${imported.name}`);
      }
    });
  };

  // Update this useEffect to identify co-hosts
  useEffect(() => {
    if (participants) {
      const coHostList = participants.filter(p => p.isCoHost);
      setCoHosts(coHostList);
    }
  }, [participants]);

  const handleRemoveCoHost = async (userId) => {
    try {
      // This is a placeholder - implement the actual co-host removal logic
      // using the Zoom SDK when available
      console.log('Removing co-host:', userId);
      // await client.removeCoHost(userId);
    } catch (err) {
      console.error('Error removing co-host:', err);
    }
  };

  // Update room history when participants change rooms
  useEffect(() => {
    participants.forEach(participant => {
      if (participant.roomName) {
        setRoomHistory(prev => ({
          ...prev,
          [participant.userId]: participant.roomName
        }));
      }
    });
  }, [participants]);

  // Handle reassigning a participant to their previous room
  const handleReassignParticipant = async (userId, roomName) => {
    try {
      await client.assignParticipantToBreakoutRoom({
        participantId: userId,
        roomId: breakoutRooms.find(room => room.name === roomName)?.id
      });
      console.log(`Reassigned participant ${userId} to room ${roomName}`);
    } catch (err) {
      console.error('Error reassigning participant:', err);
    }
  };

  const handleReshuffle = async () => {
    try {
      // Close existing rooms
      await client.closeBreakoutRooms();
      
      // Wait a moment for rooms to close
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new rooms with shuffled participants
      const filteredParticipants = filterParticipants(participants);
      const numberOfRooms = Math.ceil(filteredParticipants.length / preferredSize);
      
      // Shuffle the participants array
      const shuffledParticipants = [...filteredParticipants].sort(() => Math.random() - 0.5);
      
      // Create new rooms with shuffled participants
      for (let i = 0; i < numberOfRooms; i++) {
        await client.createBreakoutRooms({
          name: `Room ${i + 1}`,
          participantCount: preferredSize,
          participants: shuffledParticipants.slice(i * preferredSize, (i + 1) * preferredSize),
          duration: Math.floor(remainingTime / 60),
          assignmentMode: assignmentMode
        });
      }
      
      // Open the new rooms
      await client.openBreakoutRooms();
      setHasShuffled(true);
      
      console.log('Rooms reshuffled successfully');
    } catch (err) {
      console.error('Error reshuffling rooms:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="zoom-app-container">
        <h2>Paradox Breakroom</h2>
        <div className="loading" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          gap: '12px'
        }}>
          <p style={{ fontSize: '16px', color: '#333' }}>Loading breakout room controls...</p>
          <p style={{ fontSize: '14px', color: '#666' }}>{status}</p>
          {error && (
            <div className="error-message" style={{ 
              color: '#8D2146',
              marginTop: '10px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#FFF5F8',
              width: '100%',
              textAlign: 'center'
            }}>
              <p style={{ margin: '0 0 12px 0' }}>
                {error.includes('inZoomClient') 
                  ? 'This app must be opened in Zoom. Please launch it from the Zoom Apps tab.'
                  : `Error: ${error}`
                }
              </p>
              {!error.includes('inZoomClient') && (
                <button 
                  className="zoom-button"
                  onClick={() => window.location.reload()}
                  aria-label="Retry Connection"
                >
                  Retry Connection
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="zoom-app-container">
        <h2>Paradox Breakroom</h2>

        {/* Tabs */}
        <div className="tabs" style={{
          display: 'flex',
          borderBottom: '1px solid #e1e1e1',
          marginBottom: '20px'
        }}>
          <button
            className={`tab ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              border: 'none',
              background: 'none',
              borderBottom: `2px solid ${activeTab === 'manage' ? '#8D2146' : 'transparent'}`,
              color: activeTab === 'manage' ? '#8D2146' : '#666',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Manage Groups
          </button>
          <button
            className={`tab ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              border: 'none',
              background: 'none',
              borderBottom: `2px solid ${activeTab === 'import' ? '#8D2146' : 'transparent'}`,
              color: activeTab === 'import' ? '#8D2146' : '#666',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Import Participants
          </button>
        </div>

        {activeTab === 'manage' ? (
          <>
            {/* Room Settings Section */}
            <RoomSettings
              minParticipants={minParticipants}
              preferredSize={preferredSize}
              maxParticipants={maxParticipants}
              totalParticipants={participants.length}
              onMinChange={(value) => {
                setMinParticipants(value);
                if (value > preferredSize) {
                  setPreferredSize(value);
                }
                if (value > maxParticipants) {
                  setMaxParticipants(value);
                }
              }}
              onPreferredChange={(value) => {
                setPreferredSize(value);
                if (value < minParticipants) {
                  setMinParticipants(value);
                }
                if (value > maxParticipants) {
                  setMaxParticipants(value);
                }
              }}
              onMaxChange={(value) => {
                setMaxParticipants(value);
                if (value < preferredSize) {
                  setPreferredSize(value);
                }
                if (value < minParticipants) {
                  setMinParticipants(value);
                }
              }}
            />

            {/* Room Assignment Settings */}
            <RoomAssignmentSettings
              assignmentMode={assignmentMode}
              onModeChange={setAssignmentMode}
            />

            {/* Timer Section */}
            <Timer 
              sessionDuration={sessionDuration}
              onDurationChange={setSessionDuration}
            />

            {/* Shuffle Settings */}
            <ShuffleSettings
              enableReshuffle={enableReshuffle}
              onEnableChange={setEnableReshuffle}
              reshuffleTime={reshuffleTime}
              onReshuffleTimeChange={setReshuffleTime}
              sessionDuration={sessionDuration}
            />

            {/* Co-Host Manager Section */}
            <CoHostManager
              coHosts={coHosts}
              onRemoveCoHost={handleRemoveCoHost}
              excludeCoHosts={excludeCoHosts}
              onExcludeChange={setExcludeCoHosts}
            />

            {/* Breakout Controls */}
            <div className="feature-card">
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600',
                letterSpacing: '-0.5px',
                margin: '0 0 16px 0'
              }}>
                Room Controls
              </h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '12px'
                }}>
                  <button 
                    className="zoom-button"
                    onClick={handleOpenBreakoutRooms}
                    disabled={!client}
                    style={{
                      flex: 1,
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10L16 10M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Start Session
                  </button>

                  <button 
                    className="zoom-button secondary"
                    onClick={handleCloseBreakoutRooms}
                    disabled={!client || breakoutRooms.length === 0}
                    style={{
                      flex: 1,
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    End Session
                  </button>
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  <strong>How it works:</strong>
                  <ul style={{ 
                    margin: '8px 0 0 0',
                    paddingLeft: '20px',
                    listStyle: 'disc'
                  }}>
                    <li style={{ marginBottom: '8px' }}>
                      Click <strong>Start Session</strong> to create and open breakout rooms based on your settings
                    </li>
                    <li>
                      Use <strong>End Session</strong> when you want to bring everyone back to the main room
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Rooms List */}
            <div className="feature-card">
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600',
                letterSpacing: '-0.5px',
                margin: '0 0 16px 0'
              }}>
                Active Breakout Rooms ({breakoutRooms.length})
              </h3>
              
              {breakoutRooms.length === 0 ? (
                <p style={{ 
                  color: '#666',
                  fontSize: '14px',
                  textAlign: 'center',
                  padding: '20px'
                }}>
                  No active breakout rooms. Click "Start Session" to create rooms.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {breakoutRooms.map((room) => {
                    const roomParticipants = participants.filter(p => p.roomName === room.name);
                    return (
                      <div 
                        key={room.id} 
                        style={{
                          border: '1px solid #e1e1e1',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{
                          padding: '12px',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '1px solid #e1e1e1',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontWeight: '600' }}>{room.name}</span>
                          <span style={{ 
                            fontSize: '13px',
                            color: '#666',
                            backgroundColor: '#fff',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            border: '1px solid #e1e1e1'
                          }}>
                            {roomParticipants.length} participants
                          </span>
                        </div>
                        <div style={{ padding: '8px 0' }}>
                          {roomParticipants.map((participant) => (
                            <div 
                              key={participant.userId}
                              style={{
                                padding: '8px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                borderBottom: '1px solid #f0f0f0'
                              }}
                            >
                              <span style={{ flex: 1 }}>{participant.displayName}</span>
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
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Main Room Participants */}
            <div className="feature-card">
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600',
                letterSpacing: '-0.5px',
                margin: '0 0 16px 0'
              }}>
                Main Room Participants
              </h3>
              
              <ParticipantList
                participants={participants}
                roomHistory={roomHistory}
                onReassign={handleReassignParticipant}
              />
            </div>
          </>
        ) : (
          <ParticipantImport onImport={handleImport} />
        )}
      </div>
    </div>
  );
}

export default ZoomApp; 