# Truck Driver Communication System

A Telegram-based communication system for truck drivers that streamlines logistics updates between drivers, managers, and recipients using AI-powered message processing.

## Overview

This system uses Telegram as the primary interface for all users (drivers, managers, shippers, recipients) and leverages AI to interpret messages, take actions, and generate responses based on context.

### Key Features

- **Telegram Bot Interface**: All users interact through Telegram, eliminating the need for special apps
- **Langchain.js AI Agent**: Powers the intelligence behind the system, interpreting messages and taking actions
- **Groq LLM Integration**: Provides fast, efficient language understanding capabilities
- **MongoDB Database**: Stores delivery information, user contexts, and location data with geospatial capabilities
- **Location-Based Triggers**: Detect arrival/departure automatically
- **Context-Aware Conversations**: Maintain context across interactions
- **Flexible Interactions**: Support for both structured commands and natural language

## Technology Stack

- **Backend**: Node.js with TypeScript and Express
- **Database**: MongoDB with Mongoose ODM
- **Messaging**: Telegram Bot API
- **AI**: Langchain.js with Groq LLM
- **Containerization**: Docker and Docker Compose
- **Logging**: Winston

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Telegram Bot Token (from BotFather)
- Groq API Key

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/truck-driver-communication-system.git
   cd truck-driver-communication-system
   ```

2. Run the installation script:
   ```
   ./install.sh
   ```

3. Update the `.env` file with your credentials:
   ```
   # Required
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   MONGODB_URI=mongodb://localhost:27017/truck-communication
   # or for MongoDB Atlas
   MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/truck-communication
   GROQ_API_KEY=your_groq_api_key
   ```

## Development

Start the development server:
```
npm run dev
```

Build for production:
```
npm run build
```

Start in production mode:
```
npm start
```

## Project Structure

```
truck-driver-communication-system/
├── config/                 # Configuration files
│   ├── index.ts            # Main configuration
│   └── database.ts         # Database configuration
├── src/                    # Source code
│   ├── api/                # API endpoints
│   │   ├── routes.ts       # API routes
│   │   └── controllers/    # API controllers
│   ├── bot/                # Telegram bot
│   │   └── setup.ts        # Bot initialization
│   ├── models/             # MongoDB schemas
│   │   ├── Driver.ts       # Driver model
│   │   ├── Delivery.ts     # Delivery model
│   │   ├── StatusUpdate.ts # Status update model
│   │   └── UserContext.ts  # User context model
│   ├── services/           # Business logic
│   │   └── aiService.ts    # AI service with Langchain and Groq
│   ├── utils/              # Utilities
│   │   └── logger.ts       # Logging utility
│   └── index.ts            # Application entry point
├── tests/                  # Tests
├── docker/                 # Docker configuration
├── .env.example            # Environment variables example
├── .gitignore              # Git ignore file
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Docker configuration
├── package.json            # NPM package configuration
└── tsconfig.json           # TypeScript configuration
```

## User Journeys

### Driver Journey

1. Driver receives a delivery assignment via Telegram
2. Driver updates status as they progress through the delivery
3. Driver can share location for automatic status updates
4. Driver can report issues or delays
5. Driver receives confirmation when status updates are processed

### Manager Journey

1. Manager creates delivery assignments
2. Manager receives automatic updates on delivery progress
3. Manager can query the status of any delivery
4. Manager is alerted to issues or delays
5. Manager can communicate with drivers via the system

## License

MIT 
