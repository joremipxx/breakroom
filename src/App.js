import React from 'react';
import { ZoomProvider } from './context/ZoomContext';
import ZoomApp from './components/ZoomApp';
import './App.css';

function App() {
  return (
    <ZoomProvider>
      <div className="App">
        <ZoomApp />
      </div>
    </ZoomProvider>
  );
}

export default App; 