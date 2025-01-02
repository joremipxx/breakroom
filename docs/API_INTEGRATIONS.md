# Paradox Breakout Room Manager - API Integrations

## Table of Contents
1. [Zoom SDK Integration](#zoom-sdk-integration)
2. [Authentication](#authentication)
3. [Available Endpoints](#available-endpoints)
4. [Event Handling](#event-handling)
5. [Error Handling](#error-handling)

## Zoom SDK Integration

### SDK Setup
```javascript
// Initialize Zoom SDK
const client = await zoomSdk.config({
  version: '2.10.0',
  capabilities: [
    'breakoutRoom:read',
    'breakoutRoom:write',
    'participant:read',
    'meeting:write'
  ]
});
```

### Required Permissions
- `breakoutRoom:read`: Read breakout room information
- `breakoutRoom:write`: Create and manage breakout rooms
- `participant:read`: Access participant information
- `meeting:write`: Modify meeting settings

## Authentication

### OAuth 2.0 Flow
1. **Client Credentials**
   ```javascript
   const config = {
     clientId: process.env.ZOOM_CLIENT_ID,
     clientSecret: process.env.ZOOM_CLIENT_SECRET,
     redirectUri: process.env.ZOOM_REDIRECT_URI
   };
   ```

2. **Authorization**
   ```javascript
   const authUrl = `https://zoom.us/oauth/authorize?
     response_type=code&
     client_id=${clientId}&
     redirect_uri=${redirectUri}`;
   ```

3. **Token Exchange**
   ```javascript
   const tokenResponse = await fetch('https://zoom.us/oauth/token', {
     method: 'POST',
     headers: {
       'Authorization': `Basic ${base64Credentials}`,
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     body: `code=${authCode}&grant_type=authorization_code&
            redirect_uri=${redirectUri}`
   });
   ```

## Available Endpoints

### Breakout Room Management

1. **Create Breakout Rooms**
   ```javascript
   async function createBreakoutRooms({
     name,
     participantCount,
     participants,
     duration,
     assignmentMode
   }) {
     return await client.createBreakoutRooms({
       name,
       participantCount,
       participants,
       duration,
       assignmentMode
     });
   }
   ```

2. **Open Breakout Rooms**
   ```javascript
   async function openBreakoutRooms() {
     return await client.openBreakoutRooms();
   }
   ```

3. **Close Breakout Rooms**
   ```javascript
   async function closeBreakoutRooms() {
     return await client.closeBreakoutRooms();
   }
   ```

### Participant Management

1. **Get Participants**
   ```javascript
   async function getParticipants() {
     return await client.getParticipants();
   }
   ```

2. **Assign Participant**
   ```javascript
   async function assignParticipant({
     participantId,
     roomId
   }) {
     return await client.assignParticipantToBreakoutRoom({
       participantId,
       roomId
     });
   }
   ```

3. **Update Participant Criteria**
   ```javascript
   async function updateParticipantCriteria(
     userId,
     criteria
   ) {
     return await client.updateParticipantCriteria(userId, {
       skillLevel: criteria.skillLevel,
       interestArea: criteria.interestArea,
       experience: criteria.experience
     });
   }
   ```

## Event Handling

### Available Events
```javascript
// Participant events
client.on('participant-joined', handleParticipantJoined);
client.on('participant-left', handleParticipantLeft);
client.on('participant-updated', handleParticipantUpdated);

// Room events
client.on('breakout-room-created', handleRoomCreated);
client.on('breakout-room-updated', handleRoomUpdated);
client.on('breakout-room-deleted', handleRoomDeleted);
```

### Event Handlers
```javascript
function handleParticipantJoined(participant) {
  // Handle new participant
  console.log('Participant joined:', participant);
}

function handleRoomCreated(room) {
  // Handle new room
  console.log('Room created:', room);
}
```

## Error Handling

### Common Error Types
```javascript
try {
  await client.createBreakoutRooms(config);
} catch (error) {
  switch (error.code) {
    case 'NOT_IN_MEETING':
      console.error('Must be in an active meeting');
      break;
    case 'INSUFFICIENT_PERMISSIONS':
      console.error('Missing required permissions');
      break;
    case 'INVALID_PARAMETERS':
      console.error('Invalid room configuration');
      break;
    default:
      console.error('Unknown error:', error);
  }
}
```

### Error Response Format
```javascript
{
  code: 'ERROR_CODE',
  message: 'Human readable error message',
  details: {
    // Additional error context
  }
}
```

## Rate Limits

### API Quotas
- Room Creation: 100 requests/minute
- Participant Updates: 200 requests/minute
- Room Assignment: 150 requests/minute

### Handling Rate Limits
```javascript
async function makeApiRequest(fn) {
  try {
    return await fn();
  } catch (error) {
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      // Wait and retry
      await delay(1000);
      return makeApiRequest(fn);
    }
    throw error;
  }
}
```

## Testing

### Mock Client
```javascript
const mockClient = {
  createBreakoutRooms: jest.fn(),
  openBreakoutRooms: jest.fn(),
  closeBreakoutRooms: jest.fn(),
  // ... other methods
};
```

### Example Test
```javascript
describe('Breakout Room Management', () => {
  test('creates rooms successfully', async () => {
    const config = {
      name: 'Test Room',
      participantCount: 4,
      participants: [],
      duration: 15,
      assignmentMode: 'random'
    };
    
    await client.createBreakoutRooms(config);
    expect(mockClient.createBreakoutRooms)
      .toHaveBeenCalledWith(config);
  });
});
```

## Best Practices

1. **Error Handling**
   - Always implement proper error handling
   - Provide meaningful error messages
   - Log errors for debugging

2. **Rate Limiting**
   - Implement exponential backoff
   - Cache responses when possible
   - Batch updates when possible

3. **Testing**
   - Use mock client for tests
   - Test error scenarios
   - Validate response handling

4. **Security**
   - Store credentials securely
   - Implement proper OAuth flow
   - Validate all inputs

## Support

For API-related issues:
1. Check the [Zoom API documentation](https://marketplace.zoom.us/docs/api-reference/introduction)
2. Visit the [Developer Forum](https://devforum.zoom.us/)
3. Contact Zoom Developer Support 