
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChat } from '@/hooks/use-chat';
import { Loader2 } from 'lucide-react';

const ChatContainer: React.FC = () => {
  const {
    messages,
    conversations,
    activeConversationId,
    isLoading,
    sendMessage,
    createNewConversation,
    setActiveConversationId,
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b bg-background">
        <h2 className="text-lg font-medium">AI Neurodiversity Coach</h2>
        <p className="text-sm text-muted-foreground">
          Chat with your AI coach to get personalized support and strategies
        </p>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Welcome to your AI Coach</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Get personalized support for ADHD, autism, and other neurodivergent conditions. 
                Ask questions, request strategies, or just have a supportive conversation.
              </p>
            </div>
          )}
          
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
      </div>
      
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatContainer;
