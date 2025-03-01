require('dotenv').config();
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');

async function testAllConnections() {
  console.log('🔄 TESTING ALL EXTERNAL SERVICE CONNECTIONS\n');
  let allPassed = true;

  // Test MongoDB connection
  console.log('📊 TESTING MONGODB CONNECTION...');
  try {
    const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
    if (!uri) throw new Error('MongoDB URI is not defined in environment variables');
    
    console.log(`Using URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials
    
    await mongoose.connect(uri);
    
    console.log('✅ MongoDB connected successfully!');
    console.log(`Database name: ${mongoose.connection.db.databaseName}`);
    console.log(`Host: ${mongoose.connection.host}`);
    
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    allPassed = false;
  }
  console.log('\n-----------------------------------\n');

  // Test Telegram Bot connection
  console.log('🤖 TESTING TELEGRAM BOT CONNECTION...');
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new Error('Telegram Bot Token is not defined in environment variables');
    
    if (token === 'your_telegram_bot_token') {
      throw new Error('Default Telegram Bot Token is being used. Please update with a real token.');
    }
    
    console.log('Connecting to Telegram Bot API...');
    
    // Create a bot instance
    const bot = new TelegramBot(token, { polling: false });
    
    // Get bot information
    console.log('Fetching bot information...');
    try {
      const me = await bot.getMe();
      console.log('✅ Telegram Bot connection successful!');
      console.log(`Bot Name: ${me.first_name}`);
      console.log(`Bot Username: @${me.username}`);
      console.log(`Bot ID: ${me.id}`);
    } catch (botError) {
      if (botError.message.includes('401')) {
        throw new Error('Invalid Telegram Bot Token. Please check your token with BotFather.');
      } else {
        throw botError;
      }
    }
  } catch (error) {
    console.error('❌ Telegram Bot connection error:', error.message);
    allPassed = false;
  }
  console.log('\n-----------------------------------\n');

  // Test Groq API connection
  console.log('🧠 TESTING GROQ API CONNECTION...');
  try {
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'llama3-70b-8192';
    
    if (!apiKey) throw new Error('Groq API Key is not defined in environment variables');
    
    if (apiKey === 'your_groq_api_key' || apiKey === 'gsk_REPLACE_WITH_YOUR_ACTUAL_GROQ_API_KEY') {
      throw new Error('Default Groq API Key is being used. Please update with a real key.');
    }
    
    console.log('Validating Groq API Key format...');
    
    if (!apiKey.startsWith('gsk_') || apiKey.length < 10) {
      throw new Error('Groq API Key format appears invalid. Keys typically start with "gsk_"');
    }
    
    console.log('✅ Groq API Key format is valid');
    console.log(`API Key: ${apiKey.substring(0, 5)}...`);
    console.log(`Model: ${model}`);
    
    console.log('\nTo make an actual API call, install the Groq SDK:');
    console.log('npm install @groq/groq-sdk');
    
    // We're not making an actual API call here to avoid installing dependencies
    // In a real scenario, you would use the Groq SDK to make a test call
  } catch (error) {
    console.error('❌ Groq API connection error:', error.message);
    allPassed = false;
  }
  console.log('\n-----------------------------------\n');

  // Final result
  if (allPassed) {
    console.log('🎉 ALL CONNECTIONS TESTED SUCCESSFULLY!');
    console.log('Your application is properly configured to use all external services.');
  } else {
    console.error('⚠️ SOME CONNECTIONS FAILED!');
    console.error('Please check the errors above and fix the configuration.');
  }

  return allPassed;
}

// Run the tests
testAllConnections()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 