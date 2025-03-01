import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { config } from '../../config';
import logger from '../utils/logger';

// Initialize the Groq LLM
const llm = new ChatGroq({
  apiKey: config.ai.groqApiKey,
  model: config.ai.groqModel,
});

// Create a system prompt template for the truck driver communication system
const systemPrompt = `
You are an AI assistant for a truck driver communication system. Your role is to help interpret messages from drivers, 
extract relevant information, and determine the appropriate actions to take.

The system tracks deliveries with the following statuses:
- pending: Delivery is created but not yet assigned
- assigned: Delivery is assigned to a driver
- in_transit: Driver is on the way to pickup location
- arrived_at_pickup: Driver has arrived at the pickup location
- loading: Driver is loading cargo
- departed_from_pickup: Driver has left the pickup location with cargo
- arrived_at_delivery: Driver has arrived at the delivery location
- unloading: Driver is unloading cargo
- completed: Delivery is complete
- cancelled: Delivery is cancelled

When a driver sends a message, analyze it to:
1. Determine if it's a status update
2. Extract location information if provided
3. Identify any issues or special requests
4. Determine the appropriate response

Be conversational and helpful, but focus on extracting actionable information from the message.
`;

/**
 * Process a message from a driver and extract relevant information
 * @param message The message from the driver
 * @param driverContext Additional context about the driver and current delivery
 * @returns Processed information extracted from the message
 */
export const processDriverMessage = async (
  message: string,
  driverContext: {
    driverId: string;
    driverName: string;
    currentDeliveryId?: string;
    currentStatus?: string;
    currentLocation?: { coordinates: number[] };
  }
) => {
  try {
    // Create a prompt template that includes the system prompt and user message
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      [
        'user',
        `Driver ${driverContext.driverName} (ID: ${driverContext.driverId}) sent the following message:
        
        "${message}"
        
        Current context:
        - Current delivery ID: ${driverContext.currentDeliveryId || 'None'}
        - Current status: ${driverContext.currentStatus || 'Unknown'}
        - Current location: ${driverContext.currentLocation ? `[${driverContext.currentLocation.coordinates.join(', ')}]` : 'Unknown'}
        
        Extract the following information in JSON format:
        {
          "isStatusUpdate": boolean,
          "detectedStatus": string or null,
          "locationMentioned": boolean,
          "extractedLocation": string or null,
          "hasIssue": boolean,
          "issueDescription": string or null,
          "needsResponse": boolean,
          "suggestedResponse": string or null
        }`,
      ],
    ]);

    // Create a chain that processes the message
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    // Execute the chain
    const result = await chain.invoke({});

    // Parse the result as JSON
    const parsedResult = JSON.parse(result);

    logger.info('AI processed driver message', {
      driverId: driverContext.driverId,
      messageLength: message.length,
      isStatusUpdate: parsedResult.isStatusUpdate,
      detectedStatus: parsedResult.detectedStatus,
    });

    return parsedResult;
  } catch (error) {
    logger.error('Error processing driver message with AI', {
      error,
      driverId: driverContext.driverId,
      messageLength: message.length,
    });
    
    // Return a default response in case of error
    return {
      isStatusUpdate: false,
      detectedStatus: null,
      locationMentioned: false,
      extractedLocation: null,
      hasIssue: false,
      issueDescription: null,
      needsResponse: true,
      suggestedResponse: "I'm sorry, I couldn't process your message. Could you please rephrase it or provide more details?"
    };
  }
};

/**
 * Generate a response to a driver's message
 * @param message The original message from the driver
 * @param processedInfo The processed information from the message
 * @param driverContext Additional context about the driver and current delivery
 * @returns A response message to send back to the driver
 */
export const generateDriverResponse = async (
  message: string,
  processedInfo: any,
  driverContext: {
    driverName: string;
    currentDeliveryId?: string;
    currentStatus?: string;
  }
) => {
  // If the AI already suggested a response, use it
  if (processedInfo.suggestedResponse) {
    return processedInfo.suggestedResponse;
  }
  
  try {
    // Create a prompt template for generating a response
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      [
        'user',
        `Driver ${driverContext.driverName} sent: "${message}"
        
        Current context:
        - Current delivery ID: ${driverContext.currentDeliveryId || 'None'}
        - Current status: ${driverContext.currentStatus || 'Unknown'}
        
        Based on this analysis:
        ${JSON.stringify(processedInfo, null, 2)}
        
        Generate a helpful, concise response to the driver.`,
      ],
    ]);

    // Create a chain that generates a response
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    // Execute the chain
    const result = await chain.invoke({});
    
    return result;
  } catch (error) {
    logger.error('Error generating driver response with AI', {
      error,
      driverName: driverContext.driverName,
      messageLength: message.length,
    });
    
    // Return a default response in case of error
    return "I'm sorry, I couldn't process your message. Could you please rephrase it or provide more details?";
  }
};

export default {
  processDriverMessage,
  generateDriverResponse,
}; 