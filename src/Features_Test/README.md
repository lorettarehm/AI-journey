# LLM Testing Module

This module provides utilities for testing LLM API calls directly using curl commands.

## Features

- Generate curl commands to test LLM API calls
- List available LLM models in the system
- Test API calls before they're made by the application

## Usage

```typescript
import { generateCurlCommand, listAvailableModels } from '@/Features_Test';

// Get a list of available models
const models = await listAvailableModels();
console.log('Available models:', models);

// Generate a curl command for the first available model
const prompt = "Hello, how are you today?";
const curlCommand = await generateCurlCommand(prompt);
console.log(curlCommand);

// Generate a curl command for a specific model
const specificModelId = "your-model-id";
const specificCurlCommand = await generateCurlCommand(prompt, specificModelId);
console.log(specificCurlCommand);
```

## How to Disable

To disable this testing functionality, simply remove imports from the Features_Test directory or rename the directory.