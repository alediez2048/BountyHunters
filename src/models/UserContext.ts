import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  DRIVER = 'driver',
  MANAGER = 'manager',
  SHIPPER = 'shipper',
  RECIPIENT = 'recipient'
}

export interface IUserContext extends Document {
  telegramId: string;
  userId?: mongoose.Types.ObjectId;
  role: UserRole;
  currentDeliveryId?: mongoose.Types.ObjectId;
  conversationHistory: {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  }[];
  lastInteractionAt: Date;
  sessionActive: boolean;
  preferences: {
    language?: string;
    notificationFrequency?: 'low' | 'medium' | 'high';
    receiveLocationUpdates?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserContextSchema = new Schema<IUserContext>({
  telegramId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    refPath: 'role'
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true
  },
  currentDeliveryId: {
    type: Schema.Types.ObjectId,
    ref: 'Delivery'
  },
  conversationHistory: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true
    }
  }],
  lastInteractionAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  sessionActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    notificationFrequency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    receiveLocationUpdates: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
UserContextSchema.index({ telegramId: 1 });
UserContextSchema.index({ lastInteractionAt: -1 });

// Add a method to add a message to the conversation history
UserContextSchema.methods.addMessage = function(role: 'user' | 'assistant' | 'system', content: string) {
  const userContext = this as IUserContext;
  
  if (!userContext.conversationHistory) {
    userContext.conversationHistory = [];
  }
  
  // Add the new message
  userContext.conversationHistory.push({
    role,
    content,
    timestamp: new Date()
  });
  
  // Update the last interaction time
  userContext.lastInteractionAt = new Date();
  
  // Limit the conversation history to the last 50 messages
  if (userContext.conversationHistory.length > 50) {
    userContext.conversationHistory = userContext.conversationHistory.slice(-50);
  }
  
  return userContext;
};

export default mongoose.model<IUserContext>('UserContext', UserContextSchema); 