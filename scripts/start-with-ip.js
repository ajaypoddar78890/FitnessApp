#!/usr/bin/env node
const { execSync, spawn } = require('child_process');
const os = require('os');

/**
 * Automatically detect the computer's IP address and start Metro with it
 */
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  
  // Look for IPv4 addresses that are not localhost and are on local network
  for (const interfaceName of Object.keys(interfaces)) {
    const iface = interfaces[interfaceName];
    for (const alias of iface) {
      // Skip over non-IPv4 and internal (localhost) addresses
      if (alias.family === 'IPv4' && !alias.internal) {
        // Prefer 192.168.x.x or 10.x.x.x addresses (common local networks)
        if (alias.address.startsWith('192.168.') || alias.address.startsWith('10.')) {
          return alias.address;
        }
      }
    }
  }
  
  // Fallback: return first non-internal IPv4 address
  for (const interfaceName of Object.keys(interfaces)) {
    const iface = interfaces[interfaceName];
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  
  // Last resort
  return 'localhost';
}

function startMetroWithIP() {
  const ip = getLocalIPAddress();
  
  console.log('🔍 Detected computer IP:', ip);
  console.log('🚀 Starting Metro bundler with IP:', ip);
  console.log('📱 Your device will be able to connect to:', `http://${ip}:8081`);
  console.log('🔗 Backend API will be available at:', `http://${ip}:4000`);
  console.log('');
  
  // Start Metro with the detected IP
  const args = ['react-native', 'start', '--host', ip, ...process.argv.slice(2)];
  
  const metro = spawn('npx', args, {
    stdio: 'inherit',
    shell: true
  });
  
  metro.on('close', (code) => {
    console.log(`Metro exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Metro...');
    metro.kill('SIGINT');
  });
}

if (require.main === module) {
  startMetroWithIP();
}

module.exports = { getLocalIPAddress, startMetroWithIP };