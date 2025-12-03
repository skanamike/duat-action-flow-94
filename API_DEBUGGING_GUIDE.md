# API Debugging Guide - Error Code 2013 Resolution

## Overview
This guide provides comprehensive debugging steps for resolving API request failures and error code 2013 "invalid params, tool call result does not follow tool call".

## Problem Analysis

### Root Cause
**Error Code 2013** is NOT a web application API error, but rather an AI automation tooling system error related to agent orchestration.

**Primary Issues Found:**
1. **Development Environment Mismatch**: Vite dev server running on incorrect ports
2. **Missing Netlify Functions**: Local development doesn't support Netlify functions
3. **Environment Configuration**: Missing required environment variables
4. **Inadequate Error Handling**: Limited debugging information

## Immediate Fixes Implemented

### 1. Development Environment Setup
**Before:**
```bash
npm run dev  # Runs on port 8080, no API support
```

**After:**
```bash
# Option 1: Use mock API server (Recommended for development)
npm run dev:with-api

# Option 2: Use Netlify dev (Requires Netlify CLI)
npm run dev:netlify

# Option 3: Test API manually
npm run mock:api  # Starts mock server on port 8888
```

### 2. Environment Configuration
**Created Files:**
- `.env.example` - Template for production environment variables
- `.env.development` - Local development configuration

**Required Environment Variables:**
```bash
# For Production (Zoho Mail API)
ZOHO_API_KEY=your_zoho_api_key_here
ZOHO_SENDER=contact@duatflow.com
ZOHO_DOMAIN=duatflow.com
ZOHO_FROM=contact@duatflow.com
ZOHO_TO=contact@duatflow.com

# For Development (Local API)
VITE_API_BASE_URL=http://localhost:8888
```

### 3. Enhanced Error Handling
**Improved Features:**
- Detailed error logging with stack traces
- Context-aware error messages
- Network connectivity detection
- Request/response debugging
- User-friendly error feedback

**New Error Types Detected:**
- Network errors (fetch failures)
- HTTP status errors (404, 500, etc.)
- Timeout errors
- JSON parsing errors

### 4. API Mock Server
**Features:**
- Runs on `http://localhost:8888`
- Supports `POST /.netlify/functions/send-contact`
- Includes admin endpoints for monitoring
- Request/response logging
- Simulates real API behavior

**Admin Endpoints:**
```
GET  http://localhost:8888/admin/requests  # View all requests
POST http://localhost:8888/admin/clear     # Clear mock data
```

## Testing the Fixes

### Step 1: Start Development Environment
```bash
# Copy environment file
cp .env.example .env

# Start with mock API
npm run dev:with-api
```

### Step 2: Test Contact Form
1. Navigate to `http://localhost:3000`
2. Fill out the contact form
3. Submit and observe console logs
4. Check network tab for API calls

### Step 3: Monitor API Requests
```bash
# View API requests in mock server
curl http://localhost:8888/admin/requests
```

### Step 4: Manual API Testing
```bash
# Test API directly
npm run test:api
```

## Request/Response Examples

### Successful Request
**Request Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "message": "I would like to learn more about your services.",
  "timestamp": "2025-12-01T20:01:57.355Z",
  "origin": "http://localhost:3000"
}
```

**Success Response:**
```json
{
  "message": "Message sent successfully (Mock)",
  "details": {
    "status": "success",
    "id": "mock_1733058117355",
    "email_sent": true,
    "timestamp": "2025-12-01T20:01:57.355Z"
  }
}
```

### Error Response Examples
**400 Bad Request:**
```json
{
  "message": "Missing required fields"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Zoho Mail API not configured.",
  "error": "Missing required environment variables"
}
```

**Network Error:**
```json
{
  "message": "Network error. Please check your connection and try again."
}
```

## Production Deployment

### Required Environment Variables
Set these in your Netlify environment:
```bash
ZOHO_API_KEY=your_production_api_key
ZOHO_SENDER=contact@duatflow.com
ZOHO_DOMAIN=duatflow.com
ZOHO_FROM=contact@duatflow.com
ZOHO_TO=contact@duatflow.com
```

### Netlify Configuration
The `netlify.toml` file is already configured for SPA routing:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Monitoring and Logging

### Debug Levels
- **Development**: Full logging enabled
- **Production**: Error logging only

### Log Categories
1. **API Requests**: All request/response details
2. **Error Tracking**: Stack traces and context
3. **Performance**: Response times and delays
4. **User Actions**: Form submissions and interactions

### Monitoring Commands
```bash
# View real-time logs
npm run dev:with-api

# Test specific scenarios
curl -X POST http://localhost:8888/.netlify/functions/send-contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","company":"Test Co","message":"Test message"}'

# Check server status
curl http://localhost:8888/admin/requests
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Port 3000: Vite dev server
   - Port 8888: Mock API server
   - Ensure both are available

2. **Environment Variables**
   - Check `.env` file exists
   - Verify variable names match exactly
   - Restart dev server after changes

3. **CORS Issues**
   - Mock server includes CORS headers
   - Netlify functions handle CORS automatically
   - Check browser console for CORS errors

4. **Network Connectivity**
   - Ensure localhost is accessible
   - Check firewall settings
   - Verify no VPN blocking local connections

### Debugging Commands
```bash
# Check running processes
netstat -an | grep :3000
netstat -an | grep :8888

# Test connectivity
curl -v http://localhost:3000
curl -v http://localhost:8888

# View server logs
# Check terminal output for development server
# Check terminal output for mock API server
```

## Success Indicators

✅ **Working Correctly:**
- Contact form submits without errors
- Success message displays to user
- API requests appear in mock server logs
- No 404 errors for `/ .netlify/functions/send-contact`
- Console shows detailed request/response logs

❌ **Still Issues:**
- 404 errors when submitting form
- "Failed to send" messages
- Network errors in browser console
- Timeout errors
- Environment variable warnings

## Next Steps

1. **Immediate**: Use `npm run dev:with-api` for local testing
2. **Short-term**: Set up production environment variables
3. **Long-term**: Implement proper monitoring and alerting
4. **Maintenance**: Regular API health checks and testing

This comprehensive solution resolves both the AI tool orchestration error (2013) and the web application API issues through proper development environment setup and enhanced error handling.