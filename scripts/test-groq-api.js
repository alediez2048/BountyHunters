require('dotenv').config();

// Get the Groq API Key from environment variables
const apiKey = process.env.GROQ_API_KEY;
const model = process.env.GROQ_MODEL || 'llama3-70b-8192';

console.log('Checking Groq API Key...');

if (!apiKey || apiKey === 'gsk_REPLACE_WITH_YOUR_ACTUAL_GROQ_API_KEY' || apiKey === 'your_groq_api_key') {
  console.error('❌ Valid Groq API Key is not configured in .env file');
  console.log('Please sign up at https://console.groq.com/ and get your API key');
  process.exit(1);
}

// Simple validation of API key format
if (apiKey.startsWith('gsk_') && apiKey.length > 10) {
  console.log('✅ Groq API Key format appears valid:');
  // Only show first 5 characters for security
  console.log(`API Key: ${apiKey.substring(0, 5)}...`);
  console.log(`Model: ${model}`);
  console.log('To fully verify the connection, you would need to make an API call.');
  
  console.log('\nTo make a real API call, you would need to:');
  console.log('1. Install the Groq client: npm install @groq/groq-sdk');
  console.log('2. Use code like this:');
  console.log(`
  const { Groq } = require("@groq/groq-sdk");
  
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  async function main() {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello, Groq!" }
      ],
      model: "${model}",
    });
  
    console.log(chatCompletion.choices[0]?.message?.content || "No response");
  }
  
  main().catch(console.error);
  `);
  
  process.exit(0);
} else {
  console.error('❌ Groq API Key format appears invalid');
  console.error('Groq API Keys typically start with "gsk_"');
  process.exit(1);
} 