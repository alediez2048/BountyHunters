# API Key Authentication

This document explains how to generate, configure, and use API keys for the Truck Driver Communication System.

## Overview

API keys are used to authenticate requests to the API endpoints. All API endpoints (except the Telegram webhook) require a valid API key to be included in the request headers.

## Generating API Keys

To generate API keys, use the provided script:

```bash
# Generate a single API key
npx ts-node scripts/generateApiKey.ts

# Generate multiple API keys (e.g., 3 keys)
npx ts-node scripts/generateApiKey.ts 3

# Generate keys with custom length (e.g., 3 keys with 40 characters each)
npx ts-node scripts/generateApiKey.ts 3 40
```

## Configuring API Keys

Add the generated API keys to your `.env` file:

```
API_KEYS=key1,key2,key3
```

Multiple API keys should be comma-separated without spaces.

## Using API Keys in Requests

When making requests to the API, include the API key in the `x-api-key` header:

```bash
# Example using curl
curl -X GET \
  https://your-api-domain.com/api/deliveries \
  -H 'x-api-key: your-api-key'
```

```javascript
// Example using fetch in JavaScript
fetch('https://your-api-domain.com/api/deliveries', {
  method: 'GET',
  headers: {
    'x-api-key': 'your-api-key'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

## Security Considerations

- Keep your API keys secure and do not expose them in client-side code
- Rotate API keys periodically
- Use different API keys for different clients or environments
- Consider implementing rate limiting for API keys
- Monitor API key usage for suspicious activity

## Error Responses

If authentication fails, the API will respond with one of the following error codes:

- `401 Unauthorized`: API key is missing
- `403 Forbidden`: Invalid API key
- `500 Server Error`: Server-side authentication error 