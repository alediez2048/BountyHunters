/**
 * Truck Driver Communication System
 * Main application entry point
 */

// Import configuration
const config = require('../config');
const { app: appConfig, db } = config;

// Import dependencies
const express = require('express');
const winston = require('winston');

// Import local modules
const setupBot = require('./bot/setup');
const apiRoutes = require('./api/routes');
const { setupLogger, requestIdMiddleware, requestLogger } = require('./utils/logger');

// Initialize logger
const logger = setupLogger();

// Create Express app
const app = express();
const PORT = appConfig.server.port;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestIdMiddleware);
app.use(requestLogger(logger));

// API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: appConfig.server.env,
    version: process.env.npm_package_version || '0.1.0'
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await db.connectDB();
    
    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${appConfig.server.env} mode`);
      
      // Initialize Telegram bot
      setupBot();
      logger.info('Telegram bot initialized');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled promise rejection:', reason);
  process.exit(1);
}); 