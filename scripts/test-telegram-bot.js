require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

async function testTelegramBot() {
  try {
    // Get the Telegram Bot Token from environment variables
    const token = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!token || token === '123456789:REPLACE_WITH_YOUR_ACTUAL_TOKEN' || token === 'your_telegram_bot_token') {
      throw new Error('Valid Telegram Bot Token is not configured in .env file');
    }
    
    console.log('Connecting to Telegram Bot API...');
    
    // Create a bot instance
    const bot = new TelegramBot(token, { polling: false });
    
    // Get bot information
    console.log('Fetching bot information...');
    const me = await bot.getMe();
    
    console.log('✅ Telegram Bot connection successful!');
    console.log(`Bot Name: ${me.first_name}`);
    console.log(`Bot Username: @${me.username}`);
    console.log(`Bot ID: ${me.id}`);
    
    return true;
  } catch (error) {
    console.error('❌ Telegram Bot connection error:', error.message);
    if (error.message.includes('401')) {
      console.error('This usually means your token is invalid. Please check your token with BotFather.');
    }
    return false;
  }
}

// Run the test
testTelegramBot()
  .then(success => {
    console.log(success ? 'Test completed successfully!' : 'Test failed!');
    process.exit(success ? 0 : 1);
  }); 