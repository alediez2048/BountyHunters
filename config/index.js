/**
 * Main Configuration
 * Exports all configuration modules
 */

// Load environment variables
require('dotenv').config();

// Import configuration modules
const database = require('./database');
const telegram = require('./telegram');

// Application configuration
const appConfig = {
  // Server settings
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    host: process.env.HOST || 'localhost'
  },
  
  // Logging settings
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'pretty'
  },
  
  // Security settings
  security: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || '24h',
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100 // 100 requests per 15 minutes
  },
  
  // Location settings
  location: {
    geofenceRadius: parseInt(process.env.GEOFENCE_RADIUS_METERS, 10) || 500,
    updateInterval: parseInt(process.env.LOCATION_UPDATE_INTERVAL_MINUTES, 10) || 15
  }
};

module.exports = {
  app: appConfig,
  db: database,
  telegram: telegram
}; 