
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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

export const useChat = (conversationId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(conversationId);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    status: 'idle',
    processingTime: 'N/A',
    requestLog: 'No requests yet'
  });

  // Fetch user's conversations
  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_conversations')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        
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
    
    fetchConversations();
  }, [user, toast, activeConversationId]);

  // Fetch messages for the active conversation
  useEffect(() => {
    if (!activeConversationId) return;
    
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', activeConversationId)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        // Ensure the role is either 'user' or 'assistant'
        const typedMessages = data?.map(msg => ({
          ...msg,
          role: msg.role === 'user' ? 'user' : 'assistant'
        } as Message)) || [];
        
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
    
    fetchMessages();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel(`chat-${activeConversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${activeConversationId}`,
      }, (payload) => {
        const newMessage = {
          ...payload.new,
          role: payload.new.role === 'user' ? 'user' : 'assistant'
        } as Message;
        
        setMessages((currentMessages) => [...currentMessages, newMessage]);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversationId, toast]);

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
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          message,
          conversationId: activeConversationId,
          userId: user.id,
        }
      });
      
      if (error) throw error;
      
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
        const { data: convData, error: convError } = await supabase
          .from('chat_conversations')
          .select('*')
          .eq('id', data.conversationId)
          .single();
        
        if (!convError && convData) {
          setConversations((prev) => [convData, ...prev]);
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
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({ user_id: user.id })
        .select('*')
        .single();
      
      if (error) throw error;
      
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
