
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client with the service role key
const createServiceClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Fetch comprehensive user data for personalized recommendations
async function fetchUserData(supabase: any, userId: string) {
  try {
    const [
      assessments,
      chatHistory,
      techniqueInteractions,
      userCharacteristics,
      userDocuments
    ] = await Promise.all([
      supabase
        .from("assessment_results")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(5),
      
      supabase
        .from("chat_conversations")
        .select(`
          id, 
          chat_messages(content, role)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10),
      
      supabase
        .from("technique_interactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),
      
      supabase
        .from("user_characteristics")
        .select("*")
        .eq("user_id", userId),
      
      supabase
        .from("user_documents")
        .select("*")
        .eq("user_id", userId)
        .eq("processed", true)
    ]);

    return {
      assessments: assessments.data || [],
      chatHistory: chatHistory.data || [],
      techniqueInteractions: techniqueInteractions.data || [],
      userCharacteristics: userCharacteristics.data || [],
      userDocuments: userDocuments.data || []
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

// Generate a detailed prompt for the LLM to create personalized recommendations
function createRAGPrompt(userData: any) {
  const { 
    assessments, 
    chatHistory, 
    techniqueInteractions, 
    userCharacteristics 
  } = userData;

  // Analyze assessment data
  const latestAssessment = assessments[0] || {};
  const assessmentAnalysis = `
    User's latest assessment shows:
    - Focus Level: ${latestAssessment.focus_level}
    - Energy Level: ${latestAssessment.energy_level}
    - Stress Level: ${latestAssessment.stress_level}
    - Emotional Regulation: ${latestAssessment.emotional_regulation}
    - Task Switching Ability: ${latestAssessment.task_switching}
  `;

  // Analyze user characteristics
  const characteristicsAnalysis = userCharacteristics
    .map(char => `- ${char.characteristic}: ${char.description || ''}`)
    .join('\n');

  // Analyze technique interactions
  const techniqueInteractionSummary = techniqueInteractions
    .map(interaction => `
      Technique: ${interaction.technique_title}
      Feedback: ${interaction.feedback || 'No specific feedback'}
    `)
    .join('\n');

  return `
    You are an AI coach specializing in neurodivergent support. Provide a highly personalized technique recommendation.

    User Profile Analysis:
    ${assessmentAnalysis}

    User Characteristics:
    ${characteristicsAnalysis}

    Previous Technique Interactions:
    ${techniqueInteractionSummary}

    Based on this comprehensive profile, recommend ONE technique that:
    1. Directly addresses the user's specific challenges
    2. Builds upon their existing strengths
    3. Is likely to be both challenging and achievable

    Your recommendation should:
    - Be specific to the user's neurodivergent profile
    - Include clear implementation steps
    - Explain why this technique is particularly suited to this individual
  `;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error("User ID is required");
    }

    const supabase = createServiceClient();
    
    // Fetch comprehensive user data
    const userData = await fetchUserData(supabase, userId);
    
    if (!userData) {
      throw new Error("Could not retrieve user data");
    }

    // Generate RAG prompt
    const ragPrompt = createRAGPrompt(userData);

    // Call Hugging Face API to generate recommendation
    const HUGGING_FACE_API_KEY = Deno.env.get("HUGGING_FACE_API_KEY");
    const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

    const hfResponse = await fetch(HUGGING_FACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: ragPrompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
        },
      }),
    });

    if (!hfResponse.ok) {
      throw new Error(`Hugging Face API error: ${hfResponse.status}`);
    }

    const hfData = await hfResponse.json();
    const aiRecommendation = hfData[0]?.generated_text || "";

    // Extract technique from recommendations view
    const { data: techniques, error: techniqueError } = await supabase
      .from('technique_recommendations')
      .select('*')
      .limit(1)
      .single();

    if (techniqueError) {
      throw new Error("Could not fetch a technique recommendation");
    }

    // Store the AI-generated recommendation
    const { error: recommendationError } = await supabase
      .from('ai_technique_recommendations')
      .insert({
        user_id: userId,
        technique_id: techniques.technique_id,
        title: techniques.title,
        description: techniques.description,
        rationale: aiRecommendation,
        source_data: JSON.stringify(userData)
      });

    if (recommendationError) {
      throw new Error(`Error storing recommendation: ${recommendationError.message}`);
    }

    return new Response(
      JSON.stringify({
        recommendation: aiRecommendation,
        technique: techniques
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error in recommendation generation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
