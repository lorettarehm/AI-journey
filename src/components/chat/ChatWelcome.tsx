
import React from 'react';

const ChatWelcome: React.FC = () => {
  return (
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
  );
};

export default ChatWelcome;
