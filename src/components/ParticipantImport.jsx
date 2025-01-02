import React, { useState } from 'react';

function ParticipantImport({ onImport }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      processCSV(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      processCSV(file);
    }
  };

  const processCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n');
      const headers = rows[0].split(',').map(header => header.trim());
      
      const participants = rows.slice(1)
        .filter(row => row.trim())
        .map(row => {
          const values = row.split(',').map(value => value.trim());
          return {
            name: values[0],
            email: values[1],
            skillLevel: values[2],
            interestArea: values[3],
            experience: values[4]
          };
        });

      onImport(participants);
    };
    reader.readAsText(file);
  };

  return (
    <div className="feature-card">
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600',
        letterSpacing: '-0.5px',
        margin: '0 0 16px 0'
      }}>
        CSV Import Instructions
      </h3>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ 
          fontSize: '14px', 
          color: '#666',
          marginBottom: '8px'
        }}>
          Your CSV file should include the following columns:
        </p>
        <div style={{
          background: '#f8f9fa',
          padding: '12px',
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontSize: '13px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          name, email, Skill Level, Interest Area, Experience
        </div>
        
        <p style={{ 
          fontSize: '14px', 
          color: '#666',
          marginTop: '16px',
          marginBottom: '8px'
        }}>
          Example row:
        </p>
        <div style={{
          background: '#f8f9fa',
          padding: '12px',
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontSize: '13px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          John Doe, john@example.com, Advanced, Frontend, 2-5 years
        </div>
      </div>

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? '#8D2146' : '#e1e1e1'}`,
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center',
          backgroundColor: isDragging ? '#FFF5F8' : '#ffffff',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
      >
        <p style={{ 
          fontSize: '14px',
          color: '#666',
          margin: '0 0 16px 0'
        }}>
          Drag and drop your CSV file here
        </p>
        <p style={{ 
          fontSize: '14px',
          color: '#666',
          margin: '0 0 16px 0'
        }}>
          or
        </p>
        <button 
          className="zoom-button"
          onClick={() => document.querySelector('input[type="file"]').click()}
          style={{
            padding: '8px 16px',
            fontSize: '14px'
          }}
        >
          SELECT FILE
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </button>
      </div>
    </div>
  );
}

export default ParticipantImport; 