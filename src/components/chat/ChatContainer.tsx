import React from 'react';
import ChatMessagesList from './ChatMessagesList';
import ChatInput from './ChatInput';
import ChatSummary from './ChatSummary';
import ChatDebugInfo from './ChatDebugInfo';
import { useChat } from '@/hooks/chat';

const ChatContainer: React.FC = () => {
  const {
    messages,
    isLoading,
    sendMessage,
    debugInfo,
  } = useChat();

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b bg-background">
        <h2 className="text-lg font-medium">Chat Companion - let's talk...</h2>
        <p className="text-sm text-muted-foreground">
          Chat with your Chat Companion to get personalized content
        </p>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Summary sidebar */}
        <ChatSummary />

        {/* Main chat area */}
        <ChatMessagesList messages={messages} isLoading={isLoading} />
      </div>
      
      <div className="border-t bg-background">
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        <ChatDebugInfo debugInfo={debugInfo} />
      </div>
    </div>
  );
};

export default ChatContainer;