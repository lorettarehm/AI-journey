import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatContainer from '@/components/chat/ChatContainer';

const Chat = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex">
        <div className="flex flex-1 overflow-hidden">
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