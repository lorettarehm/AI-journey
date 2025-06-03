import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// TypeScript interfaces for data structures
interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
  conversation_id: string;
}

interface UserCharacteristic {
  characteristic: string;
}

interface ChatSummaryData {
  messages: ChatMessage[];
  traits: string[];
}

interface ErrorState {
  hasError: boolean;
  message: string;
}

const ChatSummary: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch chat messages for summary with error handling
  const { data: chatSummaryData, isLoading: isSummaryLoading, error: summaryError } = useQuery({
    queryKey: ['chatSummary', user?.id],
    queryFn: async (): Promise<ChatSummaryData | null> => {
      if (!user) return null;
      
      // Fetch recent messages to create a summary
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('content, role, conversation_id')
        .eq('role', 'assistant')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (messagesError) {
        console.error('Error fetching chat messages:', messagesError);
        return {
          messages: [],
          traits: []
        };
      }
      
      // Get user characteristics to personalize the summary
      const { data: characteristics, error: characteristicsError } = await supabase
        .from('user_characteristics')
        .select('characteristic')
        .eq('user_id', user.id);
      
      if (characteristicsError) {
        console.error('Error fetching user characteristics:', characteristicsError);
        return {
          messages: messagesData || [],
          traits: []
        };
      }
      
      return {
        messages: messagesData || [],
        traits: characteristics?.map((c: UserCharacteristic) => c.characteristic) || []
      };
    },
    enabled: !!user,
  });

  // Helper function to extract mentioned topics from messages
  const extractMentionedTopics = (messages: ChatMessage[]): string[] => {
    const topicKeywords = ['focus', 'organization', 'emotional regulation', 'time management', 
      'procrastination', 'sensory', 'routine', 'self-advocacy', 'strengths'];
    
    return topicKeywords.filter(keyword => 
      messages.some(msg => 
        msg.content.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  // Helper function to extract technique matches from messages
  const extractTechniqueMatches = (messages: ChatMessage[]): string[] => {
    return messages
      .flatMap(msg => {
        const content = msg.content.toLowerCase();
        const techniques = [];
        if (content.includes("pomodoro")) techniques.push("Pomodoro Technique");
        if (content.includes("body doub")) techniques.push("Body Doubling");
        if (content.includes("implementation intention")) techniques.push("Implementation Intentions");
        if (content.includes("time block")) techniques.push("Time Blocking");
        if (content.includes("mindful")) techniques.push("Mindfulness Practices");
        return techniques;
      })
      .filter((v, i, a) => a.indexOf(v) === i) // Unique values
      .slice(0, 3);
  };

  // Helper function to build traits summary
  const buildTraitsSummary = (traits: string[]): string => {
    if (traits.length === 0) return "";
    
    let summary = `Based on your profile, you've identified with these traits: ${traits.slice(0, 3).join(', ')}`;
    if (traits.length > 3) summary += ` and ${traits.length - 3} more`;
    summary += ". ";
    return summary;
  };

  // Helper function to build topics summary
  const buildTopicsSummary = (mentionedTopics: string[]): string => {
    if (mentionedTopics.length === 0) return "";
    
    let summary = `Your recent conversations have focused on ${mentionedTopics.slice(0, 3).join(', ')}`;
    if (mentionedTopics.length > 3) summary += ` and ${mentionedTopics.length - 3} other topics`;
    summary += ". ";
    return summary;
  };

  // Helper function to build techniques summary
  const buildTechniquesSummary = (techniqueMatches: string[]): string => {
    if (techniqueMatches.length === 0) return "";
    return `The **AIva** coach has suggested strategies like ${techniqueMatches.join(', ')}. `;
  };

  // Helper function to get closing statement
  const getClosingStatement = (): string => {
    return "Remember that neurodivergent traits also bring significant strengths and unique perspectives. The **AIva** coach is here to help you implement sustainable changes that work with your natural thinking style.";
  };

  // Memoized derived data for performance
  const mentionedTopics = useMemo(() => {
    if (!chatSummaryData?.messages) return [];
    return extractMentionedTopics(chatSummaryData.messages);
  }, [chatSummaryData?.messages]);

  const techniqueMatches = useMemo(() => {
    if (!chatSummaryData?.messages) return [];
    return extractTechniqueMatches(chatSummaryData.messages);
  }, [chatSummaryData?.messages]);

  // Generate a summary from actual chat data
  const generateChatSummary = (): string => {
    // Handle error state
    if (summaryError) {
      return "We're having trouble loading your conversation summary right now. Please try again later.";
    }
    
    // Handle loading state
    if (isSummaryLoading) {
      return "Loading your conversation summary...";
    }
    
    // Handle no data or empty messages
    if (!chatSummaryData || chatSummaryData.messages.length === 0) {
      return "Welcome to your **AIva** coach. This is where you'll see a summary of your conversations and personalized insights based on your interactions.";
    }

    // Build personalized summary (max ~200 words)
    let summary = "";
    
    summary += buildTraitsSummary(chatSummaryData.traits);
    summary += buildTopicsSummary(mentionedTopics);
    summary += buildTechniquesSummary(techniqueMatches);
    summary += getClosingStatement();
    
    return summary;
  };

  const chatSummary = generateChatSummary();

  return (
    <div className="w-80 border-r bg-muted/20 p-4 hidden md:block" role="complementary" aria-label="Chat conversation summary">
      <h3 className="font-medium mb-2" aria-label="Your AIva conversation summary">Your AIva Summary</h3>
      <p className="text-sm text-muted-foreground whitespace-pre-line" aria-live="polite">
        {chatSummary}
      </p>
    </div>
  );
};

export default ChatSummary;