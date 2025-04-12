
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { decode as base64Decode } from "https://deno.land/std@0.170.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    // Create clients
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body
    const { documentId } = await req.json();
    
    if (!documentId) {
      return new Response(
        JSON.stringify({ error: "Document ID is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get document info from database
    const { data: document, error: docError } = await supabaseAdmin
      .from("user_documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (docError || !document) {
      return new Response(
        JSON.stringify({ error: "Document not found", details: docError }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Download the file
    const { data: fileData, error: fileError } = await supabaseAdmin
      .storage
      .from("user_documents")
      .download(document.file_path);

    if (fileError || !fileData) {
      return new Response(
        JSON.stringify({ error: "Error downloading the file", details: fileError }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Basic text extraction from PDF and other types
    // This is a simplified version - in production, you'd want more robust parsing
    let extractedText = "";
    try {
      // For text-based files
      if (document.file_type === "text/plain") {
        extractedText = await fileData.text();
      } 
      // For PDF files, we'd need more sophisticated handling
      // This is a placeholder for where you'd use a PDF extraction library
      else if (document.file_type === "application/pdf") {
        extractedText = "PDF content extraction would require an additional library";
      }
      // For other file types
      else {
        extractedText = `Content extraction not supported for file type: ${document.file_type}`;
      }
    } catch (error) {
      console.error("Text extraction error:", error);
      extractedText = "Error extracting text: " + error.message;
    }

    // Update the document with extracted text
    const { error: updateError } = await supabaseAdmin
      .from("user_documents")
      .update({ 
        content_text: extractedText,
        processed: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", documentId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Error updating document", details: updateError }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, text_length: extractedText.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing document:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
