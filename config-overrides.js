const { override } = require('customize-cra');

module.exports = override((config) => {
  config.devtool = 'source-map';
  
  config.devServer = {
    ...config.devServer,
    headers: {
      'Access-Control-Allow-Origin': 'https://grown-peaceful-oyster.ngrok-free.app',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self' https://grown-peaceful-oyster.ngrok-free.app https://*.zoom.us",
        "frame-ancestors 'self' https://*.zoom.us",
        "base-uri 'self'"
      ].join('; '),
      
      'X-Frame-Options': 'ALLOW-FROM https://*.zoom.us',
      
      'X-Content-Type-Options': 'nosniff',
      
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  };

  config.resolve = {
    ...config.resolve,
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  };

  return config;
});