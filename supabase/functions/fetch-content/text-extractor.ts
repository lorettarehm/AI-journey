
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

// Extract clean text content from HTML
export function extractTextContent(html: string): string {
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
export function extractTitle(html: string): string {
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
