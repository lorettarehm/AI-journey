
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

// Configure CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a summary using text content extraction
async function generateSummary(text: string): Promise<string> {
  try {
    // Simple extractive summarization approach
    // Split into sentences, score each sentence, and select top sentences
    const sentences = text
      .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
      .split("|")
      .filter(s => s.trim().length > 10 && s.split(" ").length > 3);
    
    // Score sentences based on position and length
    const scoredSentences = sentences.map((s, i) => ({
      text: s.trim(),
      score: (1.0 / (i + 1)) * Math.min(s.split(" ").length / 20, 1.5),
      position: i
    }));
    
    // Sort by score and take top sentences (aim for ~200 words)
    const sortedSentences = scoredSentences.sort((a, b) => b.score - a.score);
    
    const summary: string[] = [];
    let wordCount = 0;
    let i = 0;
    
    while (wordCount < 200 && i < sortedSentences.length) {
      const sentenceWords = sortedSentences[i].text.split(" ").length;
      if (wordCount + sentenceWords <= 220) {
        summary.push({
          text: sortedSentences[i].text,
          position: sortedSentences[i].position
        });
        wordCount += sentenceWords;
      }
      i++;
    }
    
    // Sort by original position to maintain narrative flow
    return summary
      .sort((a, b) => a.position - b.position)
      .map(s => s.text)
      .join(" ");
  } catch (error) {
    console.error("Error generating summary:", error);
    return text.slice(0, 800) + "..."; // Fallback to simple truncation
  }
}

// Extract clean text content from HTML
function extractTextContent(html: string): string {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc) return "";
    
    // Remove scripts, styles, and other non-content elements
    const elementsToRemove = ["script", "style", "nav", "footer", "header", "aside"];
    elementsToRemove.forEach(tag => {
      doc.querySelectorAll(tag).forEach(el => el.remove());
    });
    
    // Focus on main content areas
    const contentContainers = [
      "article", 
      "main", 
      ".content", 
      "#content",
      ".post", 
      ".article"
    ];
    
    let content = "";
    
    // Try to get content from main containers first
    for (const selector of contentContainers) {
      const element = doc.querySelector(selector);
      if (element) {
        content = element.textContent.trim();
        break;
      }
    }
    
    // If no content found, use body
    if (!content) {
      content = doc.querySelector("body")?.textContent.trim() || "";
    }
    
    // Clean up the text
    return content
      .replace(/\s+/g, " ")
      .replace(/\n+/g, "\n")
      .trim();
  } catch (error) {
    console.error("Error extracting text content:", error);
    return "";
  }
}

// Extract title from HTML
function extractTitle(html: string): string {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc) return "";
    
    // Try to get title from meta tags first
    const metaTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute("content") ||
                      doc.querySelector('meta[name="twitter:title"]')?.getAttribute("content");
    
    if (metaTitle) return metaTitle;
    
    // Fall back to the title tag
    const titleTag = doc.querySelector("title")?.textContent;
    if (titleTag) return titleTag;
    
    // As a last resort, try to find an h1
    const h1 = doc.querySelector("h1")?.textContent;
    if (h1) return h1;
    
    return "No title found";
  } catch (error) {
    console.error("Error extracting title:", error);
    return "Error extracting title";
  }
}

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
      .from("scraped_content")
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
      .from("scraped_content")
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
