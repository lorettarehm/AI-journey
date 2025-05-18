import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectTo } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Send password reset email
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || `${supabaseUrl}/auth/reset-password`,
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Password reset email sent successfully" 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error in reset-password function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred while processing your request" 
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});