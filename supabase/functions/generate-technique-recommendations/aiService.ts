import { createClient } from "npm:@huggingface/inference@2.6.4";

const HF_TOKEN = Deno.env.get("HUGGING_FACE_API_KEY");
const MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2";
const FALLBACK_MODEL_ID = "gpt2";

interface TechniqueData {
  title: string;
  description: string;
}

export async function generateAIRecommendation(prompt: string): Promise<{ 
  aiRecommendation: string;
  technique: TechniqueData;
}> {
  if (!HF_TOKEN) {
    throw new Error("Hugging Face API key not configured");
  }

  const hf = createClient(HF_TOKEN);

  try {
    const response = await hf.textGeneration({
      model: MODEL_ID,
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
      },
    });

    // Parse the generated text to extract technique and recommendation
    const generatedText = response.generated_text;
    
    // Simple parsing logic - adjust based on your prompt structure
    const [title, ...rest] = generatedText.split('\n');
    const description = rest.join('\n');

    return {
      aiRecommendation: description,
      technique: {
        title: title.trim(),
        description: description.trim()
      }
    };
  } catch (error) {
    console.error("Primary model failed, attempting fallback:", error);

    try {
      // Fallback to a simpler model
      const fallbackResponse = await hf.textGeneration({
        model: FALLBACK_MODEL_ID,
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
        },
      });

      const fallbackText = fallbackResponse.generated_text;
      
      return {
        aiRecommendation: fallbackText,
        technique: {
          title: "Personalized Technique Recommendation",
          description: fallbackText
        }
      };
    } catch (fallbackError) {
      console.error("Fallback model also failed:", fallbackError);
      throw new Error("Failed to generate recommendation with both primary and fallback models");
    }
  }
}