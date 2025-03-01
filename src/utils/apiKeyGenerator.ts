import crypto from 'crypto';

/**
 * Generates a secure random API key
 * 
 * @param {number} length - The length of the API key (default: 32)
 * @returns {string} A secure random API key
 */
export const generateApiKey = (length: number = 32): string => {
  // Generate random bytes
  const randomBytes = crypto.randomBytes(length);
  
  // Convert to a base64 string and remove non-alphanumeric characters
  return randomBytes.toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, length);
};

/**
 * Generates a specified number of API keys
 * 
 * @param {number} count - The number of API keys to generate
 * @param {number} length - The length of each API key
 * @returns {string[]} An array of API keys
 */
export const generateMultipleApiKeys = (count: number, length: number = 32): string[] => {
  const keys: string[] = [];
  
  for (let i = 0; i < count; i++) {
    keys.push(generateApiKey(length));
  }
  
  return keys;
};

/**
 * Formats API keys for .env file
 * 
 * @param {string[]} keys - Array of API keys
 * @returns {string} Comma-separated string of API keys
 */
export const formatApiKeysForEnv = (keys: string[]): string => {
  return keys.join(',');
};

export default {
  generateApiKey,
  generateMultipleApiKeys,
  formatApiKeysForEnv
}; 