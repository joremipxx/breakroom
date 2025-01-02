import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import zoomSdk from '@zoom/appssdk';
import { initializeZoomSdk } from '../utils/zoomInit';

export const ZoomContext = React.createContext();

export function ZoomProvider({ children }) {
  const [client, setClient] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [meetingContext, setMeetingContext] = useState(null);
  const [breakoutRooms, setBreakoutRooms] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [participantCriteria, setParticipantCriteria] = useState({});
  const mounted = useRef(true);
  let initTimeout;

  useEffect(() => {
    console.log('ZoomProvider mounted');
    setupZoom();

    return () => {
      mounted.current = false;
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
      if (client) {
        client.removeEventListener('onAuthorized');
        client.removeEventListener('onConnect');
        client.removeEventListener('onBreakoutRoomChange');
        client.removeEventListener('onParticipantChange');
        client.removeEventListener('onMeetingConfigChanged');
      }
    };
  }, []);

  const setupZoom = async () => {
    try {
      console.log('Starting Zoom SDK initialization...');
      const sdk = await initializeZoomSdk();
      console.log('SDK initialized, setting up event listeners...');

      // Set up event listeners
      sdk.addEventListener('onAuthorized', handleAuthorized);
      sdk.addEventListener('onConnect', handleConnect);
      sdk.addEventListener('onBreakoutRoomChange', handleBreakoutRoomChange);
      sdk.addEventListener('onParticipantChange', handleParticipantChange);
      sdk.addEventListener('onMeetingConfigChanged', handleMeetingConfigChange);

      console.log('Event listeners set up, connecting to Zoom...');
      await sdk.connect();
      console.log('Connected to Zoom');
      
      if (mounted.current) {
        setClient(sdk);
        console.log('Client set');
      }
    } catch (err) {
      console.error('Failed to initialize Zoom:', err);
      if (mounted.current) {
        setError(err.message);
        setIsInitialized(false);
      }
    }
  };

  const handleAuthorized = () => {
    console.log('App authorized');
  };

  const handleConnect = async () => {
    try {
      console.log('Connected, getting meeting context...');
      const context = await client.getMeetingContext();
      console.log('Meeting context:', context);
      
      if (!mounted.current) return;
      setMeetingContext(context);
      setIsHost(context.role === 1);

      console.log('Getting breakout rooms...');
      const roomList = await client.getBreakoutRoomList();
      console.log('Breakout rooms:', roomList);
      
      if (!mounted.current) return;
      setBreakoutRooms(roomList);

      console.log('Getting participants...');
      const participantList = await client.getMeetingParticipants();
      console.log('Participants:', participantList);
      
      if (!mounted.current) return;
      setParticipants(participantList);
      setIsInitialized(true);
      console.log('Initialization complete');
    } catch (err) {
      console.error('Error in handleConnect:', err);
      if (mounted.current) {
        setError(err.message);
        setIsInitialized(false);
      }
    }
  };

  const handleBreakoutRoomChange = (event) => {
    console.log('Breakout room change:', event);
    if (mounted.current) {
      setBreakoutRooms(event.rooms || []);
    }
  };

  const handleParticipantChange = (event) => {
    console.log('Participant change:', event);
    if (mounted.current) {
      setParticipants(event.participants || []);
    }
  };

  const handleMeetingConfigChange = (event) => {
    console.log('Meeting config change:', event);
    if (mounted.current) {
      setMeetingContext(prev => ({ ...prev, ...event }));
    }
  };

  const addParticipant = (participant) => {
    console.log('Adding simulated participant:', participant);
    setParticipants(prev => [...prev, {
      ...participant,
      roomName: null, // Start in main room
      role: participant.isCoHost ? 1 : 0
    }]);
  };

  const updateParticipantCriteria = (participantId, criteria) => {
    setParticipantCriteria(prev => ({
      ...prev,
      [participantId]: criteria
    }));
  };

  return (
    <ZoomContext.Provider value={{
      client,
      isInitialized,
      error,
      meetingContext,
      breakoutRooms,
      participants,
      isHost,
      participantCriteria,
      updateParticipantCriteria,
      addParticipant
    }}>
      {children}
    </ZoomContext.Provider>
  );
}

export function useZoom() {
  return useContext(ZoomContext);
}

export default ZoomContext; 