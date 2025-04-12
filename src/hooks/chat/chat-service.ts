
import { supabase } from '@/integrations/supabase/client';
import { Message, Conversation } from './types';

// Fetch user's conversations
export const fetchConversations = async () => {
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// Fetch messages for a specific conversation
export const fetchMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  
  // Ensure the role is either 'user' or 'assistant'
  const typedMessages = data?.map(msg => ({
    ...msg,
    role: msg.role === 'user' ? 'user' : 'assistant'
  } as Message)) || [];
  
  return typedMessages;
};

// Create a new conversation
export const createConversation = async (userId: string) => {
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({ user_id: userId })
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
};

// Subscribe to real-time updates for a conversation
export const subscribeToConversation = (
  conversationId: string,
  onNewMessage: (message: Message) => void
) => {
  const channel = supabase
    .channel(`chat-${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `conversation_id=eq.${conversationId}`,
    }, (payload) => {
      const newMessage = {
        ...payload.new,
        role: payload.new.role === 'user' ? 'user' : 'assistant'
      } as Message;
      
      onNewMessage(newMessage);
    })
    .subscribe();
  
  return channel;
};

// Send a message to the AI
export const sendMessageToAI = async (
  message: string, 
  conversationId: string | undefined, 
  userId: string
) => {
  const { data, error } = await supabase.functions.invoke('chat-ai', {
    body: {
      message,
      conversationId,
      userId,
    }
  });
  
  if (error) throw error;
  return data;
};
