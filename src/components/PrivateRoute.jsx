import React from 'react';
import { Navigate } from 'react-router-dom';
import { useZoom } from '../context/ZoomContext';

function PrivateRoute({ children }) {
  const { client, isInitialized, error } = useZoom();

  // If there's an error, redirect to error page
  if (error) {
    return <Navigate to="/error" replace />;
  }

  // If not initialized or no client, redirect to home
  if (!isInitialized || !client) {
    return <Navigate to="/" replace />;
  }

  // Check if in a meeting
  const checkMeeting = async () => {
    try {
      const context = await client.getMeetingContext();
      if (!context || !context.meetingId) {
        return <Navigate to="/no-meeting" replace />;
      }
    } catch (err) {
      console.error('Failed to get meeting context:', err);
      return <Navigate to="/error" replace />;
    }
  };

  // If all checks pass, render the protected component
  return children;
}

export default PrivateRoute; 