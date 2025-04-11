
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

// Function to create a Supabase client with the service role key
const createServiceClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Function to get conversation history
async function getConversationHistory(supabase: any, conversationId: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching conversation history:", error);
    return [];
  }

  return data || [];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, userId } = await req.json();
    
    // Create a supabase client with the service role
    const supabase = createServiceClient();
    
    // Get the conversation history if a conversation ID is provided
    let history = [];
    let currentConversationId = conversationId;

    if (currentConversationId) {
      history = await getConversationHistory(supabase, currentConversationId);
    } else {
      // Create a new conversation
      const { data: conversation, error: conversationError } = await supabase
        .from("chat_conversations")
        .insert({ user_id: userId })
        .select('id')
        .single();

      if (conversationError) {
        throw new Error(`Error creating conversation: ${conversationError.message}`);
      }
      
      currentConversationId = conversation.id;
    }

    // Store the user message
    const { error: userMessageError } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: currentConversationId,
        role: "user",
        content: message,
      });

    if (userMessageError) {
      throw new Error(`Error saving user message: ${userMessageError.message}`);
    }

    // Format the conversation history for the LLM
    const formattedPrompt = history.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join("\n");

    const fullPrompt = `
      You are a helpful AI assistant specialized in neurodivergence coaching. You have expertise in ADHD, autism, and other neurodivergent conditions.
      You provide supportive, evidence-based advice while being compassionate and understanding.
      
      Previous conversation:
      ${formattedPrompt}
      
      User: ${message}
      Assistant:`;

    // Call the Hugging Face API
    const hfResponse = await fetch(HUGGING_FACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("HUGGING_FACE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
        },
      }),
    });

    if (!hfResponse.ok) {
      const errorData = await hfResponse.text();
      console.error("Hugging Face API error:", errorData);
      throw new Error(`Hugging Face API error: ${hfResponse.status}`);
    }

    const hfData = await hfResponse.json();
    let aiResponse = hfData[0]?.generated_text || "";
    
    // Extract only the assistant's response from the generated text
    if (aiResponse.includes("Assistant:")) {
      aiResponse = aiResponse.split("Assistant:").pop()?.trim() || "";
    }

    // Store the AI response
    const { error: assistantMessageError } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: currentConversationId,
        role: "assistant",
        content: aiResponse,
      });

    if (assistantMessageError) {
      console.error("Error saving assistant message:", assistantMessageError);
    }

    return new Response(
      JSON.stringify({
        response: aiResponse,
        conversationId: currentConversationId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in chat-ai function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
