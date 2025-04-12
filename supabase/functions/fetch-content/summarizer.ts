
// Create a summary using text content extraction
export async function generateSummary(text: string): Promise<string> {
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
    
    const summary: Array<{text: string, position: number}> = [];
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
