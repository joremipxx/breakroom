import React from 'react';

function ShuffleSettings({ 
  enableReshuffle,
  onEnableChange,
  reshuffleTime,
  onReshuffleTimeChange,
  sessionDuration
}) {
  return (
    <div className="feature-card">
      <h3>Shuffle Settings</h3>
      <div className="settings-row">
        <label>
          <input
            type="checkbox"
            checked={enableReshuffle}
            onChange={(e) => onEnableChange(e.target.checked)}
          />
          Enable Auto-Shuffle
        </label>
      </div>
      
      {enableReshuffle && (
        <div className="settings-row">
          <label>
            Shuffle at (minutes):
            <input
              type="number"
              min={1}
              max={sessionDuration - 1}
              value={reshuffleTime}
              onChange={(e) => {
                const value = Math.min(
                  Math.max(1, parseInt(e.target.value) || 1),
                  sessionDuration - 1
                );
                onReshuffleTimeChange(value);
              }}
            />
          </label>
          <p className="helper-text">
            Participants will be automatically reshuffled into new rooms when {reshuffleTime} minutes remain
          </p>
        </div>
      )}
    </div>
  );
}

export default ShuffleSettings; 