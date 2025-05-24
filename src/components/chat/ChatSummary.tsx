import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ChatSummary: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch chat messages for summary
  const { data: chatSummaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['chatSummary', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Fetch recent messages to create a summary
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('content, role, conversation_id')
        .eq('role', 'assistant')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (messagesError) throw messagesError;
      
      // Get user characteristics to personalize the summary
      const { data: characteristics, error: characteristicsError } = await supabase
        .from('user_characteristics')
        .select('characteristic')
        .eq('user_id', user.id);
      
      if (characteristicsError) throw characteristicsError;
      
      return {
        messages: messagesData || [],
        traits: characteristics?.map(c => c.characteristic) || []
      };
    },
    enabled: !!user,
  });

  // Generate a summary from actual chat data
  const generateChatSummary = () => {
    if (isSummaryLoading) return "Loading your conversation summary...";
    if (!chatSummaryData || chatSummaryData.messages.length === 0) {
      return "Welcome to your **AIva** coach. This is where you'll see a summary of your conversations and personalized insights based on your interactions.";
    }

    // Extract key topics from assistant messages
    const topicKeywords = ['focus', 'organization', 'emotional regulation', 'time management', 
      'procrastination', 'sensory', 'routine', 'self-advocacy', 'strengths'];
    
    const mentionedTopics = topicKeywords.filter(keyword => 
      chatSummaryData.messages.some(msg => 
        msg.content.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    // Build personalized summary (max ~200 words)
    let summary = "";
    
    if (chatSummaryData.traits.length > 0) {
      summary += `Based on your profile, you've identified with these traits: ${chatSummaryData.traits.slice(0, 3).join(', ')}`;
      if (chatSummaryData.traits.length > 3) summary += ` and ${chatSummaryData.traits.length - 3} more`;
      summary += ". ";
    }
    
    if (mentionedTopics.length > 0) {
      summary += `Your recent conversations have focused on ${mentionedTopics.slice(0, 3).join(', ')}`;
      if (mentionedTopics.length > 3) summary += ` and ${mentionedTopics.length - 3} other topics`;
      summary += ". ";
    }
    
    // Add techniques from content analysis
    const techniqueMatches = chatSummaryData.messages
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
    
    if (techniqueMatches.length > 0) {
      summary += `The **AIva** coach has suggested strategies like ${techniqueMatches.join(', ')}. `;
    }
    
    // Add closing statement
    summary += "Remember that neurodivergent traits also bring significant strengths and unique perspectives. The **AIva** coach is here to help you implement sustainable changes that work with your natural thinking style.";
    
    return summary;
  };

  const chatSummary = generateChatSummary();

  return (
    <div className="w-80 border-r bg-muted/20 p-4 hidden md:block">
      <h3 className="font-medium mb-2">Your **AIva** Summary</h3>
      <p className="text-sm text-muted-foreground whitespace-pre-line">
        {chatSummary}
      </p>
    </div>
  );
};

export default ChatSummary;