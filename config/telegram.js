/**
 * Telegram Bot Configuration
 * Configures Telegram bot settings and options
 */

// Bot configuration
const botConfig = {
  // Bot token from environment variables
  token: process.env.TELEGRAM_BOT_TOKEN,
  
  // Webhook settings for production
  webhook: {
    url: process.env.TELEGRAM_WEBHOOK_URL,
    port: process.env.PORT || 3000,
    path: '/api/webhook',
    maxConnections: 100
  },
  
  // Polling settings for development
  polling: {
    enabled: process.env.NODE_ENV !== 'production',
    interval: 300,
    timeout: 0,
    limit: 100,
    retryTimeout: 5000
  },
  
  // Command rate limiting (commands per minute per user)
  rateLimit: {
    window: 60000, // 1 minute
    max: 20, // 20 commands per minute
    message: 'Too many commands, please try again later.'
  }
};

/**
 * Get bot configuration based on environment
 * @returns {Object} Bot configuration
 */
const getBotConfig = () => {
  // Use webhook in production, polling in development
  const useWebhook = process.env.NODE_ENV === 'production';
  
  return {
    ...botConfig,
    useWebhook
  };
};

module.exports = {
  getBotConfig
}; 