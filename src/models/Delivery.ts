import mongoose, { Document, Schema } from 'mongoose';
import { ILocation } from './Driver';

export enum DeliveryStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_TRANSIT = 'in_transit',
  ARRIVED_AT_PICKUP = 'arrived_at_pickup',
  LOADING = 'loading',
  DEPARTED_FROM_PICKUP = 'departed_from_pickup',
  ARRIVED_AT_DELIVERY = 'arrived_at_delivery',
  UNLOADING = 'unloading',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface IDeliveryLocation extends ILocation {
  address: string;
  contactName?: string;
  contactPhone?: string;
  notes?: string;
}

export interface IDelivery extends Document {
  deliveryId: string;
  driverId?: mongoose.Types.ObjectId;
  status: DeliveryStatus;
  pickupLocation: IDeliveryLocation;
  deliveryLocation: IDeliveryLocation;
  scheduledPickupTime?: Date;
  scheduledDeliveryTime?: Date;
  actualPickupTime?: Date;
  actualDeliveryTime?: Date;
  cargo: {
    description: string;
    weight?: number;
    volume?: number;
    specialInstructions?: string;
  };
  statusHistory: {
    status: DeliveryStatus;
    timestamp: Date;
    notes?: string;
    location?: ILocation;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryLocationSchema = new Schema<IDeliveryLocation>({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
    required: true
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: (coordinates: number[]) => coordinates.length === 2,
      message: 'Coordinates must be in the format [longitude, latitude]'
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contactName: {
    type: String
  },
  contactPhone: {
    type: String
  },
  notes: {
    type: String
  }
});

const DeliverySchema = new Schema<IDelivery>({
  deliveryId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver'
  },
  status: {
    type: String,
    enum: Object.values(DeliveryStatus),
    default: DeliveryStatus.PENDING,
    required: true
  },
  pickupLocation: {
    type: DeliveryLocationSchema,
    required: true
  },
  deliveryLocation: {
    type: DeliveryLocationSchema,
    required: true
  },
  scheduledPickupTime: {
    type: Date
  },
  scheduledDeliveryTime: {
    type: Date
  },
  actualPickupTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  cargo: {
    description: {
      type: String,
      required: true
    },
    weight: {
      type: Number
    },
    volume: {
      type: Number
    },
    specialInstructions: {
      type: String
    }
  },
  statusHistory: [{
    status: {
      type: String,
      enum: Object.values(DeliveryStatus),
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true
    },
    notes: {
      type: String
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: (coordinates: number[]) => coordinates.length === 2,
          message: 'Coordinates must be in the format [longitude, latitude]'
        }
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  }]
}, {
  timestamps: true
});

// Create 2dsphere indexes on the pickup and delivery locations for geospatial queries
DeliverySchema.index({ 'pickupLocation': '2dsphere' });
DeliverySchema.index({ 'deliveryLocation': '2dsphere' });

// Add a pre-save hook to update the status history
DeliverySchema.pre('save', function(next) {
  const delivery = this as IDelivery;
  
  // If this is a new document or the status has changed
  if (this.isNew || this.isModified('status')) {
    const statusEntry = {
      status: delivery.status,
      timestamp: new Date()
    };
    
    if (!delivery.statusHistory) {
      delivery.statusHistory = [];
    }
    
    delivery.statusHistory.push(statusEntry);
  }
  
  next();
});

export default mongoose.model<IDelivery>('Delivery', DeliverySchema); 