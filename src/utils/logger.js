/**
 * Logger utility for the application
 * Implements structured logging with request ID tracking
 */

const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

/**
 * Configure and set up the application logger
 * @returns {winston.Logger} Configured Winston logger instance
 */
const setupLogger = () => {
  // Define log format
  const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf((info) => {
      const { timestamp, level, message, ...rest } = info;
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...rest
      });
    })
  );

  // Create logger instance
  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'truck-driver-communication' },
    transports: [
      // Write logs to console
      new winston.transports.Console(),
      // Write logs to file in production
      ...(process.env.NODE_ENV === 'production' 
        ? [
            new winston.transports.File({ 
              filename: 'logs/error.log', 
              level: 'error' 
            }),
            new winston.transports.File({ 
              filename: 'logs/combined.log' 
            })
          ] 
        : [])
    ]
  });

  return logger;
};

/**
 * Express middleware to add request ID to each request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requestIdMiddleware = (req, res, next) => {
  req.requestId = uuidv4();
  res.setHeader('X-Request-ID', req.requestId);
  next();
};

/**
 * Express middleware to log incoming requests
 * @param {winston.Logger} logger - Winston logger instance
 * @returns {Function} Express middleware function
 */
const requestLogger = (logger) => {
  return (req, res, next) => {
    const startTime = Date.now();
    
    // Log request
    logger.info('Request received', {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip
    });

    // Log response when finished
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      
      logger.info('Response sent', {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`
      });
    });

    next();
  };
};

module.exports = {
  setupLogger,
  requestIdMiddleware,
  requestLogger
}; 