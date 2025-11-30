# Backend Connection Troubleshooting

## Quick Checks

### 1. Is your backend server running?
```bash
# Check if something is running on port 4000
netstat -an | findstr :4000
```

### 2. Test your backend directly from your computer:
```bash
# Test with curl (install via: winget install curl.curl)
curl -X POST http://localhost:4000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"123456\",\"name\":\"Test User\"}"
```

### 3. Alternative URLs to try:
If `http://10.0.2.2:4000` doesn't work, try these in order:

1. **For Android Emulator:**
   - `http://10.0.2.2:4000` (current)
   - `http://localhost:4000` 
   - `http://127.0.0.1:4000`

2. **For Physical Device:**
   - Find your computer's IP: `ipconfig` 
   - Use: `http://[YOUR_IP]:4000` (e.g., `http://192.168.1.100:4000`)

3. **For iOS Simulator:**
   - `http://localhost:4000`

### 4. Update API URL:
Edit `constants/api.js` and change the default URL:

```javascript
// For different environments:
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
```

### 5. Test with environment variable:
```powershell
# Set different API URL for testing
$env:EXPO_PUBLIC_API_URL = 'http://localhost:4000'
npm start
```

## Common Backend Issues:

### CORS not configured:
Your backend needs CORS headers:
```javascript
const cors = require('cors');
app.use(cors());
```

### Wrong route:
Make sure your backend has:
```javascript
app.post('/auth/register', (req, res) => {
  // Handle signup
});
```

### Not listening on correct interface:
```javascript
// Instead of:
app.listen(4000, 'localhost')

// Use:
app.listen(4000, '0.0.0.0') // Listen on all interfaces
```

## Test Steps:
1. Start your backend server
2. Test the `/api-test` screen in your app
3. Try the "Test API Connection" button
4. Check console logs for detailed error messages