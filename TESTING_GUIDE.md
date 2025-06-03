# Enhanced LLM Error Debugging - Testing Guide

This document explains how to test the enhanced error debugging functionality implemented for the Chat Companion.

## What Was Implemented

The Chat Companion now provides detailed debugging information when LLM model calls fail, including:

1. **Exact request payload** sent to each LLM model
2. **Response data** received from each model (if any)
3. **Specific error messages** for each failed attempt
4. **Timestamps** for debugging timing issues
5. **Model information** (name and API URL) for each attempt

## How to Test the Functionality

### Prerequisites
- Have at least one LLM model configured in the `llm_models` table
- Either configure an invalid API key/URL to force errors, or temporarily disable all models

### Test Scenarios

#### Scenario 1: All Models Fail with Different Errors
1. Configure multiple LLM models with invalid API keys or URLs
2. Open the Chat Companion
3. Send a message
4. The chat should show an error message
5. Click on "Debug Information" at the bottom to expand the debug panel
6. You should see:
   - Overall error message about all models failing
   - "Failed LLM Attempts" section showing each model that was tried
   - For each attempt:
     - Model name and API URL
     - Complete request payload (inputs, parameters)
     - Response data (if received)
     - Specific error message
     - Timestamp

#### Scenario 2: Network/API Errors
1. Configure a model with a non-existent API URL
2. Send a message
3. Check debug info for network-related error details

#### Scenario 3: Rate Limiting Errors
1. Configure a model that's likely to hit rate limits
2. Send multiple messages quickly
3. Check debug info for rate limiting error details

## Expected Debug Output Example

When all models fail, the debug panel should show something like:

```
Failed LLM Attempts:

Attempt 1: mistral-7b-instruct (https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2)
Request Payload:
{
  "inputs": "You are **AIva**... User: Hello",
  "parameters": {
    "max_new_tokens": 1024,
    "temperature": 0.7,
    "top_p": 0.9,
    "do_sample": true
  }
}
Response Data:
{
  "error": "Model is currently loading"
}
Error: API error: 503 - Model is currently loading
Timestamp: 1/1/2024, 12:00:00 PM

Attempt 2: llama-2-7b-chat (https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf)
Request Payload: [same as above]
Error: Network timeout
Timestamp: 1/1/2024, 12:00:30 PM
```

## Verification Checklist

- [ ] Error messages are user-friendly but informative
- [ ] Debug panel shows detailed information for each failed model attempt
- [ ] Request payloads are correctly captured and displayed
- [ ] Response data is shown when available
- [ ] Timestamps help identify timing issues
- [ ] UI remains responsive and collapsible

## Benefits for Debugging

This enhancement provides several key benefits:

1. **Transparency**: Users can see exactly what's happening when errors occur
2. **Debugging Support**: Technical users can diagnose API issues
3. **Model Comparison**: Compare how different models respond to the same input
4. **Error Classification**: Distinguish between network errors, API errors, and model-specific issues
5. **Timing Analysis**: Understand response times and timeout patterns

## Code Changes Summary

The implementation required minimal changes across three files:
- `supabase/functions/chat-ai/index.ts`: Enhanced error collection and reporting
- `src/hooks/chat/use-message-operations.ts`: Improved error data extraction
- `src/components/chat/ChatDebugInfo.tsx`: Enhanced UI for displaying debug details