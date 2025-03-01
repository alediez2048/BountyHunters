/**
 * Telegram Bot Setup
 * Initializes and configures the Telegram bot
 */

const TelegramBot = require('node-telegram-bot-api');
const config = require('../../config');
const logger = require('../utils/logger').setupLogger();

// Get bot configuration
const botConfig = config.telegram.getBotConfig();

/**
 * Initialize and set up the Telegram bot
 * @returns {TelegramBot} Configured Telegram bot instance
 */
const setupBot = () => {
  try {
    let bot;
    
    // Check if token is provided
    if (!botConfig.token) {
      logger.error('Telegram bot token not provided');
      throw new Error('TELEGRAM_BOT_TOKEN is required');
    }
    
    // Set up bot with webhook or polling based on environment
    if (botConfig.useWebhook) {
      logger.info('Setting up Telegram bot with webhook');
      
      // Create bot with webhook
      bot = new TelegramBot(botConfig.token, {
        webHook: {
          port: botConfig.webhook.port
        }
      });
      
      // Set webhook
      bot.setWebHook(`${botConfig.webhook.url}${botConfig.webhook.path}`);
      
      logger.info(`Telegram webhook set to ${botConfig.webhook.url}${botConfig.webhook.path}`);
    } else {
      logger.info('Setting up Telegram bot with polling');
      
      // Create bot with polling
      bot = new TelegramBot(botConfig.token, {
        polling: botConfig.polling
      });
    }
    
    // Set up command handlers
    setupCommandHandlers(bot);
    
    // Set up message handlers
    setupMessageHandlers(bot);
    
    // Set up callback query handlers
    setupCallbackQueryHandlers(bot);
    
    // Set up error handler
    bot.on('error', (error) => {
      logger.error('Telegram bot error:', error);
    });
    
    // Set up polling error handler
    bot.on('polling_error', (error) => {
      logger.error('Telegram polling error:', error);
    });
    
    logger.info('Telegram bot setup completed');
    
    return bot;
  } catch (error) {
    logger.error('Failed to set up Telegram bot:', error);
    throw error;
  }
};

/**
 * Set up command handlers for the bot
 * @param {TelegramBot} bot - Telegram bot instance
 */
const setupCommandHandlers = (bot) => {
  // Start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the Truck Driver Communication System!');
  });
  
  // Help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Available commands:\n/start - Start the bot\n/help - Show this help message');
  });
};

/**
 * Set up message handlers for the bot
 * @param {TelegramBot} bot - Telegram bot instance
 */
const setupMessageHandlers = (bot) => {
  // Handle location messages
  bot.on('location', (msg) => {
    const chatId = msg.chat.id;
    const { latitude, longitude } = msg.location;
    
    logger.info('Location received', { chatId, latitude, longitude });
    
    bot.sendMessage(chatId, `Location received: ${latitude}, ${longitude}`);
  });
};

/**
 * Set up callback query handlers for the bot
 * @param {TelegramBot} bot - Telegram bot instance
 */
const setupCallbackQueryHandlers = (bot) => {
  bot.on('callback_query', (callbackQuery) => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    
    logger.info('Callback query received', { chatId, action });
    
    // Acknowledge the callback query
    bot.answerCallbackQuery(callbackQuery.id);
    
    // Handle different actions
    switch (action) {
      case 'confirm_pickup':
        bot.sendMessage(chatId, 'Pickup confirmed!');
        break;
      case 'confirm_delivery':
        bot.sendMessage(chatId, 'Delivery confirmed!');
        break;
      default:
        bot.sendMessage(chatId, `Unknown action: ${action}`);
    }
  });
};

module.exports = setupBot; 