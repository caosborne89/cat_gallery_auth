const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;

// Serve static files from the "web" directory
app.use(express.static(path.join(__dirname, 'web')));

// Proxy requests to AWS Cognito to avoid CORS issues
app.use('/auth', createProxyMiddleware({
  target: 'https://us-west-2n9yh2zkeq.auth.us-west-2.amazoncognito.com',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', // Removes '/auth' prefix before forwarding
  },
  onProxyRes: function (proxyRes) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

// Serve the frontend (fallback for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

// Start the server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
