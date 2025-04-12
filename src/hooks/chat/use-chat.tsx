
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useChatState } from './use-chat-state';
import { Message } from './types';
import { 
  fetchConversations, 
  fetchMessages, 
  createConversation, 
  subscribeToConversation,
  sendMessageToAI
} from './chat-service';

export const useChat = (conversationId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
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

  // Fetch user's conversations
  useEffect(() => {
    if (!user) return;
    
    const loadConversations = async () => {
      try {
        const data = await fetchConversations();
        
        setConversations(data || []);
        
        // If no active conversation is set, use the most recent one
        if (!activeConversationId && data && data.length > 0) {
          setActiveConversationId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: 'Failed to load conversations',
          description: 'Please try again later',
          variant: 'destructive',
        });
      }
    };
    
    loadConversations();
  }, [user, toast, activeConversationId, setActiveConversationId, setConversations]);

  // Fetch messages for the active conversation
  useEffect(() => {
    if (!activeConversationId) return;
    
    const loadMessages = async () => {
      try {
        const typedMessages = await fetchMessages(activeConversationId);
        setMessages(typedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: 'Failed to load messages',
          description: 'Please try again later',
          variant: 'destructive',
        });
      }
    };
    
    loadMessages();
    
    // Set up real-time subscription for new messages
    const handleNewMessage = (newMessage: Message) => {
      setMessages((currentMessages) => [...currentMessages, newMessage]);
    };
    
    const channel = subscribeToConversation(activeConversationId, handleNewMessage);
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversationId, toast, setMessages]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || !user) return;
    
    setIsLoading(true);
    setDebugInfo({
      status: 'processing',
      processingTime: 'Calculating...',
      requestLog: `Sending message: "${message}"\n`
    });

    const startTime = Date.now();
    
    try {
      // Show a temporary user message immediately
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      };
      
      // Add optimistic user message
      setMessages(prevMessages => [...prevMessages, tempUserMessage]);
      
      // Also add an optimistic "thinking" assistant message
      const tempAssistantMessage: Message = {
        id: `temp-assistant-${Date.now()}`,
        role: 'assistant',
        content: '...',
        created_at: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, tempAssistantMessage]);
      
      // Use the edge function to process the message
      const data = await sendMessageToAI(message, activeConversationId, user.id);
      
      // Update debug info with response time
      const processingTime = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
      setDebugInfo(prev => ({
        status: 'complete',
        processingTime,
        requestLog: prev.requestLog + `Response received in ${processingTime}\n`
      }));
      
      // If a new conversation was created, update the active conversation ID
      if (data.conversationId && !activeConversationId) {
        setActiveConversationId(data.conversationId);
        
        // Add the new conversation to the list
        try {
          const { data: convData, error: convError } = await supabase
            .from('chat_conversations')
            .select('*')
            .eq('id', data.conversationId)
            .single();
          
          if (!convError && convData) {
            setConversations((prev) => [convData, ...prev]);
          }
        } catch (error) {
          console.error('Error fetching new conversation:', error);
        }
      }
      
      // Replace the optimistic assistant message with the real content
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === `temp-assistant-${Date.now()}` 
            ? { ...msg, content: data.response, id: `real-${Date.now()}` } 
            : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update debug info with error
      setDebugInfo(prev => ({
        status: 'error',
        processingTime: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
        requestLog: prev.requestLog + `Error: ${error.message}\n`,
        error: error.message
      }));
      
      toast({
        title: 'Failed to send message',
        description: 'Please try again later',
        variant: 'destructive',
      });
      
      // Remove the optimistic messages if there was an error
      setMessages(prevMessages => 
        prevMessages.filter(msg => 
          msg.id !== `temp-${Date.now()}` && msg.id !== `temp-assistant-${Date.now()}`
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    if (!user) return;
    
    try {
      const data = await createConversation(user.id);
      
      setConversations((prev) => [data, ...prev]);
      setActiveConversationId(data.id);
      setMessages([]);
    } catch (error) {
      console.error('Error creating new conversation:', error);
      toast({
        title: 'Failed to create new conversation',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  return {
    messages,
    conversations,
    activeConversationId,
    isLoading,
    debugInfo,
    sendMessage,
    createNewConversation,
    setActiveConversationId,
  };
};

// Re-export the types for convenience
export * from './types';

// Import supabase for the channel removal
import { supabase } from '@/integrations/supabase/client';
