
// Fetch comprehensive user data for personalized recommendations
export async function fetchUserData(supabase: any, userId: string) {
  try {
    const [
      assessments,
      chatHistory,
      techniqueInteractions,
      userCharacteristics,
      userDocuments
    ] = await Promise.all([
      supabase
        .from("assessment_results")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(5),
      
      supabase
        .from("chat_conversations")
        .select(`
          id, 
          chat_messages(content, role)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10),
      
      supabase
        .from("technique_interactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),
      
      supabase
        .from("user_characteristics")
        .select("*")
        .eq("user_id", userId),
      
      supabase
        .from("user_documents")
        .select("*")
        .eq("user_id", userId)
        .eq("processed", true)
    ]);

    return {
      assessments: assessments.data || [],
      chatHistory: chatHistory.data || [],
      techniqueInteractions: techniqueInteractions.data || [],
      userCharacteristics: userCharacteristics.data || [],
      userDocuments: userDocuments.data || []
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
