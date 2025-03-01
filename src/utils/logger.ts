import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config';

// Define custom log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log level based on environment
const level = () => {
  return config.logging.level || 'info';
};

// Define custom format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message} ${info.requestId ? `[requestId: ${info.requestId}]` : ''} ${info.stack ? `\n${info.stack}` : ''}`
      )
    ),
  }),
  // File transport for errors
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  // File transport for all logs
  new winston.transports.File({
    filename: 'logs/all.log',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  defaultMeta: { service: 'truck-driver-communication' },
});

// Middleware to add request ID to each request
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.id = req.headers['x-request-id'] as string || uuidv4();
  res.setHeader('x-request-id', req.id);
  next();
};

// Middleware to log each request
export const requestLogger = (logger: winston.Logger) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Log request
    logger.http(`${req.method} ${req.url}`, {
      requestId: req.id,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Log response
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.http(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`, {
        requestId: req.id,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
      });
    });

    next();
  };
};

// Extend Express Request interface to include id property
declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export default logger; 