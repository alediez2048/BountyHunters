import { generateApiKey, generateMultipleApiKeys, formatApiKeysForEnv } from '../src/utils/apiKeyGenerator';

// Parse command line arguments
const args = process.argv.slice(2);
const count = parseInt(args[0]) || 1;
const length = parseInt(args[1]) || 32;

// Generate API keys
const keys = generateMultipleApiKeys(count, length);

// Output the keys
console.log('\nGenerated API Keys:');
keys.forEach((key, index) => {
  console.log(`Key ${index + 1}: ${key}`);
});

// Output formatted for .env file
console.log('\nFor .env file:');
console.log(`API_KEYS=${formatApiKeysForEnv(keys)}`);

console.log('\nMake sure to add these keys to your .env file and keep them secure!');
console.log('These keys should only be shared with authorized clients.\n'); 