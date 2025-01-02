import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ZoomApp from './components/ZoomApp';
import ZoomCallback from './components/ZoomCallback';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/oauth/callback" element={<ZoomCallback />} />
        <Route path="/meeting" element={<PrivateRoute><ZoomApp /></PrivateRoute>} />
        <Route path="/" element={<PrivateRoute><ZoomApp /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App; 