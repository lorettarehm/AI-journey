
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

// Function to extract technique suggestions from AI response
async function extractAndSaveTechniques(supabase: any, aiResponse: string) {
  // Define patterns to identify technique suggestions
  const techniquePatterns = [
    /technique:\s*([^\.]+)/gi,
    /strategy called\s*["']([^"']+)["']/gi,
    /recommend (using|trying)\s*["']([^"']+)["']/gi,
    /suggested technique:\s*([^\.]+)/gi
  ];
  
  const extractedTechniques = [];
  
  // Process each pattern to find techniques
  for (const pattern of techniquePatterns) {
    let match;
    while ((match = pattern.exec(aiResponse)) !== null) {
      // Get the technique name based on which pattern matched
      const techniqueName = pattern === techniquePatterns[2] ? match[2] : match[1];
      if (techniqueName && techniqueName.length > 3) {
        extractedTechniques.push(techniqueName.trim());
      }
    }
  }
  
  // If techniques were found, save them to the database
  for (const technique of extractedTechniques) {
    // Extract a brief description - take the sentence containing the technique
    const sentences = aiResponse.split(/\.\s+/);
    let description = "";
    
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(technique.toLowerCase())) {
        description = sentence.trim() + ".";
        break;
      }
    }
    
    // If no description found in a specific sentence, use a generic one
    if (!description) {
      description = `A technique for neurodivergent individuals mentioned in AI coaching.`;
    }
    
    // Check if technique already exists to avoid duplicates
    const { data: existingTechnique } = await supabase
      .from("technique_recommendations")
      .select("technique_id")
      .ilike("title", technique)
      .maybeSingle();
      
    if (!existingTechnique) {
      // Save the new technique
      await supabase.from("technique_recommendations").insert({
        title: technique,
        description: description,
        category: "focus", // Default category
        difficulty_level: "beginner", // Default difficulty
        journal: "AI Coach Suggestion",
        publication_date: new Date().toISOString().split('T')[0]
      });
      
      console.log(`New technique saved: ${technique}`);
    }
  }
  
  return extractedTechniques.length;
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
    
    // Validate inputs
    if (!message) {
      throw new Error("Message is required");
    }
    if (!userId) {
      throw new Error("User ID is required");
    }
    
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
      You are a helpful AI assistant deeply specialized in neurodivergence coaching. You have expertise in ADHD, autism, and other neurodivergent conditions.
      You provide supportive, evidence-based advice while being compassionate and understanding.
      
      Previous conversation:
      ${formattedPrompt}
      
      User: ${message}
      Assistant:`;

    console.log("Calling Hugging Face API with prompt:", fullPrompt);
    
    // Get the API key
    const HUGGING_FACE_API_KEY = Deno.env.get("HUGGING_FACE_API_KEY");
    if (!HUGGING_FACE_API_KEY) {
      throw new Error("HUGGING_FACE_API_KEY is not set in environment variables");
    }

    // Call the Hugging Face API
    const hfResponse = await fetch(HUGGING_FACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
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
      throw new Error(`Hugging Face API error: ${hfResponse.status} - ${errorData}`);
    }

    const hfData = await hfResponse.json();
    console.log("Hugging Face API response:", hfData);
    
    let aiResponse = hfData[0]?.generated_text || "";
    
    // Extract only the assistant's response from the generated text
    if (aiResponse.includes("Assistant:")) {
      aiResponse = aiResponse.split("Assistant:").pop()?.trim() || "";
    }

    console.log("Extracted AI response:", aiResponse);

    // Extract and save any techniques mentioned in the AI's response
    const techniquesCount = await extractAndSaveTechniques(supabase, aiResponse);
    if (techniquesCount > 0) {
      console.log(`Saved ${techniquesCount} new techniques from chat response`);
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
      throw new Error(`Error saving assistant message: ${assistantMessageError.message}`);
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
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
