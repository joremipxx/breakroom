import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import zoomSdk from '@zoom/appssdk';
import '../styles/ZoomCallback.css';

function ZoomCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Configure SDK with breakout room capabilities
        await zoomSdk.config({
          capabilities: [
            'authorize',
            'onAuthorized',
            'onConnect',
            'connect',
            'postMessage',
            'getMeetingContext',
            'getMeetingParticipants',
            'getRunningContext',
            'onMeeting',
            'onActiveSpeakerChange',
            'onParticipantChange',
            'onBreakoutRoomChange',
            'onMeetingConfigChanged',
            'onExpandApp',
            'createBreakoutRooms',
            'configureBreakoutRooms',
            'openBreakoutRooms',
            'closeBreakoutRooms'
          ],
          version: '0.16.24'
        });

        // Handle authorization
        await zoomSdk.connect();
        
        // Navigate to the breakout room manager
        navigate('/meeting');
      } catch (error) {
        console.error('Zoom authorization failed:', error);
        navigate('/error');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="zoom-callback">
      <div className="callback-content">
        <h2>Connecting to Zoom...</h2>
        <p>Please wait while we set up your breakout room manager.</p>
      </div>
    </div>
  );
}

export default ZoomCallback; 