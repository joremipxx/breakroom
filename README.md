# Paradox Breakout Room Manager

A powerful Zoom App for managing breakout rooms with advanced features for participant grouping and session management.

## Features

### Room Management
- Create and manage breakout rooms with customizable settings
- Set minimum, preferred, and maximum participants per room
- Real-time participant tracking and room status
- Automatic room creation based on participant count

### Assignment Methods
- Random assignment
- Criteria-based grouping:
  - Skill level
  - Interests
  - Personality types
- CSV import for participant criteria
- Manual reassignment capabilities

### Timer and Scheduling
- Configurable session duration
- Auto-shuffle feature at specified intervals
- Session timer with pause/resume functionality
- Automatic room closure at session end

### Participant Management
- Search and filter participants
- Pagination (20 participants per page)
- Track participant history and previous room assignments
- Co-host management and exclusion options
- Participant criteria tracking

## Setup

1. **Prerequisites**
   - Node.js (v14 or higher)
   - Zoom account with app development access
   - Zoom SDK credentials

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]

   # Install dependencies
   npm install

   # Configure environment variables
   cp .env.example .env
   # Add your Zoom SDK credentials to .env
   ```

3. **Configuration**
   - Register your app in the Zoom Marketplace
   - Configure the following scopes:
     - Breakout Room:Read
     - Breakout Room:Write
     - Meeting:Read
     - Meeting:Write

## Usage

### Basic Operation
1. Start a Zoom meeting
2. Launch the Breakout Room Manager from the Apps tab
3. Configure room settings (size, criteria, duration)
4. Click "Start Session" to create and open rooms

### Participant Import
1. Navigate to the "Import Participants" tab
2. Prepare CSV file with columns:
   - name
   - email
   - Skill Level
   - Interest Area
   - Experience
3. Upload CSV file through drag-and-drop or file selector

### Room Assignment
1. Choose assignment method:
   - Random
   - Criteria-based
2. Set room size preferences
3. Configure shuffle settings (if desired)
4. Start the session

### Managing Active Sessions
1. Monitor participant distribution
2. Use search to find specific participants
3. Reassign participants as needed
4. End session to return all participants to main room

## Development

### Project Structure
```
src/
├── components/         # React components
├── context/           # Context providers
├── utils/             # Utility functions
└── App.css            # Global styles
```

### Key Components
- `ZoomApp`: Main application component
- `RoomSettings`: Room configuration
- `Timer`: Session timing
- `ParticipantList`: Participant management
- `CriteriaGrouping`: Grouping logic

## Troubleshooting

### Common Issues
1. **Room Creation Fails**
   - Verify host permissions
   - Check participant count requirements
   - Ensure valid room names

2. **Participant Assignment Issues**
   - Verify participant data format
   - Check room capacity settings
   - Confirm participant availability

3. **Timer Problems**
   - Check duration settings
   - Verify browser permissions
   - Ensure active session state

## Support

For issues and feature requests, please:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Include steps to reproduce any problems

## License

[License Type] - See LICENSE file for details# breakroom
