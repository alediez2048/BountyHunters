# Truck Driver Communication System

A Telegram-based communication system for truck drivers that streamlines logistics updates between drivers, managers, and recipients.

## Project Overview

This system addresses the challenges truck drivers face when communicating while on the road. Traditional smartphone interfaces aren't practical for hands-free or quick communication, and we need to ensure all stakeholders (shipper, driver, and consignee) can efficiently exchange updates about the truck's journey.

### Key Features

- **Simple Driver Interface**: Telegram-based communication with button-driven interactions
- **Real-time Status Updates**: Automated notifications at key delivery milestones
- **Location Tracking**: Proximity detection and ETA calculations
- **Multi-stakeholder Communication**: Connecting drivers, managers, and recipients
- **Natural Language Processing**: AI-powered message classification and intent recognition

## User Journeys

### Driver Journey
1. Receive delivery assignment via Telegram
2. Confirm assignment with a simple button tap
3. Update status at key milestones (pickup arrival, loading, departure)
4. Report issues or delays during transit
5. Confirm delivery completion

### Manager Experience
1. Create and assign deliveries
2. Monitor real-time delivery status
3. Receive alerts about exceptions
4. View analytics and performance metrics

### Recipient Experience
1. Receive ETA notifications
2. Get updates about delays
3. Confirm successful delivery

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Bot Framework**: Telegram Bot API
- **Containerization**: Docker
- **Testing**: Jest
- **Logging**: Winston

## Project Structure

```
/
├── src/                  # Source code
│   ├── api/              # Express API routes
│   ├── bot/              # Telegram bot handlers
│   ├── models/           # MongoDB schema models
│   ├── services/         # Business logic services
│   └── utils/            # Helper utilities
├── config/               # Configuration files
├── tests/                # Unit and integration tests
└── docker/               # Docker configuration
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB
- Telegram Bot Token (from BotFather)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/truck-driver-communication-system.git
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Copy the environment variables file and update with your values
   ```
   cp .env.example .env
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Development Guidelines

This project follows strict development guidelines defined in the `.cursor.json` file, including:

- RESTful API design principles
- MongoDB best practices
- Telegram Bot implementation standards
- Error handling and security protocols
- Testing requirements
- Code style and documentation standards

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
