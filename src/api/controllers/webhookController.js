/**
 * Webhook Controller
 * Handles webhook requests from Telegram
 */

const logger = require('../../utils/logger').setupLogger();

/**
 * Handle webhook requests from Telegram
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleWebhook = (req, res) => {
  try {
    // Log webhook request
    logger.debug('Webhook request received', {
      body: req.body,
      requestId: req.requestId
    });
    
    // The actual processing of the update is handled by the Telegram bot library
    // This endpoint just needs to return a 200 OK response
    
    res.status(200).send('OK');
  } catch (error) {
    logger.error('Error handling webhook', {
      error: error.message,
      requestId: req.requestId
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

module.exports = {
  handleWebhook
}; 