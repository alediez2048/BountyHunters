# BountyHunters
Truck Driver Communication System A Telegram-based communication system for truck drivers that streamlines logistics updates between drivers, managers, and recipients. 
Project: Truck Driver Communication System (Hackathon #1001)

This is a Telegram-based communication system for truck drivers that streamlines logistics updates between drivers, managers, and recipients. The system uses Node.js, Express, MongoDB, and the Telegram Bot API.

## Project Overview
We're building a lightweight communication system to address the challenges truck drivers face when communicating while on the road. Traditional smartphone interfaces aren't practical for hands-free or quick communication, and we need to ensure all stakeholders (shipper, driver, and consignee) can efficiently exchange updates about the truck's journey.

## User Journey

### Driver Journey:
1. Driver receives delivery assignment via Telegram with details (pickup/delivery locations, cargo info)
2. Driver confirms assignment with a simple button tap
3. Upon arrival at pickup, driver taps "At Pickup" button or sends a message
4. Driver indicates when loading starts and when departed
5. During transit, driver can update status or report issues via simple buttons or messages
6. System detects proximity to destination and sends reminders
7. Driver confirms arrival at delivery location
8. Driver indicates unloading and completion
9. Driver receives brief post-trip survey

### Manager Experience:
1. Manager creates delivery assignments
2. Receives notifications at key milestones (pickup, departure, delivery arrival, completion)
3. Gets immediate alerts about any issues or exceptions
4. Views current status of all active deliveries
5. Receives trip summary after completion

### Recipient Experience:
1. Receives notification when truck departs pickup location with ETA
2. Gets updates about significant delays or issues
3. Receives notification when truck is approaching
4. Gets final confirmation when delivery is complete

## Core components:
1. Telegram bot for driver interaction
2. Express API backend for webhook handling and business logic
3. MongoDB database for storing delivery information
4. AI agent for processing natural language messages

Project structure:
- `/src` - Main source code
  - `/api` - Express API routes
  - `/bot` - Telegram bot handlers
  - `/models` - MongoDB schema models
  - `/services` - Business logic services
  - `/utils` - Helper utilities
- `/config` - Configuration files
- `/tests` - Unit and integration tests
- `/docker` - Docker configuration

Technology stack:
- Node.js v18+
- Express.js
- MongoDB (with Mongoose)
- node-telegram-bot-api
- Docker for containerization

Main features to implement:
- Driver status updates (pickup, loading, departure, delivery)
- Location tracking and proximity detection
- Stakeholder notifications
- Message classification and natural language processing
- Exception reporting and handling

The MVP should be quickly deployable and focus on core communication functionality without requiring specialized apps for drivers.
