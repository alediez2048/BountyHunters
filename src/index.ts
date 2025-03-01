/**
 * Truck Driver Communication System
 * Main application entry point
 */

// Import configuration
import { config } from '../config';
import database from '../config/database';

// Import dependencies
import express, { Request, Response } from 'express';
import path from 'path';

// Import local modules
import setupBot from './bot/setup';
import apiRoutes from './api/routes';
import logger, { requestIdMiddleware, requestLogger } from './utils/logger';

// Create Express app
const app = express();
const PORT = config.server.port;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestIdMiddleware);
app.use(requestLogger(logger));

// API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: config.server.env,
    version: process.env.npm_package_version || '0.1.0'
  });
});

// Connect to MongoDB and start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await database.connectDB();
    
    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${config.server.env} mode`);
      
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