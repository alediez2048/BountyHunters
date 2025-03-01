/**
 * Delivery Controller
 * Handles HTTP requests for delivery-related endpoints
 */

const deliveryService = require('../../services/deliveryService');
const logger = require('../../utils/logger').setupLogger();

/**
 * Get all deliveries with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllDeliveries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      status
    };
    
    const deliveries = await deliveryService.getAllDeliveries(options);
    
    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    logger.error('Error fetching deliveries', { 
      error: error.message,
      requestId: req.requestId
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deliveries',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

/**
 * Get delivery by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await deliveryService.getDeliveryById(id);
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: `Delivery with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    logger.error('Error fetching delivery by ID', { 
      error: error.message,
      deliveryId: req.params.id,
      requestId: req.requestId
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch delivery',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

/**
 * Create a new delivery
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createDelivery = async (req, res) => {
  try {
    const deliveryData = req.body;
    const newDelivery = await deliveryService.createDelivery(deliveryData);
    
    res.status(201).json({
      success: true,
      data: newDelivery
    });
  } catch (error) {
    logger.error('Error creating delivery', { 
      error: error.message,
      requestId: req.requestId
    });
    
    res.status(400).json({
      success: false,
      message: 'Failed to create delivery',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

/**
 * Update an existing delivery
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedDelivery = await deliveryService.updateDelivery(id, updateData);
    
    if (!updatedDelivery) {
      return res.status(404).json({
        success: false,
        message: `Delivery with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedDelivery
    });
  } catch (error) {
    logger.error('Error updating delivery', { 
      error: error.message,
      deliveryId: req.params.id,
      requestId: req.requestId
    });
    
    res.status(400).json({
      success: false,
      message: 'Failed to update delivery',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

/**
 * Delete a delivery
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deliveryService.deleteDelivery(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Delivery with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Delivery with ID ${id} successfully deleted`
    });
  } catch (error) {
    logger.error('Error deleting delivery', { 
      error: error.message,
      deliveryId: req.params.id,
      requestId: req.requestId
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete delivery',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

module.exports = {
  getAllDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  deleteDelivery
}; 