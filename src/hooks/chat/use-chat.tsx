
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChatState } from './use-chat-state';
import { supabase } from '@/integrations/supabase/client';
import { useConversationOperations } from './use-conversation-operations';
import { useMessageOperations } from './use-message-operations';

export const useChat = (conversationId?: string) => {
  const { user } = useAuth();
  const {
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
  } = useChatState(conversationId);

  const { loadConversations, createNewConversation } = useConversationOperations(
    activeConversationId,
    setActiveConversationId,
    setConversations
  );

  const { loadMessages, subscribeToMessages, sendMessage: sendMessageToAPI } = useMessageOperations(
    activeConversationId,
    setMessages,
    setIsLoading,
    setDebugInfo,
    setActiveConversationId,
    setConversations
  );

  useEffect(() => {
    if (!user) return;
    loadConversations(user.id);
  }, [user]);

  useEffect(() => {
    if (!activeConversationId) return;
    
    loadMessages();
    const channel = subscribeToMessages();
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [activeConversationId]);

  const sendMessage = async (message: string) => {
    if (!user) return;
    await sendMessageToAPI(message, user.id);
  };

  return {
    messages,
    conversations,
    activeConversationId,
    isLoading,
    debugInfo,
    sendMessage,
    createNewConversation: () => createNewConversation(user?.id),
    setActiveConversationId,
  };
};

export * from './types';
