/**
 * Debug server script with enhanced error handling
 */
require('dotenv').config();
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Set up log files
const logFile = path.join(logsDir, 'debug.log');
const errorLogFile = path.join(logsDir, 'error.log');

// Create or clear log files
fs.writeFileSync(logFile, '');
fs.writeFileSync(errorLogFile, '');

// Configure log streams
const logStream = fs.createWriteStream(logFile, { flags: 'a' });
const errorLogStream = fs.createWriteStream(errorLogFile, { flags: 'a' });

console.log('Starting debug server with enhanced logging...');
console.log(`Logs will be written to: ${logFile}`);
console.log(`Error logs will be written to: ${errorLogFile}`);

// Define a function to log with timestamp
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  logStream.write(logMessage + '\n');
}

function errorLog(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ERROR: ${message}`;
  console.error(logMessage);
  errorLogStream.write(logMessage + '\n');
}

// Start the server using ts-node with uncaughtException handler
// For Windows, we need to include the full path or use npx.cmd
const isWindows = process.platform === 'win32';
const npxCommand = isWindows ? 'npx.cmd' : 'npx';

console.log(`Using command: ${npxCommand} ts-node src/index.ts`);

const server = spawn(npxCommand, ['ts-node', 'src/index.ts'], {
  env: { 
    ...process.env,
    NODE_ENV: 'development',
    DEBUG: '*',
    TS_NODE_PROJECT: path.join(__dirname, 'tsconfig.json')
  },
  stdio: 'pipe',
  shell: true // Use shell on Windows
});

// Log server output
server.stdout.on('data', (data) => {
  log(data.toString().trim());
});

// Log server errors
server.stderr.on('data', (data) => {
  errorLog(data.toString().trim());
});

// Handle server exit
server.on('close', (code) => {
  if (code !== 0) {
    errorLog(`Server process exited with code ${code}`);
  } else {
    log('Server process exited normally');
  }
});

// Add unhandled exception logging
process.on('uncaughtException', (err) => {
  errorLog(`Uncaught exception: ${err.message}\n${err.stack}`);
});

process.on('unhandledRejection', (reason, promise) => {
  errorLog(`Unhandled rejection: ${reason}`);
});

// Log server PID
log(`Server started with PID: ${server.pid}`);
