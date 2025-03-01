import mongoose from 'mongoose';
import { config } from './index';
import logger from '../src/utils/logger';

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

/**
 * Connect to MongoDB
 */
export const connectDB = async (): Promise<void> => {
  try {
    // Use MongoDB Atlas URI if available, otherwise use local MongoDB URI
    const uri = config.db.mongodbAtlasUri || config.db.mongodbUri;
    
    if (!uri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    logger.info('Connecting to MongoDB...');
    
    await mongoose.connect(uri);
    
    logger.info('MongoDB connected successfully');
    
    // Set up connection event listeners
    setupConnectionListeners();
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    // Exit process with failure
    process.exit(1);
  }
};

/**
 * Set up MongoDB connection event listeners
 */
const setupConnectionListeners = (): void => {
  const db = mongoose.connection;
  
  db.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });
  
  db.on('disconnected', () => {
    logger.warn('MongoDB disconnected. Attempting to reconnect...');
  });
  
  db.on('reconnected', () => {
    logger.info('MongoDB reconnected successfully');
  });
  
  // Handle process termination
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    } catch (err) {
      logger.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
};

export default {
  connectDB
}; 