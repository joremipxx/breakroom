export const zoomConfig = {
  sdkKey: process.env.REACT_APP_ZOOM_CLIENT_ID,
  sdkSecret: process.env.REACT_APP_ZOOM_CLIENT_SECRET,
  role: 1, // 1 for host, 0 for attendee
  leaveUrl: 'https://localhost:3001', // URL to redirect to when leaving the meeting
  userName: 'Coach Paradox',
  language: 'fr-FR'
}; 