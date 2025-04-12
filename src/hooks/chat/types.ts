
// Types for chat functionality
export type Message = {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
};

export type Conversation = {
  id: string;
  created_at: string;
  updated_at: string;
};

export type DebugInfo = {
  processingTime?: string;
  status?: 'idle' | 'processing' | 'complete' | 'error';
  error?: string;
  requestLog?: string;
};
