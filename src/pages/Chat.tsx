
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatContainer from '@/components/chat/ChatContainer';
import ConversationList from '@/components/chat/ConversationList';
import { useChat } from '@/hooks/use-chat';
import { Button } from '@/components/ui/button';
import { MenuIcon, XIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-mobile';

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const {
    conversations,
    activeConversationId,
    createNewConversation,
    setActiveConversationId,
  } = useChat();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar toggle for mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-20 left-4 md:hidden z-50"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <XIcon /> : <MenuIcon />}
            </Button>
          )}
          
          {/* Sidebar / Conversation list */}
          <div
            className={`${
              isMobile
                ? sidebarOpen
                  ? 'fixed inset-0 z-40'
                  : 'hidden'
                : 'w-80 flex-shrink-0'
            }`}
          >
            <div className={`${
              isMobile 
                ? 'fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 z-40 bg-background' 
                : 'h-full'
            }`}>
              <ConversationList
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={(id) => {
                  setActiveConversationId(id);
                  if (isMobile) setSidebarOpen(false);
                }}
                onNewConversation={() => {
                  createNewConversation();
                  if (isMobile) setSidebarOpen(false);
                }}
              />
            </div>
            
            {/* Backdrop for mobile */}
            {isMobile && sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </div>
          
          {/* Main chat area */}
          <div className="flex-1">
            <ChatContainer />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;
