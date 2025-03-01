import { Request, Response, NextFunction } from 'express';
import { config } from '../../../config';
import logger from '../../utils/logger';

/**
 * API Key Authentication Middleware
 * 
 * This middleware validates API requests by checking for a valid API key
 * in the request headers. The API key should be provided in the 'x-api-key' header.
 */
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the API key from request headers
    const apiKey = req.headers['x-api-key'] as string;
    
    // Check if API key is provided
    if (!apiKey) {
      logger.warn('API request missing API key', { 
        path: req.path, 
        method: req.method,
        ip: req.ip 
      });
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'API key is required' 
      });
    }
    
    // Validate the API key against configured keys
    // For now, we'll use a simple array of valid keys stored in environment variables
    const validApiKeys = (process.env.API_KEYS || '').split(',').filter(key => key.trim() !== '');
    
    if (validApiKeys.length === 0) {
      logger.error('No valid API keys configured');
      return res.status(500).json({ 
        error: 'Server Error', 
        message: 'API key validation is not properly configured' 
      });
    }
    
    if (!validApiKeys.includes(apiKey)) {
      logger.warn('Invalid API key used', { 
        path: req.path, 
        method: req.method,
        ip: req.ip 
      });
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Invalid API key' 
      });
    }
    
    // If we reach here, the API key is valid
    logger.debug('Valid API key used', { path: req.path });
    next();
  } catch (error) {
    logger.error('Error in API key authentication', { error });
    return res.status(500).json({ 
      error: 'Server Error', 
      message: 'An error occurred during authentication' 
    });
  }
};

export default apiKeyAuth; 