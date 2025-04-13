
// Generate AI recommendation using Hugging Face API
export async function generateAIRecommendation(ragPrompt: string) {
  try {
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

    return { aiRecommendation, technique: null };
  } catch (error) {
    console.error("Error generating AI recommendation:", error);
    throw error;
  }
}
