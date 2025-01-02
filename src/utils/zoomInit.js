import zoomSdk from '@zoom/appssdk';

const zoomCapabilities = [
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
  'closeBreakoutRooms',
  'getBreakoutRoomList'
];

export const initializeZoomSdk = async () => {
  try {
    console.log('Starting SDK configuration...');
    
    // Configure SDK
    await zoomSdk.config({
      capabilities: zoomCapabilities,
      version: '0.16.24',
      language: 'en',
      popoutSize: { width: 350, height: 954 }
    });
    
    console.log('SDK configuration complete');

    // Check if running in Zoom client
    const runningContext = await zoomSdk.getRunningContext();
    console.log('Running context:', runningContext);
    
    if (runningContext !== 'inZoomClient') {
      throw new Error('This app must be run within the Zoom client');
    }

    // Authorize the app
    console.log('Authorizing app...');
    await zoomSdk.authorize();
    console.log('App authorized');

    return zoomSdk;
  } catch (error) {
    console.error('Failed to initialize Zoom SDK:', error);
    throw error;
  }
};

export default initializeZoomSdk; 