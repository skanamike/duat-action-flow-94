const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8888;

// In-memory storage for development testing
const mockResponses = [];
const requests = [];

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Log all requests for debugging
  const requestData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers
  };

  console.log(`📡 API Mock Received: ${req.method} ${req.url}`);

  if (req.url.startsWith('/.netlify/functions/send-contact') && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        
        // Log the request details
        requestData.payload = payload;
        requests.push(requestData);
        
        console.log('📧 Contact Form Submission:', {
          name: payload.name,
          email: payload.email,
          company: payload.company,
          message: payload.message?.substring(0, 100) + '...'
        });

        // Simulate processing delay
        setTimeout(() => {
          const response = {
            message: 'Message sent successfully (Mock)',
            details: {
              status: 'success',
              id: `mock_${Date.now()}`,
              email_sent: true,
              timestamp: new Date().toISOString(),
              payload_received: payload
            }
          };

          mockResponses.push(response);
          
          console.log('✅ Mock API Response:', response);
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(response));
        }, 1000);

      } catch (error) {
        console.error('❌ Error parsing request body:', error);
        
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          message: 'Invalid JSON in request body',
          error: error.message
        }));
      }
    });

  } else {
    // Handle other endpoints
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Mock endpoint not found',
      available_endpoints: [
        'POST /.netlify/functions/send-contact'
      ]
    }));
  }
});

// API endpoints for debugging
server.on('request', (req, res) => {
  // Add admin endpoints for monitoring
  if (req.url === '/admin/requests' && req.method === 'GET') {
    console.log('📊 Admin: Fetching requests...');
    
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({
      requests: requests.slice(-50), // Last 50 requests
      response_count: mockResponses.length,
      server_info: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      }
    }, null, 2));
  }

  if (req.url === '/admin/clear' && req.method === 'POST') {
    requests.length = 0;
    mockResponses.length = 0;
    
    console.log('🧹 Admin: Cleared mock data');
    
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({
      message: 'Mock data cleared',
      timestamp: new Date().toISOString()
    }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/.netlify/functions/send-contact`);
  console.log(`   GET  http://localhost:${PORT}/admin/requests`);
  console.log(`   POST http://localhost:${PORT}/admin/clear`);
  console.log('');
  console.log('💡 This is a development mock server for testing API calls');
  console.log('🔧 Use for local development when Netlify functions are not available');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down mock API server...');
  server.close(() => {
    console.log('✅ Mock API server closed');
    process.exit(0);
  });
});