import mongoose, { Document, Schema } from 'mongoose';
import { DeliveryStatus } from './Delivery';
import { ILocation } from './Driver';

export interface IStatusUpdate extends Document {
  deliveryId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  status: DeliveryStatus;
  timestamp: Date;
  location?: ILocation;
  message?: string;
  isAiGenerated: boolean;
  rawTelegramMessage?: string;
  aiProcessingDetails?: {
    promptTokens?: number;
    completionTokens?: number;
    processingTimeMs?: number;
    confidence?: number;
    model?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const StatusUpdateSchema = new Schema<IStatusUpdate>({
  deliveryId: {
    type: Schema.Types.ObjectId,
    ref: 'Delivery',
    required: true,
    index: true
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
    index: true
  },
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
  },
  message: {
    type: String
  },
  isAiGenerated: {
    type: Boolean,
    default: false,
    required: true
  },
  rawTelegramMessage: {
    type: String
  },
  aiProcessingDetails: {
    promptTokens: {
      type: Number
    },
    completionTokens: {
      type: Number
    },
    processingTimeMs: {
      type: Number
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    model: {
      type: String
    }
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
StatusUpdateSchema.index({ deliveryId: 1, timestamp: -1 });
StatusUpdateSchema.index({ driverId: 1, timestamp: -1 });
StatusUpdateSchema.index({ 'location': '2dsphere' });

export default mongoose.model<IStatusUpdate>('StatusUpdate', StatusUpdateSchema); 