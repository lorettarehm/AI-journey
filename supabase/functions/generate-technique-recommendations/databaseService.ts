
// Store AI-generated recommendation in the database
export async function storeRecommendation(
  supabase: any, 
  userId: string, 
  technique: any, 
  aiRecommendation: string,
  userData: any
) {
  try {
    // Extract technique from recommendations view if not provided
    let techniqueData = technique;
    if (!techniqueData) {
      const { data, error } = await supabase
        .from('technique_recommendations')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        throw new Error("Could not fetch a technique recommendation");
      }
      techniqueData = data;
    }

    // Store the AI-generated recommendation
    const { error: recommendationError } = await supabase
      .from('ai_technique_recommendations')
      .insert({
        user_id: userId,
        technique_id: techniqueData.technique_id,
        title: techniqueData.title,
        description: techniqueData.description,
        rationale: aiRecommendation,
        source_data: JSON.stringify(userData)
      });

    if (recommendationError) {
      throw new Error(`Error storing recommendation: ${recommendationError.message}`);
    }

    return techniqueData;
  } catch (error) {
    console.error("Error storing recommendation:", error);
    throw error;
  }
}
