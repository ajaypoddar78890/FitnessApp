#!/usr/bin/env node
const { getLocalIPAddress } = require('./start-with-ip.js');

console.log('🔍 Your computer\'s detected IP:', getLocalIPAddress());
console.log('✅ This IP will be used automatically when you run "npm start"');