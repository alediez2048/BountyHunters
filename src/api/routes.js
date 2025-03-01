/**
 * API Routes
 * Defines all API endpoints following RESTful principles
 */

const express = require('express');
const router = express.Router();

// Import controllers
const deliveryController = require('./controllers/deliveryController');
const userController = require('./controllers/userController');
const webhookController = require('./controllers/webhookController');

// Delivery routes
router.get('/deliveries', deliveryController.getAllDeliveries);
router.get('/deliveries/:id', deliveryController.getDeliveryById);
router.post('/deliveries', deliveryController.createDelivery);
router.put('/deliveries/:id', deliveryController.updateDelivery);
router.delete('/deliveries/:id', deliveryController.deleteDelivery);

// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Telegram webhook route
router.post('/webhook', webhookController.handleWebhook);

// Status route for monitoring
router.get('/status', (req, res) => {
  res.status(200).json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0'
  });
});

module.exports = router; 