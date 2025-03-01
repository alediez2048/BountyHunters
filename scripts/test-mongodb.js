require('dotenv').config();
const mongoose = require('mongoose');

async function testMongoDBConnection() {
  try {
    // Get the MongoDB URI from environment variables
    const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    console.log('Connecting to MongoDB...');
    console.log(`Using URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials in logs
    
    // Connect to MongoDB
    await mongoose.connect(uri);
    
    console.log('✅ MongoDB connected successfully!');
    console.log(`Database name: ${mongoose.connection.db.databaseName}`);
    console.log(`Host: ${mongoose.connection.host}`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return false;
  }
}

// Run the test
testMongoDBConnection()
  .then(success => {
    console.log(success ? 'Test completed successfully!' : 'Test failed!');
    process.exit(success ? 0 : 1);
  }); 