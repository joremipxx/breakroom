import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.0/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

export const initializeZoomMeeting = async (meetingId) => {
  try {
    const response = await fetch('/api/zoom-signature', {
      method: 'POST',
      body: JSON.stringify({ meetingId }),
      headers: { 'Content-Type': 'application/json' },
    });
    
    const { signature, sdkKey } = await response.json();

    ZoomMtg.init({
      leaveUrl: window.location.origin,
      success: (success) => {
        console.log(success);
        ZoomMtg.join({
          sdkKey: sdkKey,
          signature: signature,
          meetingNumber: meetingId,
          userName: 'Coach', // This should come from your auth system
          success: (joinResponse) => {
            console.log('Joined meeting:', joinResponse);
          },
          error: (error) => {
            console.error('Failed to join meeting:', error);
          }
        });
      },
      error: (error) => {
        console.error('Failed to initialize Zoom:', error);
      }
    });
  } catch (error) {
    console.error('Failed to get signature:', error);
  }
}; 