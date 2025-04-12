
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { extractTextContent, extractTitle } from "./text-extractor.ts";
import { generateSummary } from "./summarizer.ts";
import { corsHeaders } from "./cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if we already have this URL in the database
    const { data: existingData } = await supabase
      .from("web_library_content")
      .select("*")
      .eq("url", url)
      .maybeSingle();
    
    if (existingData) {
      return new Response(
        JSON.stringify({ 
          message: "Content already exists", 
          data: existingData 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Fetch the content
    console.log(`Fetching content from ${url}`);
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: `Failed to fetch content: ${response.status} ${response.statusText}` 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const html = await response.text();
    
    // Extract the content
    const title = extractTitle(html);
    const rawContent = extractTextContent(html);
    const summary = await generateSummary(rawContent);
    
    // Store in the database
    const { data, error } = await supabase
      .from("web_library_content")
      .insert({
        url,
        title,
        raw_content: rawContent,
        summary
      })
      .select()
      .single();
    
    if (error) {
      console.error("Database insertion error:", error);
      return new Response(
        JSON.stringify({ error: `Failed to store content: ${error.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        message: "Content scraped and stored successfully", 
        data 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: `An unexpected error occurred: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
