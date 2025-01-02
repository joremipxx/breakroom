// Zoom SDK Configuration
export const zoomConfig = {
  // SDK Version
  sdkVersion: '0.16.24',

  // Required capabilities for breakout room management
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

  // Meeting roles
  roles: {
    HOST: 1,
    PARTICIPANT: 0
  },

  // Breakout room settings
  breakoutRooms: {
    maxRooms: 50,          // Maximum number of breakout rooms
    defaultDuration: 30,    // Default duration in minutes
    waitTime: 60,          // Wait time in seconds before closing rooms
    defaultOptions: {
      allowParticipantsToChooseRoom: true,
      allowParticipantsToReturnToMainSession: true,
      autoCloseAfterDuration: false,
      autoMoveParticipantsToRooms: false
    }
  },

  // Event types for breakout rooms
  events: {
    BREAKOUT_ROOM_CHANGE: 'onBreakoutRoomChange',
    PARTICIPANT_CHANGE: 'onParticipantChange',
    MEETING_CONFIG_CHANGE: 'onMeetingConfigChanged',
    ACTIVE_SPEAKER_CHANGE: 'onActiveSpeakerChange',
    AUTHORIZED: 'onAuthorized',
    CONNECTED: 'onConnect',
    MEETING: 'onMeeting'
  },

  // Error messages
  errors: {
    NOT_IN_MEETING: 'Not currently in a meeting',
    NOT_AUTHORIZED: 'Not authorized to perform this action',
    NOT_HOST: 'Only the host can perform this action',
    ROOM_CREATE_FAILED: 'Failed to create breakout room',
    ROOM_OPEN_FAILED: 'Failed to open breakout rooms',
    ROOM_CLOSE_FAILED: 'Failed to close breakout rooms',
    ASSIGN_PARTICIPANT_FAILED: 'Failed to assign participant to room'
  },

  // Status messages
  status: {
    INITIALIZING: 'Initializing...',
    CONNECTING: 'Connecting to Zoom...',
    AUTHORIZED: 'Authorized',
    CONNECTED: 'Connected',
    IN_MEETING: 'In Meeting',
    ERROR: 'Error'
  }
};

// Helper functions for breakout rooms
export const breakoutRoomHelpers = {
  // Generate a unique room name
  generateRoomName: (existingRooms) => {
    const count = existingRooms.length + 1;
    return `Room ${count}`;
  },

  // Validate room creation parameters
  validateRoomParams: (params) => {
    const { name, participantCount } = params;
    if (!name) throw new Error('Room name is required');
    if (participantCount < 0) throw new Error('Invalid participant count');
    return true;
  },

  // Format room data for display
  formatRoomData: (room) => ({
    id: room.id,
    name: room.name,
    participantCount: room.participantCount || 0,
    isOpen: room.isOpen || false,
    participants: room.participants || []
  }),

  // Check if user is host
  isUserHost: (context) => context?.role === zoomConfig.roles.HOST
};

export default {
  zoomConfig,
  breakoutRoomHelpers
}; 