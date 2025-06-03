
import { useToast } from '@/hooks/use-toast';
import { fetchMessages, sendMessageToAI, subscribeToConversation } from './chat-service';
import { Message, DebugInfo } from './types';
import { supabase } from '@/integrations/supabase/client';

export const useMessageOperations = (
  activeConversationId: string | undefined,
  setMessages: (messages: Message[] | ((prevMessages: Message[]) => Message[])) => void,
  setIsLoading: (isLoading: boolean) => void,
  setDebugInfo: (debugInfo: DebugInfo | ((prev: DebugInfo) => DebugInfo)) => void,
  setActiveConversationId: (id: string | undefined) => void,
  setConversations: (conversations: any) => void
) => {
  const { toast } = useToast();

  const loadMessages = async () => {
    if (!activeConversationId) return;
    
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

  const subscribeToMessages = () => {
    if (!activeConversationId) return null;
    
    const handleNewMessage = (newMessage: Message) => {
      setMessages((currentMessages) => [...currentMessages, newMessage]);
    };
    
    const channel = subscribeToConversation(activeConversationId, handleNewMessage);
    return channel;
  };

  const sendMessage = async (message: string, userId: string) => {
    if (!message.trim() || !userId) return;
    
    setIsLoading(true);
    setDebugInfo({
      status: 'processing',
      processingTime: 'Calculating...',
      requestLog: `Sending message: "${message}"\n`
    });

    const startTime = Date.now();
    
    try {
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, tempUserMessage]);
      
      const tempAssistantMessage: Message = {
        id: `temp-assistant-${Date.now()}`,
        role: 'assistant',
        content: '...',
        created_at: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, tempAssistantMessage]);
      
      const data = await sendMessageToAI(message, activeConversationId, userId);
      
      const processingTime = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
      setDebugInfo(prev => ({
        status: 'complete',
        processingTime,
        requestLog: prev.requestLog + `Response received in ${processingTime}\n`,
        responseData: data
      }));
      
      if (data.conversationId && !activeConversationId) {
        setActiveConversationId(data.conversationId);
        
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
      
      // Update the temporary assistant message with the real response
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === tempAssistantMessage.id 
            ? { ...msg, content: data.response, id: `real-${Date.now()}` } 
            : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Extract debug information if available from error response
      let debugData = null;
      let errorMessage = error.message;
      
      // Check if the error has debug information from the API response
      if (error?.details?.data?.debugInfo) {
        debugData = error.details.data.debugInfo;
      } else if (error?.details?.data?.error) {
        errorMessage = error.details.data.error;
        if (error.details.data.debugInfo) {
          debugData = error.details.data.debugInfo;
        }
      }
      
      setDebugInfo(prev => ({
        status: 'error',
        processingTime: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
        requestLog: prev.requestLog + `Error: ${errorMessage}\n`,
        error: errorMessage,
        responseData: debugData || prev.responseData
      }));
      
      toast({
        title: 'Failed to send message',
        description: debugData ? 'Check debug information for details' : 'Please try again later',
        variant: 'destructive',
      });
      
      // Remove the temporary messages on error
      setMessages(prevMessages => {
        // Create filtered messages array by removing temporary messages
        const filteredMessages = prevMessages.filter(msg => {
          // We need to identify the specific temp messages to remove
          // from this specific send operation
          return !(
            (msg.id === `temp-${Date.now()}`) || 
            (msg.id === `temp-assistant-${Date.now()}`)
          );
        });
        return filteredMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loadMessages,
    subscribeToMessages,
    sendMessage
  };
};
