/**
 * Delivery Service
 * Contains business logic for delivery operations
 */

const Delivery = require('../models/Delivery');
const logger = require('../utils/logger').setupLogger();

/**
 * Get all deliveries with filtering and pagination
 * @param {Object} options - Query options
 * @param {Number} options.page - Page number
 * @param {Number} options.limit - Items per page
 * @param {String} options.status - Filter by delivery status
 * @returns {Promise<Array>} Array of delivery objects
 */
const getAllDeliveries = async (options) => {
  try {
    const { page, limit, status } = options;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    
    // Execute query with pagination
    const deliveries = await Delivery.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    return deliveries;
  } catch (error) {
    logger.error('Error in deliveryService.getAllDeliveries', { error: error.message });
    throw error;
  }
};

/**
 * Get a delivery by ID
 * @param {String} id - Delivery ID
 * @returns {Promise<Object>} Delivery object
 */
const getDeliveryById = async (id) => {
  try {
    const delivery = await Delivery.findById(id).lean();
    return delivery;
  } catch (error) {
    logger.error('Error in deliveryService.getDeliveryById', { 
      error: error.message,
      deliveryId: id
    });
    throw error;
  }
};

/**
 * Create a new delivery
 * @param {Object} deliveryData - Delivery data
 * @returns {Promise<Object>} Created delivery object
 */
const createDelivery = async (deliveryData) => {
  try {
    // Create new delivery
    const delivery = new Delivery(deliveryData);
    await delivery.save();
    
    // Notify driver about new assignment
    // This would be implemented in a separate notification service
    
    return delivery;
  } catch (error) {
    logger.error('Error in deliveryService.createDelivery', { error: error.message });
    throw error;
  }
};

/**
 * Update an existing delivery
 * @param {String} id - Delivery ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated delivery object
 */
const updateDelivery = async (id, updateData) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return delivery;
  } catch (error) {
    logger.error('Error in deliveryService.updateDelivery', { 
      error: error.message,
      deliveryId: id
    });
    throw error;
  }
};

/**
 * Delete a delivery
 * @param {String} id - Delivery ID
 * @returns {Promise<Boolean>} True if deleted, false if not found
 */
const deleteDelivery = async (id) => {
  try {
    const result = await Delivery.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    logger.error('Error in deliveryService.deleteDelivery', { 
      error: error.message,
      deliveryId: id
    });
    throw error;
  }
};

/**
 * Update delivery status
 * @param {String} id - Delivery ID
 * @param {String} status - New status
 * @param {Object} statusData - Additional status data
 * @returns {Promise<Object>} Updated delivery object
 */
const updateDeliveryStatus = async (id, status, statusData = {}) => {
  try {
    const delivery = await Delivery.findById(id);
    
    if (!delivery) {
      return null;
    }
    
    // Update status
    delivery.status = status;
    delivery.statusHistory.push({
      status,
      timestamp: new Date(),
      location: statusData.location,
      notes: statusData.notes
    });
    
    await delivery.save();
    
    // Trigger notifications based on status change
    // This would be implemented in a separate notification service
    
    return delivery;
  } catch (error) {
    logger.error('Error in deliveryService.updateDeliveryStatus', { 
      error: error.message,
      deliveryId: id,
      status
    });
    throw error;
  }
};

module.exports = {
  getAllDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  updateDeliveryStatus
}; 