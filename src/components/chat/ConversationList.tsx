
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Plus } from 'lucide-react';
import { Conversation } from '@/hooks/use-chat';
import { format } from 'date-fns';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
}) => {
  return (
    <div className="h-full flex flex-col w-full border-r">
      <div className="p-4 border-b">
        <Button 
          onClick={onNewConversation} 
          className="w-full flex items-center gap-2"
          variant="outline"
        >
          <Plus size={16} /> New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No conversations yet
            </div>
          )}
          
          {conversations.map((conv) => (
            <Button
              key={conv.id}
              variant={activeConversationId === conv.id ? "secondary" : "ghost"}
              className="w-full justify-start text-left h-auto py-3"
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="flex items-start gap-3">
                <MessageSquare size={16} className="mt-1 flex-shrink-0" />
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate font-medium">
                    Chat {format(new Date(conv.created_at), 'MMM d, yyyy')}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {format(new Date(conv.created_at), 'h:mm a')}
                  </span>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
