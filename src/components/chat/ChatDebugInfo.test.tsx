import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatDebugInfo from './ChatDebugInfo';
import { DebugInfo } from '@/hooks/chat/types';

describe('ChatDebugInfo', () => {
  it('renders debug information without failed attempts', () => {
    const debugInfo: DebugInfo = {
      processingTime: '2.5s',
      status: 'complete',
      requestLog: 'Request sent successfully',
      responseData: { message: 'Hello world' }
    };

    render(<ChatDebugInfo debugInfo={debugInfo} />);
    
    expect(screen.getByText('Debug Information')).toBeInTheDocument();
    expect(screen.getByText('2.5s')).toBeInTheDocument();
    expect(screen.getByText('complete')).toBeInTheDocument();
  });

  it('renders failed LLM attempts when present', () => {
    const debugInfo: DebugInfo = {
      processingTime: '5.0s',
      status: 'error',
      error: 'All LLM models failed',
      requestLog: 'Multiple attempts failed',
      responseData: {
        failedAttempts: [
          {
            model: 'test-model-1',
            api_url: 'https://api.test.com/model1',
            request_payload: {
              inputs: 'Test prompt',
              parameters: { max_new_tokens: 1024 }
            },
            response_data: { error: 'Model overloaded' },
            error: 'API error: 503 - Model overloaded',
            timestamp: '2024-01-01T12:00:00.000Z'
          },
          {
            model: 'test-model-2',
            api_url: 'https://api.test.com/model2',
            request_payload: {
              inputs: 'Test prompt',
              parameters: { max_new_tokens: 1024 }
            },
            error: 'Network timeout',
            timestamp: '2024-01-01T12:00:30.000Z'
          }
        ]
      }
    };

    render(<ChatDebugInfo debugInfo={debugInfo} />);
    
    // Check that failed attempts section is rendered
    expect(screen.getByText('Failed LLM Attempts:')).toBeInTheDocument();
    expect(screen.getByText('Attempt 1: test-model-1 (https://api.test.com/model1)')).toBeInTheDocument();
    expect(screen.getByText('Attempt 2: test-model-2 (https://api.test.com/model2)')).toBeInTheDocument();
    
    // Check that request payloads are shown
    expect(screen.getByText('Request Payload:')).toBeInTheDocument();
    expect(screen.getByText('"inputs": "Test prompt"')).toBeInTheDocument();
    
    // Check that errors are displayed
    expect(screen.getByText('API error: 503 - Model overloaded')).toBeInTheDocument();
    expect(screen.getByText('Network timeout')).toBeInTheDocument();
  });

  it('handles debug info without responseData gracefully', () => {
    const debugInfo: DebugInfo = {
      processingTime: '1.0s',
      status: 'error',
      error: 'Network error',
      requestLog: 'Request failed'
    };

    render(<ChatDebugInfo debugInfo={debugInfo} />);
    
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.queryByText('Failed LLM Attempts:')).not.toBeInTheDocument();
  });
});