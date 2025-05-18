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
    // Create a Supabase client with the auth context from the request
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });

    // Get the user from the request
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Check if the user is an admin (this is a simplified check)
    // In a real application, you would check against a database of admin users
    const { data: adminData, error: adminError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();

    if (adminError) {
      throw adminError;
    }

    // For this example, we'll consider users with specific emails as admins
    // In a real app, you'd have a proper roles table or similar
    const isAdmin = adminData?.email?.endsWith("@admin.com") || false;
    
    // Return the user's role
    return new Response(
      JSON.stringify(isAdmin ? "supabase_admin" : "authenticated"),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});