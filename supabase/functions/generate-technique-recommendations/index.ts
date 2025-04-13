
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "./cors.ts";
import { fetchUserData } from "./userDataService.ts";
import { createRAGPrompt } from "./promptGenerator.ts";
import { generateAIRecommendation } from "./aiService.ts";
import { storeRecommendation } from "./databaseService.ts";

// Create a Supabase client with the service role key
const createServiceClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  return createClient(supabaseUrl, supabaseServiceKey);
};

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

    // Generate AI recommendation
    const { aiRecommendation, technique } = await generateAIRecommendation(ragPrompt);

    // Store the recommendation
    await storeRecommendation(supabase, userId, technique, aiRecommendation, userData);

    return new Response(
      JSON.stringify({
        recommendation: aiRecommendation,
        technique: technique
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
