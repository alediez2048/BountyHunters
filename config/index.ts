import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

interface Config {
  server: {
    port: number;
    env: string;
  };
  db: {
    mongodbUri: string;
    mongodbAtlasUri?: string;
  };
  telegram: {
    botToken: string;
    webhookUrl?: string;
  };
  security: {
    jwtSecret: string;
    jwtExpiration: string;
  };
  logging: {
    level: string;
  };
  location: {
    geofenceRadiusMeters: number;
    locationUpdateIntervalMinutes: number;
  };
  ai: {
    groqApiKey: string;
    groqModel: string;
  };
}

// Default configuration
const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
  },
  db: {
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/truck-communication',
    mongodbAtlasUri: process.env.MONGODB_ATLAS_URI,
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    webhookUrl: process.env.TELEGRAM_WEBHOOK_URL,
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_key',
    jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  location: {
    geofenceRadiusMeters: parseInt(process.env.GEOFENCE_RADIUS_METERS || '500', 10),
    locationUpdateIntervalMinutes: parseInt(process.env.LOCATION_UPDATE_INTERVAL_MINUTES || '15', 10),
  },
  ai: {
    groqApiKey: process.env.GROQ_API_KEY || '',
    groqModel: process.env.GROQ_MODEL || 'llama3-70b-8192',
  },
};

// Validate required configuration
const validateConfig = () => {
  const requiredEnvVars = [
    { key: 'TELEGRAM_BOT_TOKEN', value: config.telegram.botToken },
    { key: 'MONGODB_URI or MONGODB_ATLAS_URI', value: config.db.mongodbUri || config.db.mongodbAtlasUri },
    { key: 'GROQ_API_KEY', value: config.ai.groqApiKey },
  ];

  const missingVars = requiredEnvVars.filter(item => !item.value);

  if (missingVars.length > 0) {
    const missingKeys = missingVars.map(item => item.key).join(', ');
    console.error(`Missing required environment variables: ${missingKeys}`);
    process.exit(1);
  }
};

// Only validate in production to allow development without all variables
if (config.server.env === 'production') {
  validateConfig();
}

export { config, Config }; 