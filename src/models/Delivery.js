/**
 * Delivery Model
 * Mongoose schema for delivery data
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Location schema for tracking coordinates
const LocationSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  },
  address: {
    type: String,
    trim: true
  }
}, { _id: false });

// Status history schema to track delivery progress
const StatusHistorySchema = new Schema({
  status: {
    type: String,
    required: true,
    enum: [
      'assigned',
      'accepted',
      'at_pickup',
      'loading',
      'in_transit',
      'approaching_delivery',
      'at_delivery',
      'unloading',
      'completed',
      'cancelled',
      'delayed'
    ]
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  location: LocationSchema,
  notes: {
    type: String,
    trim: true
  }
}, { _id: true });

// Main Delivery schema
const DeliverySchema = new Schema({
  // Basic delivery information
  reference: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  status: {
    type: String,
    required: true,
    enum: [
      'assigned',
      'accepted',
      'at_pickup',
      'loading',
      'in_transit',
      'approaching_delivery',
      'at_delivery',
      'unloading',
      'completed',
      'cancelled',
      'delayed'
    ],
    default: 'assigned'
  },
  
  // Stakeholders
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Locations
  pickupLocation: {
    type: LocationSchema,
    required: true
  },
  deliveryLocation: {
    type: LocationSchema,
    required: true
  },
  currentLocation: LocationSchema,
  
  // Timing
  scheduledPickup: {
    type: Date,
    required: true
  },
  scheduledDelivery: {
    type: Date,
    required: true
  },
  actualPickup: Date,
  actualDelivery: Date,
  
  // Cargo information
  cargo: {
    description: {
      type: String,
      required: true,
      trim: true
    },
    weight: {
      type: Number,
      min: 0
    },
    volume: {
      type: Number,
      min: 0
    },
    hazardous: {
      type: Boolean,
      default: false
    },
    temperature: {
      required: Boolean,
      min: Number,
      max: Number
    }
  },
  
  // Tracking
  statusHistory: [StatusHistorySchema],
  
  // Additional information
  notes: {
    type: String,
    trim: true
  },
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
DeliverySchema.index({ reference: 1 });
DeliverySchema.index({ status: 1 });
DeliverySchema.index({ driver: 1 });
DeliverySchema.index({ manager: 1 });
DeliverySchema.index({ scheduledPickup: 1 });
DeliverySchema.index({ scheduledDelivery: 1 });
DeliverySchema.index({ 'pickupLocation.coordinates': '2dsphere' });
DeliverySchema.index({ 'deliveryLocation.coordinates': '2dsphere' });
DeliverySchema.index({ 'currentLocation.coordinates': '2dsphere' });

// Virtual for ETA calculation
DeliverySchema.virtual('estimatedTimeOfArrival').get(function() {
  // This would be calculated based on current location and delivery location
  // For now, return scheduled delivery time
  return this.scheduledDelivery;
});

// Method to check if delivery is delayed
DeliverySchema.methods.isDelayed = function() {
  const now = new Date();
  
  if (this.status === 'completed' || this.status === 'cancelled') {
    return false;
  }
  
  if (this.status === 'assigned' || this.status === 'accepted') {
    return now > this.scheduledPickup;
  }
  
  return now > this.scheduledDelivery;
};

// Pre-save hook to update status history
DeliverySchema.pre('save', function(next) {
  if (this.isModified('status')) {
    // Only add to history if status is actually changing
    const lastStatus = this.statusHistory && this.statusHistory.length > 0 
      ? this.statusHistory[this.statusHistory.length - 1].status 
      : null;
      
    if (lastStatus !== this.status) {
      this.statusHistory.push({
        status: this.status,
        timestamp: new Date(),
        location: this.currentLocation
      });
    }
  }
  next();
});

module.exports = mongoose.model('Delivery', DeliverySchema); 