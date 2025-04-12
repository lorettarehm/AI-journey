
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import ChatWelcome from './ChatWelcome';
import { Loader2 } from 'lucide-react';
import { Message } from '@/hooks/chat/types';

interface ChatMessagesListProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessagesList: React.FC<ChatMessagesListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      {messages.length === 0 && !isLoading && <ChatWelcome />}
      
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};

export default ChatMessagesList;
