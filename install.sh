#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file from .env.example..."
  cp .env.example .env
  echo "Please update the .env file with your actual credentials."
fi

# Create logs directory if it doesn't exist
if [ ! -d logs ]; then
  echo "Creating logs directory..."
  mkdir -p logs
fi

echo "Installation complete!"
echo "To start the development server, run: npm run dev" 