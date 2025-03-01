import TelegramBot from 'node-telegram-bot-api';
import { config } from '../../config';
import logger from '../utils/logger';
import Driver from '../models/Driver';
import UserContext, { UserRole } from '../models/UserContext';
import aiService from '../services/aiService';

// Initialize the Telegram bot
const bot = new TelegramBot(config.telegram.botToken, {
  polling: !config.telegram.webhookUrl, // Use polling if webhook URL is not provided
});

// Set up webhook if URL is provided
if (config.telegram.webhookUrl) {
  bot.setWebHook(config.telegram.webhookUrl);
  logger.info(`Telegram webhook set to ${config.telegram.webhookUrl}`);
} else {
  logger.info('Telegram bot started in polling mode');
}

/**
 * Initialize the Telegram bot and set up message handlers
 */
export const setupBot = (): TelegramBot => {
  // Handle errors
  bot.on('polling_error', (error) => {
    logger.error('Telegram polling error:', error);
  });

  bot.on('webhook_error', (error) => {
    logger.error('Telegram webhook error:', error);
  });

  // Handle start command
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from?.id.toString() || '';
    const firstName = msg.from?.first_name || 'User';
    
    try {
      // Check if user already exists
      let userContext = await UserContext.findOne({ telegramId });
      
      if (!userContext) {
        // Create a new user context
        userContext = new UserContext({
          telegramId,
          role: UserRole.DRIVER, // Default role
          conversationHistory: [],
          sessionActive: true,
        });
        
        // Add welcome message to conversation history
        userContext.addMessage('system', 'User started a conversation');
        await userContext.save();
        
        // Create a driver record if it doesn't exist
        const existingDriver = await Driver.findOne({ telegramId });
        
        if (!existingDriver) {
          const newDriver = new Driver({
            telegramId,
            firstName,
            lastName: msg.from?.last_name,
            isActive: true,
          });
          
          await newDriver.save();
          logger.info(`New driver created: ${firstName} (${telegramId})`);
        }
      } else {
        // Update session status
        userContext.sessionActive = true;
        userContext.addMessage('system', 'User restarted the conversation');
        await userContext.save();
      }
      
      // Send welcome message
      const welcomeMessage = `Welcome to the Truck Driver Communication System, ${firstName}! 
      
I'm your AI assistant and I'll help you manage your deliveries and communicate with logistics stakeholders.

You can:
• Send me updates about your delivery status
• Share your location for automatic status updates
• Ask questions about your current delivery
• Report issues or delays

How can I assist you today?`;
      
      await bot.sendMessage(chatId, welcomeMessage);
      
      // Add bot response to conversation history
      userContext.addMessage('assistant', welcomeMessage);
      await userContext.save();
      
    } catch (error) {
      logger.error('Error handling /start command:', error);
      await bot.sendMessage(chatId, 'Sorry, there was an error processing your request. Please try again later.');
    }
  });

  // Handle location messages
  bot.on('location', async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from?.id.toString() || '';
    const firstName = msg.from?.first_name || 'User';
    const location = msg.location;
    
    try {
      // Find the driver
      const driver = await Driver.findOne({ telegramId });
      
      if (!driver) {
        await bot.sendMessage(chatId, 'You need to register first. Please use the /start command.');
        return;
      }
      
      // Update driver's location
      driver.currentLocation = {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        timestamp: new Date()
      };
      
      await driver.save();
      
      // Find user context
      const userContext = await UserContext.findOne({ telegramId });
      
      if (!userContext) {
        await bot.sendMessage(chatId, 'You need to register first. Please use the /start command.');
        return;
      }
      
      // Add location message to conversation history
      userContext.addMessage('user', 'Shared location');
      await userContext.save();
      
      // Send confirmation message
      await bot.sendMessage(chatId, `Thanks for sharing your location, ${firstName}. Your position has been updated.`);
      
      // Add bot response to conversation history
      userContext.addMessage('assistant', `Thanks for sharing your location, ${firstName}. Your position has been updated.`);
      await userContext.save();
      
      logger.info(`Driver ${firstName} (${telegramId}) location updated: [${location.longitude}, ${location.latitude}]`);
      
    } catch (error) {
      logger.error('Error handling location message:', error);
      await bot.sendMessage(chatId, 'Sorry, there was an error processing your location. Please try again later.');
    }
  });

  // Handle text messages
  bot.on('text', async (msg) => {
    // Skip commands
    if (msg.text?.startsWith('/')) {
      return;
    }
    
    const chatId = msg.chat.id;
    const telegramId = msg.from?.id.toString() || '';
    const firstName = msg.from?.first_name || 'User';
    const messageText = msg.text || '';
    
    try {
      // Find the driver
      const driver = await Driver.findOne({ telegramId });
      
      if (!driver) {
        await bot.sendMessage(chatId, 'You need to register first. Please use the /start command.');
        return;
      }
      
      // Find user context
      let userContext = await UserContext.findOne({ telegramId });
      
      if (!userContext) {
        await bot.sendMessage(chatId, 'You need to register first. Please use the /start command.');
        return;
      }
      
      // Add user message to conversation history
      userContext.addMessage('user', messageText);
      await userContext.save();
      
      // Process the message with AI
      const driverContext = {
        driverId: driver._id.toString(),
        driverName: firstName,
        currentDeliveryId: driver.currentDeliveryId?.toString(),
        currentStatus: 'Unknown', // This would be fetched from the current delivery
        currentLocation: driver.currentLocation
      };
      
      // Send typing indicator
      bot.sendChatAction(chatId, 'typing');
      
      // Process the message with AI
      const processedInfo = await aiService.processDriverMessage(messageText, driverContext);
      
      // Generate a response
      const response = await aiService.generateDriverResponse(
        messageText,
        processedInfo,
        {
          driverName: firstName,
          currentDeliveryId: driver.currentDeliveryId?.toString(),
          currentStatus: 'Unknown' // This would be fetched from the current delivery
        }
      );
      
      // Send the response
      await bot.sendMessage(chatId, response);
      
      // Add bot response to conversation history
      userContext.addMessage('assistant', response);
      await userContext.save();
      
      logger.info(`Processed message from ${firstName} (${telegramId})`, {
        isStatusUpdate: processedInfo.isStatusUpdate,
        detectedStatus: processedInfo.detectedStatus
      });
      
    } catch (error) {
      logger.error('Error handling text message:', error);
      await bot.sendMessage(chatId, 'Sorry, there was an error processing your message. Please try again later.');
    }
  });

  return bot;
};

export default setupBot; 