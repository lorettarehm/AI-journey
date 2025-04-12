
import React, { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChat } from '@/hooks/use-chat';
import { Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from '@/components/ui/card';

const ChatContainer: React.FC = () => {
  const {
    messages,
    isLoading,
    sendMessage,
    debugInfo,
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Generate a summary from chat interactions
  const chatSummary = `
    Based on your interactions, you've been discussing neurodivergent traits and seeking 
    personalized strategies for managing focus, organization, and emotional regulation. 
    You've expressed interest in techniques for ADHD management, particularly around executive 
    functioning challenges like time management and task initiation. The AI coach has provided 
    you with evidence-based strategies including the Pomodoro Technique, body-doubling, and 
    implementation intentions to help overcome procrastination. You've discussed how these 
    techniques can be adapted to your specific circumstances and preferences. You've also 
    explored topics related to sensory processing, particularly when feeling overwhelmed in 
    busy environments. Recent conversations have focused on building consistent routines 
    and self-advocacy strategies in professional settings. The AI has emphasized the importance 
    of self-compassion throughout your journey and recognizing that neurodivergent traits 
    also bring significant strengths and unique perspectives. Moving forward, you're looking 
    to implement small, sustainable changes rather than overwhelming system overhauls.
  `;

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b bg-background">
        <h2 className="text-lg font-medium">AI Neurodiversity Coach</h2>
        <p className="text-sm text-muted-foreground">
          Chat with your AI coach to get personalized support and strategies
        </p>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Summary sidebar */}
        <div className="w-80 border-r bg-muted/20 p-4 hidden md:block">
          <h3 className="font-medium mb-2">Conversation Summary</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {chatSummary}
          </p>
        </div>

        {/* Main chat area */}
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
      
      <div className="border-t bg-background">
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        
        <Collapsible open={open} onOpenChange={setOpen} className="border-t">
          <CollapsibleTrigger className="flex items-center justify-center w-full py-2 text-xs text-muted-foreground hover:bg-muted/20 transition-colors">
            Debug Information {open ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronUp className="h-4 w-4 ml-1" />}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="m-2 border-muted">
              <CardContent className="p-4 text-xs">
                <h4 className="font-medium mb-2">AI Process Details</h4>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Model:</span> Mistral-7B-Instruct-v0.2
                  </div>
                  <div>
                    <span className="font-medium">Processing Time:</span> {debugInfo?.processingTime || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {debugInfo?.status || 'Idle'}
                  </div>
                  {debugInfo?.error && (
                    <div className="border border-red-300 bg-red-50 text-red-800 p-2 rounded">
                      <span className="font-medium">Error:</span> {debugInfo.error}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">API Request Log:</span>
                    <pre className="mt-1 p-2 bg-slate-100 rounded overflow-x-auto">
                      {debugInfo?.requestLog || 'No requests logged'}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default ChatContainer;
