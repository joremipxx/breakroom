const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();

// Basic middleware
app.use(cors());

// Set security headers BEFORE other middleware
app.use((req, res, next) => {
  // HSTS header
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://grown-peaceful-oyster.ngrok-free.app https://*.zoom.us; " +
    "frame-ancestors 'self' https://*.zoom.us; " +
    "base-uri 'self'"
  );

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Log headers for verification
  console.log('Headers being set:', {
    sts: res.getHeader('Strict-Transport-Security'),
    cto: res.getHeader('X-Content-Type-Options'),
    csp: res.getHeader('Content-Security-Policy'),
    rp: res.getHeader('Referrer-Policy')
  });

  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));

// All other routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;

// Start HTTPS server
if (process.env.HTTPS === 'true') {
  const https = require('https');
  const fs = require('fs');
  
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY_FILE),
    cert: fs.readFileSync(process.env.SSL_CRT_FILE),
    minVersion: 'TLSv1.2',
    secureProtocol: 'TLSv1_2_method'
  };

  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} 