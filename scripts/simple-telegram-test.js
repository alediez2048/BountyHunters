require('dotenv').config();

// Get the Telegram Bot Token from environment variables
const token = process.env.TELEGRAM_BOT_TOKEN;

console.log('Checking Telegram Bot Token...');

if (!token || token === '123456789:REPLACE_WITH_YOUR_ACTUAL_TOKEN' || token === 'your_telegram_bot_token') {
  console.error('❌ Valid Telegram Bot Token is not configured in .env file');
  process.exit(1);
}

// Simple validation of token format
if (token.includes(':') && token.length > 20) {
  console.log('✅ Telegram Bot Token format appears valid:');
  // Only show first 5 characters for security
  console.log(`Token: ${token.substring(0, 5)}...${token.substring(token.length - 5)}`);
  console.log('To fully verify the connection, you would need to make an API call.');
  process.exit(0);
} else {
  console.error('❌ Telegram Bot Token format appears invalid');
  process.exit(1);
} 