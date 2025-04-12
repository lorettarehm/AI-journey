
import { useState } from 'react';
import { Message, Conversation, DebugInfo } from './types';

export const useChatState = (initialConversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(initialConversationId);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    status: 'idle',
    processingTime: 'N/A',
    requestLog: 'No requests yet'
  });

  return {
    messages,
    setMessages,
    conversations,
    setConversations,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    setIsLoading,
    debugInfo,
    setDebugInfo
  };
};
