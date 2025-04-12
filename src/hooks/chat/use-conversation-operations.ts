
import { useToast } from '@/hooks/use-toast';
import { createConversation, fetchConversations } from './chat-service';
import { Conversation } from './types';

export const useConversationOperations = (
  activeConversationId: string | undefined,
  setActiveConversationId: (id: string | undefined) => void,
  setConversations: (conversations: Conversation[]) => void
) => {
  const { toast } = useToast();

  const loadConversations = async (userId: string | undefined) => {
    if (!userId) return;
    
    try {
      const data = await fetchConversations();
      
      setConversations(data || []);
      
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

  const createNewConversation = async (userId: string | undefined) => {
    if (!userId) return;
    
    try {
      const data = await createConversation(userId);
      
      setConversations((prev) => [data, ...prev]);
      setActiveConversationId(data.id);
      return data.id;
    } catch (error) {
      console.error('Error creating new conversation:', error);
      toast({
        title: 'Failed to create new conversation',
        description: 'Please try again later',
        variant: 'destructive',
      });
      return undefined;
    }
  };

  return {
    loadConversations,
    createNewConversation
  };
};
