import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation {
  type: string;
  coordinates: number[];
  timestamp: Date;
}

export interface IDriver extends Document {
  telegramId: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  currentLocation?: ILocation;
  isActive: boolean;
  currentDeliveryId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>({
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
  }
});

const DriverSchema = new Schema<IDriver>({
  telegramId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  currentLocation: {
    type: LocationSchema
  },
  isActive: {
    type: Boolean,
    default: true
  },
  currentDeliveryId: {
    type: Schema.Types.ObjectId,
    ref: 'Delivery'
  }
}, {
  timestamps: true
});

// Create a 2dsphere index on the currentLocation field for geospatial queries
DriverSchema.index({ 'currentLocation': '2dsphere' });

export default mongoose.model<IDriver>('Driver', DriverSchema); 