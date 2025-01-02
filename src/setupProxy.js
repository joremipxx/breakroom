const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://localhost:3001',
      secure: false,
      changeOrigin: true,
      onProxyReq: function(proxyReq, req, res) {
        console.log('Proxying request to:', proxyReq.path);
      }
    })
  );
}; 